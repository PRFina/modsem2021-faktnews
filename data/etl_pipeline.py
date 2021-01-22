from pathlib import Path
from urllib.parse import urlparse
import itertools
import json
import numpy as np
import pandas as pd
import dateparser
import lorem
import requests
from sqlalchemy import create_engine
from psycopg2.extensions import register_adapter, AsIs

from collections import OrderedDict



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


def extract_title_from_url(url_string):
    return urlparse(url_string).path.strip("/").split("/")[-1].replace("-"," ")




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


def generate_claim_table(df, agent_table):
    claims = df[['claim','speaker','claimDate','claimURL']].copy()


    claimants = agent_table[agent_table['role']=='claimant'].astype({'name':'string'}) # filter only claimant agents

    claims.loc[:,'speaker'] = generate_fk(df['speaker'], claimants, 'name') #replace names with id
    claims['language'] = 'en'
    claims = claims.rename({'claim': 'content', #align to SQL schema
                            'speaker': 'claimant_id',
                            'claimDate': 'publication_date',
                            'claimURL': 'url'}, axis='columns') # WARNING! claimURL is the review article URL, since no data is provided on the claim source url, we used this one

    return claims


def generate_rating_table(df):
    rating_systems = ['https://www.politifact.com/article/2018/feb/12/principles-truth-o-meter-politifacts-methodology-i/#Truth-O-Meter%20ratings',
                  'https://pagellapolitica.it/static/metodologia',
                  'https://www.lavoce.info/come-facciamo-il-fact-checking/']


    ratings = pd.DataFrame({'value': df['label'],
                            'comment': pd.Series(dtype='string'),
                            'media_url':'',
                            'system_url':np.random.choice(rating_systems,size=len(df['label']))})

    # generate fake rating media association (only for Politifact)
    associated_media = {'False': 'https://static.politifact.com/img/meter-false.jpg',
                        'Mostly False': 'https://static.politifact.com/img/meter-mostly-false.jpg',
                        'Mostly True': 'https://static.politifact.com/img/meter-mostly-true.jpg',
                        'True': 'https://static.politifact.com/img/meter-mostly-true.jpg'}

    politifact_mask = ratings[ratings['system_url']=='https://www.politifact.com/article/2018/feb/12/principles-truth-o-meter-politifacts-methodology-i/#Truth-O-Meter%20ratings'].index
    ratings['media_url'] = ratings.iloc[politifact_mask].apply(lambda row: associated_media[row['value']], axis='columns')

    # generate fake random comment 
    ratings['comment'] = ratings['comment'].apply(lambda x: lorem.sentence())

    return ratings # just for naming consistence


def generate_judgment_table(df, liarplus_path, random_seed):
    liar_df = pd.read_json(liarplus_path, lines=True)
    # random sample justification from liar plus dataset
    # WARNING! The sampling procedure is naive, this means that no sense records could be produced
    # i.e [Missing Context, "Donald Trump this time is completely right!"]

    liarplus_justifications = (liar_df['justification'].sample(n=len(df),random_state=random_seed)
                                                    .reset_index(drop=True))

    judgment_table = pd.DataFrame({'label': df['reason'],
                                'justification': liarplus_justifications})

    return judgment_table


def generate_review_table(df, rating_table, judgment_table):
    reviews = df[['publishDate','claimURL']].copy()

    reviews = reviews.rename({'publishDate': 'publication_date',
                              'claimURL': 'url'}, axis='columns')

    reviews['title'] = reviews['url'].apply(extract_title_from_url)
    
    reviews['content'] = np.nan
    reviews['content'] = reviews['content'].apply(lambda x: lorem.sentence())
    
    reviews['language'] = 'en'
    reviews['rating_id'] = rating_table.index
    reviews['judgment_id'] = judgment_table.index

    return reviews


def generate_review_author_table(df, agent_table):
    factcheckers = agent_table[agent_table['role']=='factchecker'].astype({'name':'string'}) # filter only factcheckers agents
    
    return generate_joint_table(df, 'checker', df['claimURL'], factcheckers, 'name', 'review_id', 'agent_id')

def generate_about_table(df, review_table, claim_table):
    return pd.DataFrame({'review_id': review_table.index, 'claim_id': claim_table.index})



def generate_db_tables(df, liarplus_dataset_path, random_seed):
    tables = OrderedDict() # order is important due to fk constraints and record insertion order
    
    tables['tag'] = generate_tag_table(df)
    tables['rating'] =  generate_rating_table(df)
    tables['judgment'] = generate_judgment_table(df, liarplus_dataset_path, random_seed)
    tables['review'] = generate_review_table(df, tables['rating'], tables['judgment'])
    tables['agent'] = generate_agent_table(df)
    tables['claim'] = generate_claim_table(df, tables['agent'])
    tables['external_entity'] = generate_external_entity_table(df)    
    tables['mention'] = generate_mention_table(df, tables['external_entity'])
    tables['topic'] = generate_topic_table(df, tables['tag'])
    tables['review_author'] = generate_review_author_table(df, tables['agent'])
    tables['about'] = generate_about_table(df, tables['review'], tables['claim'])

    return tables