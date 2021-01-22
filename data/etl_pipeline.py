import pandas as pd
from pathlib import Path
import numpy as np
import dateparser
import lorem
from sqlalchemy import create_engine
from psycopg2.extensions import register_adapter, AsIs
import itertools
import cleaning_pipeline
import requests
import json

""" Script to execute a pipeline to extract, transform and load data into a RDB.
The main pipeline stages are:
1) Data Preparation: data cleaning and formatting
2) Data extraction and transformation: extract data from wide dataframe format accordingly to the 
                                        a relational schema and constraints.
3) Write data to the database.
"""


## Pandas to SQL helper functions

def extract_unique_values(column):
    if isinstance(column.dtype, pd.CategoricalDtype):
        values = column.cat.categories.values 
    elif isinstance(column.dtype, pd.StringDtype):
        values = set(column.values)
    else: # for object dtype
        values = itertools.chain.from_iterable(column.values) # extract column values from df and flatten it out
        values = set(values) # make unique
    return list(values)
        
def swap_index_with_col(df, col_name, id_col_name):
    """
    swap the index of the input dataframe (df) with the col_name column.
    This is an helper function for creating a lookup table.
     
    """
    new_df = df.copy()
    new_df[id_col_name] = new_df.index
    
    return new_df.set_index(col_name)

def generate_fk(fk_col, parent_table, parent_col_name):
    """
    Generate a fk column looking into a lookup table.
    The values inside fk_col are replaced with the corrisponding value index in the parent_table.
    parent_col_name is the column in the parent table where lookup takes place.
    
    eg. fk_col = ['b','c','a']
        parent_table = [[1,'a'],['2','b'],[3,'c']
        function output is a  new fk_col = [2,3,1]
    """
    id_col = 'id'
    lookup = swap_index_with_col(parent_table, 
                                 parent_col_name,
                                 id_col_name=id_col) # make a lookup table with parent_col_name as index and id_col as value
    if isinstance(fk_col.dtype, pd.StringDtype):
        new_fk_col = fk_col.apply(lambda value: lookup.loc[value,id_col]) # replace names with integer id
    else: # for column with list-like elements
        new_fk_col = fk_col.apply(lambda values: [lookup.loc[val,id_col] for val in values]) # replace names with integer id
    
    return new_fk_col

def generate_joint_table(df_master, join_col, left_table, right_table, lookup_col, left_pk, right_pk):
    
    joint = pd.DataFrame({left_pk: left_table.index,
                          right_pk: generate_fk(df_master[join_col],right_table, lookup_col)})
    
    return joint.explode(right_pk, ignore_index=True)


## Helper function to generate fake data

def get_fake_profile_image_url(df):
    json_response = requests.get(url = "https://fakeface.rest/face/json", params={'minimum_age':25, 'maximum_age':65})
    response = json.loads(json_response.text)
    return response['image_url']





# Functions to generate dataframes ready to be exported "as-is" as relational tables.

def generate_tag_table(df):
    return pd.DataFrame({'label': extract_unique_values(df['tags'])})

def generate_topic_table(df, tag_table):
    return  generate_joint_table(df, 'tags', df['claimURL'], tag_table, 'label', 'review_id', 'tag_id')

def generate_external_entity_table(df):
    return pd.DataFrame({'label': extract_unique_values(df['entities'])})

def generate_mention_table(df, external_entity_table):
    return generate_joint_table(df, 'entities', df['claimURL'], external_entity_table, 'label', 'review_id', 'entity_id')


def generate_agent_table(df):
    ## Claimants agents
    claimants = pd.DataFrame({'name': extract_unique_values(df['speaker']),
                            'type': 'person',
                            'role': 'claimant'
                            })
    # some claimants are organizations
    organization_filter = claimants['name'].isin(['NRSC','Election TV Ads',
                            'Various websites','FactCheck.org',
                            'Viral Claim', 'National Republican Senatorial Committee',
                            'Senate Majority PAC','Senate Leadership Fund'])

    claimants.loc[organization_filter ,'type'] = 'organization' # manual adjustment


    ## Fact checkers agents
    factcheckers = pd.DataFrame({'name': extract_unique_values(df['checker']),
                                'type': 'person',
                                'role': 'factchecker'
                            })

    # remove FactCheck.org row because is inserted after with organization group
    mask = factcheckers.loc[factcheckers['name'] == 'FactCheck.org'].index
    factcheckers.drop(mask)


    ## Organizations agents
    organizations = pd.DataFrame({'name': ['FactCheck.org','Pagella Politica', 'LaVoce.info','PolitiFact', 
                                        'WashingtonPost','International Fact Checking Network',
                                        'Duke Reporter lab'],
                                'type': 'organization',
                                'role': 'factchecker'
                                })
    ## Software agents
    software_bots = pd.DataFrame({'name': ['DeepFakeTwitter','DistoClaim','HAL9000'],
                                'type': 'software',
                                'role': 'claimant'
                                })
    # organization MUST be inserted before factchecker due to self referential foreign key
    agents = pd.concat([organizations, claimants, factcheckers, software_bots], ignore_index=True)


    ## Generate random affiliations 
    fc_organizations = agents[(agents['type'] == 'organization') & (agents['role'] == 'factchecker')]
    fc_person = agents[(agents['type'] == 'person') & (agents['role'] == 'factchecker')]
    random_affiliations_indeces = np.random.choice(fc_organizations.index, size=len(fc_person))

    agents.loc[fc_person.index,'affiliation_id'] = random_affiliations_indeces

    # Generate random fake profile images
    agents['image_url'] = np.nan
    person_checker_mask = (agents['type'] == 'person') & (agents['role'] == 'factchecker') # filter only real human factcheckers
    agents['image_url'] = agents.loc[person_checker_mask,'image_url'].apply(get_fake_profile_image_url) # add a fake profile image
    
    return agents

# Script mode
if __name__ == '__main__':
    random_seed = np.random.seed(1620) # for reproducibility

    multi_fc_dataset = Path("./raw/MultiFC_train.tsv")
    df = cleaning_pipeline.execute_data_preparation(multi_fc_dataset)
    print(df.head())


    tables = {}
    
    tables['tag'] = generate_tag_table(df)
    tables['topic'] = generate_topic_table(df, tables['tag'])

    tables['external_entity'] = generate_external_entity_table(df)
    tables['mention'] = generate_mention_table(df, tables['external_entity'])

    tables['agent'] = generate_agent_table(df)
    print(tables['agent'])