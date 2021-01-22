import time
import os
import numpy as np
from pathlib import Path
import psycopg2 as pg
from sqlalchemy import create_engine
from psycopg2.extensions import register_adapter, AsIs


import cleaning_pipeline
import etl_pipeline

def create_db_from_script(connection_info, script_path):
    try:
        conn = pg.connect(**connection_info)
    except Exception as err:
        print("Error on connection: {}".format(err))
        conn = None
        
    # Begin creating the db
    cur = conn.cursor()
    cur.execute(script_path.open().read())

    # make the changes to the database persistent
    conn.commit()

    # Close communication with the database
    cur.close()
    conn.close()


if __name__ == '__main__':
    print("Waiting database is up and running...")
    time.sleep(2) # just to be sure that db container is ready

    db_conn = {'dbname': os.environ['POSTGRES_DB'],
               'user': os.environ['POSTGRES_USER'],
               'password': os.environ['POSTGRES_PASSWORD'],
               'host': 'db',
               'port': 5432}

    ## Create DB
    ddl_script_path = Path("./SQL/ddl.sql") 
    print("Start create database")
    create_db_from_script(db_conn, ddl_script_path)
    print("Database created!")

    ## Insert Data
    register_adapter(np.int64, AsIs)
    engine = create_engine("postgresql://{user}:{password}@{host}:{port}/{dbname}".format(**db_conn))
   
    multi_fc_dataset = Path("./raw/MultiFC_train.tsv")
    liarplus_path = Path("raw/LIARPlus_validation.jsonl")
    random_seed = np.random.seed(1620) # for reproducibility

    print("Start data cleaning pipeline")
    df = cleaning_pipeline.execute_data_preparation(multi_fc_dataset)
    print("pipeline completed!")

    print("Start ETL pipeline")
    tables = etl_pipeline.generate_db_tables(df, liarplus_path, random_seed)
    print("pipeline completed!")
    

    for table_name, table in tables.items():
        print("Populating {} table".format(table_name))
        table.to_sql(table_name, con=engine, if_exists='append', index_label='id')
        print("Done!")