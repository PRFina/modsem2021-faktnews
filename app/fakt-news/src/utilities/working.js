// https://github.com/innotrade/enapso-graphdb-client#readme

const { EnapsoGraphDBClient } = require('@innotrade/enapso-graphdb-client');

// connection data to the running GraphDB instance
const GRAPHDB_BASE_URL = 'http://localhost:7200',
    GRAPHDB_REPOSITORY = 'due',
    GRAPHDB_USERNAME = 'modsem',
    GRAPHDB_PASSWORD = 'modsem',
    GRAPHDB_CONTEXT_TEST = 'http://example.org/owlim#';

const DEFAULT_PREFIXES = [
    EnapsoGraphDBClient.PREFIX_OWL,
    EnapsoGraphDBClient.PREFIX_RDF,
    EnapsoGraphDBClient.PREFIX_RDFS,
    EnapsoGraphDBClient.PREFIX_XSD,
    {
        prefix: 'prov',
        iri: 'http://www.w3.org/ns/prov#'
    },
    {
        prefix: 'schema',
        iri: 'http://schema.org/'
    }
];

export function query(data) {
    let graphDBEndpoint = new EnapsoGraphDBClient.Endpoint({
        baseURL: GRAPHDB_BASE_URL,
        repository: GRAPHDB_REPOSITORY,
        prefixes: DEFAULT_PREFIXES,
        transform: 'toJSON'
    });
    
    graphDBEndpoint
        .login(GRAPHDB_USERNAME, GRAPHDB_PASSWORD)
        .then((result) => {
            // console.log(result);
        })
        .catch((err) => {
            console.log(err);
        });

    graphDBEndpoint
        .query(
            `SELECT ?object
            WHERE { ?subject schema:name ?object } limit 5`,
        { transform: 'toJSON' }
    )
    .then((result) => { 
        console.log(
            'Read the classes name:\n' + JSON.stringify(result, null, 2)
            );
            getValue(data,result)
    })
    .catch((err) => {
        console.log(err);
    });
}

function getValue(data, value) {
    console.log("Data:",data, "Value:", value)
    return data = value;
}
