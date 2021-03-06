const { EnapsoGraphDBClient } = require("@innotrade/enapso-graphdb-client");

/*
This file contains the GraphDB repository configuration.
*/

const BASE_URL = "http://localhost:7200";
const REPOSITORY = "modsem-fakt-news-db";

// needed for the login in other components
export const GRAPHDB_USERNAME = "modsem";
export const GRAPHDB_PASSWORD = "modsem";

const DEFAULT_PREFIXES = [
    EnapsoGraphDBClient.PREFIX_OWL,
    EnapsoGraphDBClient.PREFIX_RDF,
    EnapsoGraphDBClient.PREFIX_RDFS,
    EnapsoGraphDBClient.PREFIX_XSD,
    {
      /* TODO: I'm not shure if the library can handle the empty prefix, 
      to verify!
      */
      prefix: "", 
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

export let graphDBEndpoint = new EnapsoGraphDBClient.Endpoint({
    baseURL: BASE_URL,
    repository: REPOSITORY,
    prefixes: DEFAULT_PREFIXES,
    transform: "toJSON",
  });

