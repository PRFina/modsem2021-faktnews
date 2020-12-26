# modsem2021-faktnews
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