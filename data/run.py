import psycopg2 as pg
import time
import os
print("Waiting database is up and running...")
time.sleep(2)

conn_info = {'dbname': os.environ['POSTGRES_DB'],
             'user': os.environ['POSTGRES_USER'],
             'password': os.environ['POSTGRES_PASSWORD'],
             'host': 'db',
             'port': '5432'}

conn = pg.connect(**conn_info)

# Begin creating the db
cur = conn.cursor()
cur.execute(open("db_scripts/ddl.sql", "r").read())
print("DB created from DDL file.")

# make the changes to the database persistent
conn.commit()

# Begin populating the db
#cur.execute(open("db_scripts/dml.sql", "r").read())
#print("DB populated from DML file.")

# make the changes to the database persistent
conn.commit()

# Close communication with the database
cur.close()
conn.close()
print("Connection to DB closed.")
