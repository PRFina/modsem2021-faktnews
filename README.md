# modsem2021-faktnews

## How to start
All the code infrastructure and dependencies are managed with Docker containers. We use docker-compose to easy start the environment.

To keep sensitive information private you must:
1. Rename `.env.template` into `.env` and fill the environment variables. This file declare database connection credentials.

2. Create a `license` directory and copy the graphdb se license file. Docker will automatically mount a volume to give access to `rdf` service.

## Quick Commands Reference

Connect to postgres database:

> psql -d faktnews -h localhost -U modsem -p 5432 -W 

To run the environment, from the root directory (where `docker-compose.yaml` file resides)

> docker-compose up -d

This will start all the services declared in the `docker-compose.yaml` file.

To check service output:
> docker-compose logs

To start an interactive shell session in a **running** container:
> docker exec -it \<container name\>(or \<container id\>) sh