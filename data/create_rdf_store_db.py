import requests
import json
from pathlib import Path
import logging
import os


logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s-%(levelname)s-%(message)s')


REPO_CONFIG = {
    "id": 'modsem-faktnews-db',  # CHANGED from create_rdf_store
    "title": "",
    "type": "se",
    "sesameType": "owlim:MonitorRepository",
    "location": "",
    "params": {
        "queryTimeout": {
          "label": "Query time-out (seconds)",
          "name": "queryTimeout",
          "value": "0"
        },
        "cacheSelectNodes": {
            "label": "Cache select nodes",
            "name": "cacheSelectNodes",
            "value": "true"
        },
        "rdfsSubClassReasoning": {
            "label": "RDFS subClass reasoning",
            "name": "rdfsSubClassReasoning",
            "value": "true"
        },
        "undefinedTargetValidatesAllSubjects": {
            "label": "Validate subjects when target is undefined",
            "name": "undefinedTargetValidatesAllSubjects",
            "value": "false"
        },
        "validationEnabled": {
            "label": "Enable the SHACL validation",
            "name": "validationEnabled",
            "value": "true"
        },
        "parallelValidation": {
            "label": "Run parallel validation",
            "name": "parallelValidation",
            "value": "true"
        },
        "checkForInconsistencies": {
            "label": "Check for inconsistencies",
            "name": "checkForInconsistencies",
            "value": "false"
        },
        "performanceLogging": {
            "label": "Log the execution time per shape",
            "name": "performanceLogging",
            "value": "false"
        },
        "disableSameAs": {
            "label": "Disable owl:sameAs",
            "name": "disableSameAs",
            "value": "true"
        },
        "entityIndexSize": {
            "label": "Entity index size",
            "name": "entityIndexSize",
            "value": "10000000"
        },
        "dashDataShapes": {
            "label": "DASH data shapes extensions",
            "name": "dashDataShapes",
            "value": "true"
        },
        "owlimLicense": {
            "label": "License file (leave blank for evaluation)",
            "name": "owlimLicense",
            "value": ""
        },
        "queryLimitResults": {
            "label": "Limit query results",
            "name": "queryLimitResults",
            "value": "0"
        },
        "throwQueryEvaluationExceptionOnTimeout": {
            "label": "Throw exception on query time-out",
            "name": "throwQueryEvaluationExceptionOnTimeout",
            "value": "false"
        },
        "storageFolder": {
            "label": "Storage folder",
            "name": "storageFolder",
            "value": "storage"
        },
        "enablePredicateList": {
            "label": "Use predicate indices",
            "name": "enablePredicateList",
            "value": "true"
        },
        "logValidationPlans": {
            "label": "Log the executed validation plans",
            "name": "logValidationPlans",
            "value": "false"
        },
        "imports": {
            "label": "Imported RDF files(';' delimited)",
            "name": "imports",
            "value": ""
        },
        "isShacl": {
            "label": "Supports SHACL validation",
            "name": "isShacl",
            "value": "false"
        },
        "inMemoryLiteralProperties": {
            "label": "Cache literal language tags",
            "name": "inMemoryLiteralProperties",
            "value": "true"
        },
        "ruleset": {
            "label": "Ruleset",
            "name": "ruleset",
            "value": "rdfsplus-optimized"
        },
        "readOnly": {
            "label": "Read-only",
            "name": "readOnly",
            "value": "false"
        },
        "ignoreNoShapesLoadedException": {
            "label": "Ignore no shapes loaded exception",
            "name": "ignoreNoShapesLoadedException",
            "value": "false"
        },
        "enableLiteralIndex": {
            "label": "Enable literal index",
            "name": "enableLiteralIndex",
            "value": "true"
        },
        "defaultNS": {
            "label": "Default namespaces for imports(';' delimited)",
            "name": "defaultNS",
            "value": ""
        },
        "enableContextIndex": {
            "label": "Use context index",
            "name": "enableContextIndex",
            "value": "false"
        },
        "baseURL": {
            "label": "Base URL",
            "name": "baseURL",
            "value": "http://example.org/faktnews",  # CHANGED from create_rdf_store
        },
        "logValidationViolations": {
            "label": "Log validation violations",
            "name": "logValidationViolations",
            "value": "false"
        },
        "globalLogValidationExecution": {
            "label": "Log every execution step of the SHACL validation",
            "name": "globalLogValidationExecution",
            "value": "false"
        },
        "entityIdSize": {
            "label": "Entity ID bit-size",
            "name": "entityIdSize",
            "value": "32"
        },
        "repositoryType": {
            "label": "Repository type",
            "name": "repositoryType",
            "value": "file-repository"
        },
        "eclipseRdf4jShaclExtensions": {
            "label": "RDF4J SHACL extensions",
            "name": "eclipseRdf4jShaclExtensions",
            "value": "true"
        }
    }
}

if __name__ == '__main__':
    # Make REST request to create a repository
    resp = requests.post("http://localhost:7200/rest/repositories",  # CHANGED from create_rdf_store
                         data=json.dumps(REPO_CONFIG), headers={'Content-Type': 'application/json'})

    if resp.status_code == requests.codes['created']:
        logging.info("{} repository created!".format(REPO_CONFIG['id']))
    else:
        logging.warning("Status code {}".format(resp.status_code))
        logging.warning("Response message {}".format(resp.text))

    # Make REST request to insert data into the repository
    # CHANGED from create_rdf_store
    ontology_path = Path(
        "../ontology/fakt-news-db/fakt-news-db-materialized-triples.rdf")
    ontology_file = ontology_path.open("rb")

    URL = "http://localhost:7200/repositories/{}/statements".format(  # CHANGED from create_rdf_store
        REPO_CONFIG['id'])
    resp = requests.post(URL, data=ontology_file, headers={
                         'Content-Type': 'application/rdf+xml'})

    if resp.status_code == requests.codes['no_content']:
        logging.info("imported {} into {}".format(
            ontology_path, REPO_CONFIG['id']))
    else:
        logging.warning("Status code {}".format(resp.status_code))
        logging.warning("Response message {}".format(resp.text))
