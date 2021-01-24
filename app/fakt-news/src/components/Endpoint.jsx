import React, { Component } from "react";
import Search from "./Search";
import Results from "./Results";

const { EnapsoGraphDBClient } = require("@innotrade/enapso-graphdb-client");

class Endpoint extends Component {
  constructor(props) {
    super(props);
    this.state = { data: null };
  }

  query() {
    const DEFAULT_PREFIXES = [
      EnapsoGraphDBClient.PREFIX_OWL,
      EnapsoGraphDBClient.PREFIX_RDF,
      EnapsoGraphDBClient.PREFIX_RDFS,
      EnapsoGraphDBClient.PREFIX_XSD,
      {
        prefix: "prov",
        iri: "http://www.w3.org/ns/prov#",
      },
      {
        prefix: "schema",
        iri: "http://schema.org/",
      },
    ];

    let graphDBEndpoint = new EnapsoGraphDBClient.Endpoint({
      baseURL: "http://localhost:7200",
      repository: "quattro",
      prefixes: DEFAULT_PREFIXES,
      transform: "toJSON",
    });

    graphDBEndpoint
      .login("modsem", "modsem")
      .then((result) => {
        // console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });

    graphDBEndpoint
      .query(
        `SELECT ?subject ?object
        WHERE { ?subject schema:name ?object}`,
        { transform: "toJSON" }
      )
      .then((result) => {
        console.log(
          "Read the classes name:\n" + JSON.stringify(result, null, 2)
        );
        let final = this.dataCleaning(result.records);
        this.setState({ data: final });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  dataCleaning(data) {
    if (data !== null) {
      data.map((element) => {
        return (element.subject = element.subject.replace(/.*#/, ""));
      });
      return data;
    }
  }

  componentDidMount() {
    this.query();
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <Search />
        </div>
        <Results elements={this.state.data} />
      </div>
    );
  }
}

export default Endpoint;
