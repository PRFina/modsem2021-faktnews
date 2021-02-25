import React from "react";
import Card from "./Card";
import RichSnippet from "./RichSnippet";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const { EnapsoGraphDBClient } = require("@innotrade/enapso-graphdb-client");

class Results extends React.Component {
  constructor(props) {
    super(props);

    this.baseURL = "http://localhost:7200";
    this.repository = "modsem-faktnews";
    this.graphdbUsername = "modsem";
    this.graphdbPassword = "modsem";

    this.state = {
      elements: this.props.elements,
      renderingIndex: null, // the index generated by the map function when rendering the result. Used for unique key in snippet key.
      selectedClaim: null,
      claimAuthor: null,
      selectedReview: null,
      reviewAuthor: null,
      reviewDate: null,
      reviewRating: null,
      reviewJudgment: null,
      reviewContent: null,
      reviewTag: null,
      reviewTrustedSource: false,
      reviewURL: null,
      reviewMentions: [],
      displayRichSnippet: false,
    };

    this.handleRelatedReviewClick = this.handleRelatedReviewClick.bind(this);
    this.handleClaimantPageClick = this.handleClaimantPageClick.bind(this);
    this.handleQ7 = this.handleQ7.bind(this);
  }

  handleClaimantPageClick(updatedClaimant) {
    this.setState({
      claimAuthor: updatedClaimant,
    });
  }

  handleRelatedReviewClick(id, index) {
    this.setState({
      renderIndex: index,
      displayRichSnippet: true,
    });
    this.handleQ7(id);
  }

  // Handling query requests ---------------------------------------------------

  handleQ7(selectedClaim) {
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
        `SELECT ?claim ?review ?reviewer ?date ?rating ?judgment ?content ?tag ?url ?mention
        WHERE {
            ?claimId a fn:Claim; fn:associatedReview ?associatedReview.
            ?associatedReview fn:isReviewedBy ?agent.
            ?agent schema:name ?reviewer.
            ?associatedReview fn:hasRating ?r.
            ?r fn:ratingValue ?rating.
            ?associatedReview fn:hasJudgment ?j.
            ?j fn:judgmentSummary ?judgment.
            ?associatedReview fn:reviewContent ?content.
            ?associatedReview dct:date ?date.
            ?associatedReview fn:tag ?tag.
            ?associatedReview schema:url ?url.
            ?associatedReview fn:mention ?mention.
            BIND(STR(?claimId) as ?claim)
            BIND(STR(?associatedReview) as ?review)
            BIND("${selectedClaim}" AS ?claimToFind).
            FILTER(contains(?claim, ?claimToFind)).
        } 
        LIMIT 100`,
        { transform: "toJSON" }
      )
      .then((result) => {
        console.log(
          "Read the classes name:\n" + JSON.stringify(result, null, 2)
        );
        let final = this.dataCleaning(result.records);
        // Passing the data to the App component, in order to render the
        // results in the Results component.
        this.setState({
          selectedReview: final[0].review,
          reviewAuthor: final[0].reviewer,
          reviewDate: final[0].date,
          reviewRating: final[0].rating,
          reviewJudgment: final[0].judgment,
          reviewContent: final[0].content,
          reviewTag: final[0].tag,
          reviewTrustedSource: false,
          reviewURL: final[0].url,
          reviewMentions: [final[0].mention],
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  dataCleaning(data) {
    if (data !== null) {
      data.map((element) => {
        return (element.claim = element.claim.replace(/.*#/, ""));
      });
      return data;
    }
  }

  render() {
    return (
      <div className="row">
        <div className="col-1">
          <Link to="/">
            <Button variant="light" size="lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="grey"
                className="bi bi-caret-left-fill"
                viewBox="0 0 16 16"
              >
                <path d="M3.86 8.753l5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
              </svg>
            </Button>
          </Link>
        </div>
        <div className="col-6">
          <div className="row align-items-start">
            {this.props.elements &&
              this.props.elements.map((element, index) => (
                <Card
                  key={`card-${index}`}
                  claim={element.claim}
                  claimAuthor={element.claimAuthor}
                  renderIndex={index}
                  date={element.claim_date}
                  content={element.content}
                  onClaimantPageClick={this.handleClaimantPageClick}
                  onRelatedReviewClick={this.handleRelatedReviewClick}
                ></Card>
              ))}
          </div>
        </div>
        <div className="col-5">
          <RichSnippet
            key={`snippet-${this.state.renderIndex}`}
            displayRichSnippet={this.state.displayRichSnippet}
            review={this.state.selectedReview}
            reviewAuthor={this.state.reviewAuthor}
            reviewDate={this.state.reviewDate}
            reviewRating={this.state.reviewRating}
            reviewJudgment={this.state.reviewJudgment}
            reviewContent={this.state.reviewContent}
            reviewTag={this.state.reviewTag}
            reviewURL={this.state.reviewURL}
            reviewMentions={this.state.reviewMentions}
          />
        </div>
      </div>
    );
  }
}

export default Results;
