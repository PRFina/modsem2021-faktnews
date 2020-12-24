import psycopg2 as pg
import time
import os
print("Waiting database is up and running........")
time.sleep(2)

conn_info = {'dbname':os.environ['POSTGRES_DB'],
             'user':os.environ['POSTGRES_USER'],
             'password':os.environ['POSTGRES_PASSWORD'],
             'host':'db',
             'port':'5432'}

conn = pg.connect(**conn_info)


cur = conn.cursor()
cur.execute("CREATE TABLE IF NOT EXISTS testX (id serial PRIMARY KEY, num integer, data varchar);")

print("Welcome from the outside!")

# make the changes to the database persistent
conn.commit()

# Close communication with the database
cur.close()
conn.close()