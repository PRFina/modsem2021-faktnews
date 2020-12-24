import psycopg2 as pg
import time
print("Waiting database is up and running........")
time.sleep(2)

conn_info = {'dbname':'faktnews',
             'user':'modsem',
             'password':'modsem',
             'host':'db',
             'port':'5432'}

conn = pg.connect(**conn_info)


cur = conn.cursor()
cur.execute("CREATE TABLE test (id serial PRIMARY KEY, num integer, data varchar);")

print("Welcome from the outside!")

# make the changes to the database persistent
conn.commit()

# Close communication with the database
cur.close()
conn.close()