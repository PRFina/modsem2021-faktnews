# Modsem 20-21 FaktNews
<img src="docs/assets/repo_cover.jpg"
     alt="Markdown Monster icon"
     />


## How to start
All the code infrastructure and dependencies are managed with Docker containers. We use docker-compose to easy start the environment.

To keep sensitive information private you must:
1. Rename `.env.template` into `.env` and fill the environment variables. This file declare database connection credentials.

2. Create a `license` directory and copy the graphdb se license file. Docker will automatically mount a volume to give access to `rdf` service.

3. Start the environment with

> docker-compose up -d

From this point, all services should up and running.You can connect to the relative services since all ports are exposed and binded to localhost. 

Have fun!

## Directory Structure
* [app/](./modsem2021-faktnews/app) web application code
* [data/](./modsem2021-faktnews/data) code related to ETL data pipelines
* [docs/](./modsem2021-faktnews/docs) documentation files
* [ontology/](./modsem2021-faktnews/ontology) OWL ontology and LOD specific files
* [.env.template](./modsem2021-faktnews/.env.template) template for the environment variables used by docker services and code.
* [docker-compose.yml](./modsem2021-faktnews/docker-compose.yml) compose specification file for docker services.


## Quick Command Reference

Connect to postgres database:

> psql -d faktnews -h localhost -U modsem -p 5432 -W 

To run the environment, from the root directory (where `docker-compose.yaml` file resides)

> docker-compose up -d

This will start all the services declared in the `docker-compose.yaml` file.

To check service output:
> docker-compose logs

To start an interactive shell session in a **running** container:
> docker exec -it \<container name\>(or \<container id\>) sh