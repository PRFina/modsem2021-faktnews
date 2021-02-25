const { EnapsoGraphDBClient } = require("@innotrade/enapso-graphdb-client");

const baseURL = "http://localhost:7200";
const repository = "modsem-faktnews";
// const repository = "quattro";
const graphdbUsername = "modsem";
const graphdbPassword = "modsem"

let state = { data: null };

// cleaning the received data
function postProcessData(data) {
    if (data !== null) {
    data.map((element) => {
        return (element.eid = element.eid.replace(/.*#/, ""));
    });
    return data;
    }
}

function query3(keywork, startDate, endDate) {
    const DEFAULT_PREFIXES = [
    EnapsoGraphDBClient.PREFIX_OWL,
    EnapsoGraphDBClient.PREFIX_RDF,
    EnapsoGraphDBClient.PREFIX_RDFS,
    EnapsoGraphDBClient.PREFIX_XSD,
    {
        prefix: "", // TODO: gestire il prefisso vuoto
        iri: "http://www.modsem.org/fakt-news#",
    },
    {
        prefix: "fn",
        iri: "http://www.modsem.org/fakt-news#",
    },
    {
        prefix: "dct",
        iri: "http://purl.org/dc/terms/",
    },
    {
        prefix: "prov",
        iri: "http://www.w3.org/ns/prov#",
    },
    {
        prefix: "schema",
        iri: "http://schema.org/",
    },
    {
        prefix: "dbr",
        iri: "http://dbpedia.org/resource/",
    },
    {
        prefix: "foaf",
        iri: "http://xmlns.com/foaf/0.1/",
    },
    ];
    
    let graphDBEndpoint = new EnapsoGraphDBClient.Endpoint({
        baseURL: baseURL,
        repository: repository,
        prefixes: DEFAULT_PREFIXES,
        transform: "toJSON",
    });
    
    graphDBEndpoint
    .login(graphdbUsername, graphdbPassword)
    .then((result) => {
        // console.log(result);
    })
    .catch((err) => {
        console.log(err);
    });

    graphDBEndpoint
    .query(
        `SELECT ?eid ?claimContent ?name
        WHERE {
            ?claim a fn:Claim; fn:isClaimedBy ?author .
            ?author schema:name ?name . 
            ?claim fn:claimContent ?claimContent .
            
            BIND(STR(?claim) AS ?eid).	
            BIND(STR(?fcn) AS ?fcname)
            BIND(STR(?fcon) AS ?fconame).
        } LIMIT 100`,
        { transform: "toJSON" }
    )
    .then((result) => {
        console.log(
        "Read the classes name:\n" + JSON.stringify(result, null, 2)
        );
        let final = postProcessData(result.records);
        state.data = final;
    })
    .catch((err) => {
        console.log(err);
    });

    return state.data
}

export { query3 };