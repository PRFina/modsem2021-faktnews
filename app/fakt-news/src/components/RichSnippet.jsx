import React, { Component } from "react";
import { postProcessDate } from "./Utility";

const { EnapsoGraphDBClient } = require("@innotrade/enapso-graphdb-client");

class RichSnippet extends Component {
  constructor(props) {
    super(props);
    this.baseURL = "http://localhost:7200";
    this.repository = "modsem-faktnews";
    this.graphdbUsername = "modsem";
    this.graphdbPassword = "modsem";

    this.state = {
      isTrustedSource: false,
    };

    this.handleQ6 = this.handleQ6.bind(this);
  }

  componentDidMount() {
    this.handleQ6();
  }

  handleQ6() {
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
      baseURL: this.baseURL,
      repository: this.repository,
      prefixes: DEFAULT_PREFIXES,
      transform: "toJSON",
    });

    graphDBEndpoint
      .login(this.graphdbUsername, this.graphdbPassword)
      .then((result) => {
        // console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });

    graphDBEndpoint
      .query(
        `SELECT ?id ?agent
        WHERE {
            ?a a prov:Agent; fn:observeCodeOfPrinciples ?code.
            ?a schema:name ?agent.
            
            BIND(STR(?a) as ?id)
        } LIMIT  100`,
        { transform: "toJSON" }
      )
      .then((result) => {
        result.records.forEach((elem) => {
          if (elem.agent === this.props.review.organization) {
            this.setState({ isTrustedSource: true });
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  isTrustedSource(trustValue) {
    if (trustValue) {
      return "True";
    } else {
      return "False";
    }
  }

  displayMentions() {
    return (
      <p>
        {[this.props.review.mention].map((element, index) => {
          let url = `https://dbpedia.org/page/${element}`;
          // some post-processing on mention
          let element_clean = element.replace("_", " ");
          return <a href={url}>{element_clean}, </a>;
        })}
      </p>
    );
  }

  render() {
    // if (this.props.displayRichSnippet === true) {
    return (
      <div className="row align-items-start mb-3">
        <div className="card col-">
          <img
            src="https://www.altroconsumo.it/-/media/altroconsumo/images/home/hi%20tech/telefono%20internet%20e%20tv%20digitale/tips/fake%20news_shu_787955047_1600x900.jpg?rev=2ae1d718-e85b-4c70-ae9f-7f88b8f1dc44&mw=660&hash=E9AAC8B9D2F8586387A021F714521035"
            className="card-img-top"
            alt="..."
          />
          <div className="card-body">
            <h5 className="card-title">{this.props.review.title}</h5>
            <h6 className="card-subtitle mb-2 text-muted">
              {this.props.review.reviewer}, {this.props.review.organization}
            </h6>
            <p className="card-text">{this.props.review.content}</p>
          </div>
          <ul className="list-group list-group-flush">
            <li key={this.props.review + "-date"} className="list-group-item">
              Date: {postProcessDate(this.props.review.date)}
            </li>
            <li key={this.props.review + "-rating"} className="list-group-item">
              Rating: {this.props.review.rating}
            </li>
            <li
              key={this.props.review + "-judgment"}
              className="list-group-item"
            >
              Judgment: {this.props.review.judgment}
            </li>
            <li
              key={this.props.review + "-trusted"}
              className="list-group-item"
            >
              Trusted Source: {this.isTrustedSource(this.state.isTrustedSource)}
            </li>
            <li
              key={this.props.review + "-mentions"}
              className="list-group-item"
            >
              Mentions: {this.displayMentions()}
            </li>
          </ul>
          <div className="card-body">
            <a
              key={this.props.review + "-url"}
              href={this.props.review.url}
              className="card-link"
            >
              Review URL
            </a>
          </div>
        </div>
      </div>
    );
    // } else {
    //   return <p></p>;
    // }
  }
}

export default RichSnippet;
