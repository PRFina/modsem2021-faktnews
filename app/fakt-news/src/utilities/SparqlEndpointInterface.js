const { ServerClient, ServerClientConfig } = require("graphdb").server;
const { RepositoryClientConfig, GetStatementsPayload } = require("graphdb").repository;
const { RDFMimeType } = require("graphdb").http;

function Call() {
    const config = new ServerClientConfig("http://localhost:7200/", 0, {});
    const server = new ServerClient(config);
  
    const readTimeout = 30000;
    const writeTimeout = 30000;
    const repositoryClientConfig = new RepositoryClientConfig(
      ["http://localhost:7200/repositories/"],
      {},
      "",
      readTimeout,
      writeTimeout
    );
  
    var name = "due";
    return server
      .getRepository(name, repositoryClientConfig)
      .then((rdfRepositoryClient) => {
        console.log("ok", name, rdfRepositoryClient); // rdfRepositoryClient is a configured instance of RDFRepositoryClient
      })
      .catch((err) => console.log(err));
}

export function repo() {
  var repository = Call()
  const payload = new GetStatementsPayload()
	.setResponseType(RDFMimeType.RDF_JSON)
	.setSubject('<http://eunis.eea.europa.eu/countries/AZ>')
	.setPredicate('<http://eunis.eea.europa.eu/rdf/schema.rdf#population>')
	.setObject('"7931000"^^http://www.w3.org/2001/XMLSchema#integer')
	.setContext('<http://example.org/graph3>')
	.setInference(true);

repository.get(payload).then((data) => {
  console.log(payload)
	// data contains requested staments in rdf json format
});
}