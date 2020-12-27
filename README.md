# Modsem 20-21 FaktNews
<img src="docs/assets/repo_cover.jpg"
     alt="Markdown Monster icon"
     />


## How to start
All the code infrastructure and dependencies are managed with Docker containers. We use docker-compose to easy start and stop the environment.

TL;DR
1. Rename `.env.template` into `.env` and fill the environment variables.

2. Create a `license` directory and copy the graphdb se license file.

3. Start the environment with
```
> docker-compose up -d
```
From this point, all services should up and running. You can connect to the relative service since all ports are exposed and binded to localhost. For more in depth info see [Docker Info](#docker-info).

Have fun!

## Directory Structure
* [app/](./modsem2021-faktnews/app) web application code
* [data/](./modsem2021-faktnews/data) code related to ETL data pipelines
* [docs/](./modsem2021-faktnews/docs) documentation files
* [ontology/](./modsem2021-faktnews/ontology) OWL ontology and LOD specific files
* [.env.template](./modsem2021-faktnews/.env.template) template for the environment variables used by docker services and code.
* [docker-compose.yml](./modsem2021-faktnews/docker-compose.yml) compose specification file for docker services.


## Docker Info
All the infrastructure services and dependencies are managed with docker containers. Make sure to install _docker_ and _docker-compose_ tools!

To manage the environment, from the root directory

To start (and stop) all the services:
```
> docker-compose up -d
```
```
> docker-compose down
```
`-d` argument will detach the services and keep them run in background. Make you sure that the command is execute where `docker-compose.yaml` file resides. If you want to interact with a **running** container, you can start a shell session
```
> docker exec -it <container name> (or <container id>) sh
```
If you just want to check log outputs:
```
> docker-compose logs
```


There are 4 service declared in `docker-compose` file:

* `python`: service to run a python instance with relative dependencies declared in [requirements](data/requirements.txt) file. There are two main points to remenber:
     * A volume is mounted in the container to **sync code changes** in [data](data) directory between host and container (and viceversa).

     * To avoid file [access privilege issue](https://jtreminio.com/blog/running-docker-containers-as-current-host-user/) between host user and container user (*root* by default) a new user will be created at **build time** inside the container and mapped with the host ones. The user credentials MUST be declared in [.env](.env.template) file in this way:
     ```
      PY_USER=<username>
      PY_USER_ID=<host user id>
      PY_GROUP_ID=<host user group id>
     ```
     If you run in an unix-like OS you can retrieve this info with the following shell commands:
     ```
     <username> <-- whoami
     <host user id> <-- id -u $(whoami)
     <host user group id> <-- id -g $(whoami)
     ```
     Running `docker-compose build python` will take care to pass information declared into `.env` file to the build process.
     
* `db`: service to run a RDB instance (*postgreSQL*) for data storage purposes. Tre main points to remember: 
     * This service use a docker managed volume: `db-volume`. This volume is needed to **persist the database state**, otherwise, at each new container run database state will be lost. 
     * Database credentials are declared in [.env](.env.template) file and injected into the container the first time is created to add a new database user. 
     * A port mapping is specified in the compose file, so you can connect to the running database instance from the host. For example with psql CLI client (using the default values in `.env` file):
     ```
     > psql -d faktnews -h localhost -U modsem -p 5432 -W 
     ```

* `rdf`: service to run an RDF triple store server (*GraphDB*). As for `db` service, a volume `rdf-volume` will be mounted to persist data. GraphDB SE require a licence file that you should obtain from [Ontotext](https://graphdb.ontotext.com/documentation/standard/se/graphdb-se.html) (there is a free 2 month trial license for testing purposes). Another volume is mounted on the container to get access to license file. In short you must:
     1. Get a licence file from ontotext and download it.
     2. Create a new top-level directory `license`.
     3. Copy the license file into `license` directory. 
* `web-client` [TODO]
