# Modsem 20-21 FaktNews

<img src="docs/assets/repo_cover.jpg" alt="Markdown Monster icon"/>

## How to start

All the code infrastructure and dependencies are managed with **Docker containers**. We used docker-compose to easy start and stop the environment.

### TL;DR

1. Rename `.env.template` into `.env` and fill the environment variables.

2. Start the environment with

```shell
docker-compose up -d
```

From this point, all services should up and running. You can connect to the relative service since all ports are exposed and binded to localhost. For more in depth info see [Docker Info](#docker-info).

Have fun!

## Directory Structure

- [app/](./modsem2021-faktnews/app) web application code,
- [data/](./modsem2021-faktnews/data) code related to ETL data pipelines,
- [docs/](./modsem2021-faktnews/docs) LODE documentation and final summary,
- [ontology/](./modsem2021-faktnews/ontology) OWL ontology and LOD specific files,
- [.env.template](./modsem2021-faktnews/.env.template) template for the environment variables used by docker services and code,
- [docker-compose.yml](./modsem2021-faktnews/docker-compose.yml) compose specification file for docker services.

## Launching Docker

All the infrastructure services and dependencies are managed with docker containers. Make sure to install _docker_ and _docker-compose_ tools!

To start (and stop) all the services:

```shell
docker-compose up -d
```

```shell
docker-compose down
```

`-d` argument will detach the services and keep them run in background. Make you sure that the command is execute where `docker-compose.yaml` file resides. If you want to interact with a **running** container, you can start a shell session

```shell
docker exec -it <container name> (or <container id>) sh
```

If you just want to check log outputs:

```shell
docker-compose logs
```

## Docker containers

There are 4 service declared in `docker-compose` file:

- `python`: service to run a python instance with relative dependencies declared in [requirements](data/requirements.txt) file. There are two main points to remenber:

  - A volume is mounted in the container to **sync code changes** in [data](data) directory between host and container (and viceversa).

  - To avoid file [access privilege issue](https://jtreminio.com/blog/running-docker-containers-as-current-host-user/) between host user and container user (_root_ by default) a new user will be created at **build time** inside the container and mapped with the host ones. The user credentials MUST be declared in [.env](.env.template) file in this way:

  ```shell
   PY_USER=<username>
   PY_USER_ID=<host user id>
   PY_GROUP_ID=<host user group id>
  ```

  If you run in an unix-like OS you can retrieve this info with the following shell commands:

  ```shell
  <username> <-- whoami
  <host user id> <-- id -u $(whoami)
  <host user group id> <-- id -g $(whoami)
  ```

  Running `docker-compose build python` will take care to pass information declared into `.env` file to the build process.

- `db`: service to run a RDB instance (_postgreSQL_) for data storage purposes. Tre main points to remember:

  - This service use a docker managed volume: `db-volume`. This volume is needed to **persist the database state**, otherwise, at each new container run database state will be lost.
  - Database credentials are declared in [.env](.env.template) file and injected into the container the first time is created to add a new database user.
  - A port mapping is specified in the compose file, so you can connect to the running database instance from the host. For example with psql CLI client (using the default values in `.env` file):

  ```shell
  psql -d faktnews -h localhost -U modsem -p 5432 -W
  ```

- `rdf`: service to run an RDF triple store server (_GraphDB_). As for `db` service, a volume `rdf-volume` will be mounted to persist data. Ontotext provides docker images for GraphDB SE and GraphDB EE, but not for **GraphDB Free** (the version **we decided to use**). To get a **docker image** of the latter version you need to **build it locally** following this steps:

  1. Ensure Docker is running.
  2. Clone the [graphdb-docker repository](https://github.com/Ontotext-AD/graphdb-docker).
  3. Inside the top-level folder `graphdb-docker` run the `make` command, then wait until it finish.
  4. At this point you should notice the presence of the image `ontotext/graphdb` inside your local docker images. You're done!

  If you prefer to use GraphDB SE or GraphDB EE, you can use the two official docker images, GraphDB EE and GraphDB SE, but both require a license file to work, which you should get on the Ontotext website by filling out the trial request form at the following links: [GraphDB EE](https://www.ontotext.com/products/graphdb/graphdb-enterprise/) and [GraphDB SE](https://www.ontotext.com/products/graphdb/graphdb-standard/). The **trial license** of both versions **lasts for two months**. In this case you **need** to **mount another volume** on the container to **get access to license file**. In short you must:

  1. Get a licence file from ontotext and download it.
  2. Create a new top-level directory `license`.
  3. Copy the license file into `license` directory.
  4. Edit the docker-compose adding the license volume in the container. The container shopuld look similar to this:

  ```yaml
  rdf:
    image: ontotext/graphdb:9.6.0-free # is build locally!!
    ports:
      - 7200:7200
    volumes:
      - rdf-volume:/opt/graphdb/home
    #  - ./license:/opt/graphdb/home/conf # for GraphDB SE/EE license
  ```

- `web-client`: service to host the web client, which is written using NodeJS and the UI library ReactJS. **Important!** In order to make the web client work, install a **browser extension** to **allow the CORS requests**. Here are some of them: [Allow CORS (Firefox)](https://addons.mozilla.org/it/firefox/addon/access-control-allow-origin/), [Allow CORS (Chrome)](https://addons.mozilla.org/it/firefox/addon/access-control-allow-origin/), [Moesif Origin & CORS Changer (Chrome)](https://chrome.google.com/webstore/detail/moesif-origin-cors-change/digfbfaphojjndkpccljibejjbppifbc?hl=en-US). Please note that allowing the CORS requests via a browser extension is the **fastest method** to get rid of the CORS errors, but **it's not the safest**. For more information read this article [3 Ways to Fix the CORS Error](https://medium.com/@dtkatz/3-ways-to-fix-the-cors-error-and-how-access-control-allow-origin-works-d97d55946d9)
