import React, { Component } from "react";
import MentionCard from "./MentionCard";
import { postProcessDate } from "../../Utility";
import {
  graphDBEndpoint,
  GRAPHDB_USERNAME,
  GRAPHDB_PASSWORD,
} from "../../TripleStoreConfig";

class ReviewRichSnippet extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isTrustedSource: false,
      mentions: [],
      displaySpinner: true,
    };

    this.handleQ6 = this.handleQ6.bind(this);
  }

  // Lifecycle Hooks -----------------------------------------------------------

  componentDidMount() {
    this.handleQ6();
    this.handleQ4();
  }

  componentWillUnmount() {
    // resetting the state on unmounting
    this.setState({
      isTrustedSource: false,
      mentions: [],
      displaySpinner: true,
    });
  }

  // Business Logic ------------------------------------------------------------

  implodeMentions(arr) {
    let temp = new Map();
    arr.forEach((element) => {
      // Filter and keep only the DBPedia URI wich is equal to the mentioned entity
      let uri = this.props.review.mention.filter((uri) => {
        return element.entity_label === uri.replace("_", " ") ? uri : null;
      });

      if (!temp.has(element.entity_label)) {
        let copy = {
          entity_label: element.entity_label,
          entity_uri: uri[0], // I don't know why, but it returns an array
          info: element.info,
          linked_res: [
            {
              label: element.linked_res_label,
              wiki: element.linked_res_wiki,
            },
          ],
        };
        temp.set(element.entity_label, copy);
      } else {
        let mention = temp.get(element.entity_label);
        let mentionToCheck = {
          label: element.linked_res_label,
          wiki: element.linked_res_wiki,
        };
        if (!mention.linked_res.includes(mentionToCheck)) {
          mention.linked_res.push(mentionToCheck);
        }
      }
    });
    let i = [];
    temp.forEach((element, key) => {
      i = this.state.mentions;
      i.push(element);
    });
    console.log("IMPLODE", i);
    this.setState({ displaySpinner: false, mentions: i });
  }

  // SPARQL Queries ------------------------------------------------------------

  handleQ4() {
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
        `SELECT ?review_title ?entity_label ?info ?linked_res_label ?linked_res_wiki 
        WHERE { 
            ?review a fn:Review; dct:title ?review_title.
            BIND(STR(?review) AS ?reviewId).
            FILTER(?reviewId = "http://www.modsem.org/fakt-news#${this.props.review.review}").

            OPTIONAL {?review fn:mention ?wiki_entity.}
            BIND(URI(CONCAT(STR(dbr:), STR(?wiki_entity))) AS ?entity).
           
            SERVICE <https://dbpedia.org/sparql> {
                ?entity rdfs:label ?entity_label.
                OPTIONAL {
                    ?entity rdfs:seeAlso ?linked_res.
                    ?linked_res foaf:isPrimaryTopicOf ?linked_res_wiki.
                    ?linked_res rdfs:label ?linked_res_label.
                }.
                OPTIONAL {
                    ?entity rdfs:comment ?info
                }.
                FILTER(langMatches(lang(?entity_label), "en") && 
                       langMatches(lang(?info),"en"))
            }
           
        } limit 100 `,
        { transform: "toJSON" }
      )
      .then((result) => {
        // console.log(result.records, this.props.review.review);
        this.implodeMentions(result.records);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleQ6() {
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

  // Pretty printing -----------------------------------------------------------

  prettyPrintTrustedSource(trustValue) {
    if (trustValue) {
      return (
        <span
          className="badge badge-success"
          style={{ verticalAlign: "text-top" }}
        >
          True{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-patch-check-fill"
            viewBox="0 0 16 16"
          >
            <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01-.622-.636zm.287 5.984l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708z" />
          </svg>
        </span>
      );
    } else {
      return (
        <span
          className="badge badge-warning"
          style={{ verticalAlign: "text-top" }}
        >
          False{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-patch-question-fill"
            viewBox="0 0 16 16"
          >
            <path d="M5.933.87a2.89 2.89 0 0 1 4.134 0l.622.638.89-.011a2.89 2.89 0 0 1 2.924 2.924l-.01.89.636.622a2.89 2.89 0 0 1 0 4.134l-.637.622.011.89a2.89 2.89 0 0 1-2.924 2.924l-.89-.01-.622.636a2.89 2.89 0 0 1-4.134 0l-.622-.637-.89.011a2.89 2.89 0 0 1-2.924-2.924l.01-.89-.636-.622a2.89 2.89 0 0 1 0-4.134l.637-.622-.011-.89a2.89 2.89 0 0 1 2.924-2.924l.89.01.622-.636zM7.002 11a1 1 0 1 0 2 0 1 1 0 0 0-2 0zm1.602-2.027c.04-.534.198-.815.846-1.26.674-.475 1.05-1.09 1.05-1.986 0-1.325-.92-2.227-2.262-2.227-1.02 0-1.792.492-2.1 1.29A1.71 1.71 0 0 0 6 5.48c0 .393.203.64.545.64.272 0 .455-.147.564-.51.158-.592.525-.915 1.074-.915.61 0 1.03.446 1.03 1.084 0 .563-.208.885-.822 1.325-.619.433-.926.914-.926 1.64v.111c0 .428.208.745.585.745.336 0 .504-.24.554-.627z" />
          </svg>
        </span>
      );
    }
  }

  prettyPrintReviewer() {
    if (this.props.review.organization) {
      return `${this.props.review.reviewer}, ${this.props.review.organization}`;
    } else {
      return `${this.props.review.reviewer}`;
    }
  }

  // Rendering -----------------------------------------------------------------

  render() {
    return (
      <div className="row align-items-start mb-3">
        <div className="col-7">
          <div className="card">
            <img
              src="https://www.altroconsumo.it/-/media/altroconsumo/images/home/hi%20tech/telefono%20internet%20e%20tv%20digitale/tips/fake%20news_shu_787955047_1600x900.jpg?rev=2ae1d718-e85b-4c70-ae9f-7f88b8f1dc44&mw=660&hash=E9AAC8B9D2F8586387A021F714521035"
              className="card-img-top"
              alt="..."
            />
            <div className="card-body">
              <h5 className="card-title">{this.props.review.title}</h5>
              <h6 className="card-subtitle mb-2 text-muted">
                {this.prettyPrintReviewer()}
              </h6>
              <p className="card-text">{this.props.review.content}</p>
            </div>
            <ul className="list-group list-group-flush">
              <li
                key={this.props.review + "-trusted"}
                className="list-group-item"
              >
                Trusted Source:{" "}
                {this.prettyPrintTrustedSource(this.state.isTrustedSource)}
              </li>
              <li key={this.props.review + "-date"} className="list-group-item">
                Date: {postProcessDate(this.props.review.date)}
              </li>
              <li
                key={this.props.review + "-rating"}
                className="list-group-item"
              >
                Rating: {this.props.review.rating}
              </li>
              <li
                key={this.props.review + "-judgment"}
                className="list-group-item"
              >
                Judgment: {this.props.review.judgment}
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
        <div className="col-5">
          {this.state.mentions.map((element, index) => {
            let url = `https://dbpedia.org/page/${element.entity_uri}`;
            // some post-processing on mention
            return (
              <MentionCard
                key={`mention-${this.props.review.review}-${index}`}
                displaySpinner={this.state.displaySpinner}
                url={url}
                label={element.entity_label}
                info={element.info}
                linkedRes={element.linked_res}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

export default ReviewRichSnippet;
