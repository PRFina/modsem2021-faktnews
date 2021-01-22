import numpy as np
import pandas as pd
import dateparser
from pathlib import Path

COL_NAMES = ["claimID", "claim", "label", "claimURL",
             "reason", "categories", "speaker", "checker", 
             "tags", "articleTitle", "publishDate", "claimDate", "entities"]

NULLS = ["None","['None']"]

MANDATORY_COLS = ["articleTitle","checker","speaker",
                  "claim","publishDate","tags","entities"] # minimal columns subset that must not contain any null in any case

JUDGEMENT_TAXONOMY= ['Confirmed Fact', 
                     'Deceptive Editing', 'Omission', 'Splicing', 
                     'Malicious Transformation', 'Doctoring', 'Fabrication', 
                     'Missing Context', 'Isolation', 'Misrepresentation', 
                     'Not Clear Geography Context', 'Not Clear Time Period Context', 
                     'Not Clear Subject', 'Qualitative Claim']

RATING_MAPPING = { 'false': 'False',
                   'none': 'False',
                   'unsupported': 'False',
                   'no evidence': 'Mostly False',
                   'not the whole story': 'Mostly False',
                   'distorts the facts' : 'Mostly False',
                   'spins the facts' : 'Mostly False',
                   'misleading' : 'Mostly True',
                   'cherry picks' : 'Mostly True',
                   '': 'True'}

COL_TYPE_MAPPING = { "claimID": "string",
                        "claim": "string",
                        "label": "category",
                        "claimURL": "string",
                        "reason": "category",
                        "speaker": "string",
                        "checker": "string",
                        "articleTitle": "string"
}

def load_data(dataset_path, col_names, null_values):
    return pd.read_csv(dataset_path, sep="\t", names=col_names, 
                     na_values=null_values)

def parse_date(df, col_names, date_parser):
    parsed_dates = df[col_names].dropna().apply(date_parser)
    df[col_names] = pd.to_datetime(parsed_dates, errors='coerce', utc=True)
    return df

def reset_index(df):
    return df.reset_index(drop=True)

def drop_unnecessary_cols(df, col_names):
    return df.drop(columns=col_names)

def clean_null_values(df, col_names):
    return df.dropna(subset=col_names) # clean NAN values

def generate_random_reasons(df, reasons):
    new_reasons=np.random.choice(reasons,size=df['reason'].isna().sum()) # generate random sample of justifications
    df = df.assign(reason=new_reasons)
    
    return df

def generate_random_offset_dates_from(df, from_col, to_col, exp_distribution_param=1.5, time_offset_unit='day'):
    na_claim_date = df[to_col].isna() # check nan claimDate

    random_sample = np.random.exponential(exp_distribution_param,size=na_claim_date.sum()) # generate random sample, with # samples == # nan values
    day_offsets = pd.to_timedelta(random_sample, unit=time_offset_unit) # convert random sample to days offsets

    new_claim_dates = df[from_col][na_claim_date] - day_offsets # generate new claimDate values from publishedDate offsetted with random days

    df[to_col] = df[to_col].fillna(new_claim_dates) # replace only na claimDate values with the new generated dates
    
    return df

def map_labels_to_rating(df, label_col, mapping):
    df[label_col] = df[label_col].map(mapping)
    
    return df

def list_from_string(df, col_name):
    df[col_name] = df[col_name].apply(lambda val: val.strip("[]").replace("'",'').replace('"','').lower().split(", "))
    return df

def map_column_type(df, types_mapping):
    return df.astype(types_mapping)



def execute_data_preparation(dataset_path):
    """
    Define and execute a pipeline for data cleaning and formatting the MultiFC dataset (training set)
    """
    df = (
        load_data(dataset_path, col_names=COL_NAMES, null_values=NULLS)
        .pipe(drop_unnecessary_cols, ['categories'])
        .pipe(clean_null_values, MANDATORY_COLS)
        .pipe(parse_date, "publishDate", dateparser.parse)
        .pipe(parse_date, "claimDate", dateparser.parse)
        .pipe(generate_random_reasons, reasons=JUDGEMENT_TAXONOMY) # fill reason col with fake data
        .pipe(generate_random_offset_dates_from, from_col='publishDate', to_col='claimDate') # fill claimDate col with fake data
        .pipe(map_labels_to_rating, label_col='label', mapping=RATING_MAPPING) # map label column with our standard 4-values rating systems
        .pipe(list_from_string, col_name='tags') # parse string representation of tags into an actual list of tags
        .pipe(list_from_string, col_name='entities') # parse string representation of entities into an actual list of entities
        .pipe(map_column_type, COL_TYPE_MAPPING)
        .pipe(reset_index)
    )

    return df


# Script mode
if __name__ == '__main__':
    multi_fc_dataset = Path("./raw/MultiFC_train.tsv")
    df = execute_data_preparation(multi_fc_dataset)
    print(df.head())