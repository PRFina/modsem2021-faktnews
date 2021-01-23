import React, { Component } from "react";
import Search from "./Search";
import Left from "./Left";
import Right from "./Right";

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
      repository: "due",
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
        `SELECT ?object
                WHERE { ?subject schema:name ?object } limit 5`,
        { transform: "toJSON" }
      )
      .then((result) => {
        console.log(
          "Read the classes name:\n" + JSON.stringify(result, null, 2)
        );
        this.setState({ data: result });
      })
      .catch((err) => {
        console.log(err);
      });
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
        <div className="row">
          <div className="col">
            <Left elements={this.state.data} />
          </div>
          <div className="col">
            <Right />
          </div>
        </div>
      </div>
    );
  }
}

export default Endpoint;
