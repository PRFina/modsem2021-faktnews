import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import ClaimCard from "./DataVisualization/ClaimCard";
import ReviewRichSnippet from "./DataVisualization/ReviewRichSnippet";
import {
  graphDBEndpoint,
  GRAPHDB_USERNAME,
  GRAPHDB_PASSWORD,
} from "../TripleStoreConfig";

class Results extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      elements: this.props.elements,
      selectedClaim: null,
      reviews: [],
      selectedReview: null,
      displayRichSnippet: false,
    };

    this.handleRelatedReviewClick = this.handleRelatedReviewClick.bind(this);
    this.handleClaimantPageClick = this.handleClaimantPageClick.bind(this);
    this.handleQ7 = this.handleQ7.bind(this);
    this.implodeReviews = this.implodeReviews.bind(this);
  }

  // Lifecycle Hooks -----------------------------------------------------------

  componentWillUnmount() {
    // resetting the state on unmounting
    this.setState({
      elements: this.props.elements,
      selectedClaim: null,
      reviews: [],
      selectedReview: null,
      displayRichSnippet: false,
    });
  }

  // UI clicks -----------------------------------------------------------------

  handleClaimantPageClick(updatedClaimant) {
    // TODO: future works, to be implemented.
    this.setState({
      claimAuthor: updatedClaimant,
    });
  }

  handleRelatedReviewClick(id, index) {
    // it updates the state after the click on "Show related Reviews" button.
    this.setState({
      renderIndex: index,
      reviews: [],
      displayRichSnippet: true,
    });

    // and it send the Q7 query to the repository.
    this.handleQ7(id);
  }

  // Business Logic ------------------------------------------------------------

  implodeReviews(arr) {
    /* this method takes all the entries of the same review linked to a claim
    and "implodes" them into one.

    More specifically, since for 1 claim we have 1 review, but this review
    contains several mentions, GraphDB is not able to return a single review
    with a list of mentions, rather it returns a set whose elements are all the
    same review, but each with a different mention. 
    
    To solve the problem, this method takes all the entries of the single
    review linked to a claim and merges them all into one object, replacing the
    single mention with a list of all mentions.
    */

    let temp = new Map();
    arr.forEach((element) => {
      if (!temp.has(element.claim)) {
        let copy = element;
        copy.mention = [copy.mention];
        temp.set(copy.claim, copy);
      } else {
        let rev = temp.get(element.claim);
        if (!rev.mention.includes(element.mention)) {
          rev.mention.push(element.mention);
        }
      }
    });
    let i = [];
    temp.forEach((element, key) => {
      i = this.state.reviews;
      i.push(element);
    });
    this.setState({ review: i });
  }

  // SPARQL Queries ------------------------------------------------------------

  handleQ7(selectedClaim) {
    // it sends the Q7 query to the GraphDB repository and hanldes the
    // response.

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
        `SELECT ?claim ?review ?title ?reviewer ?organization ?date ?rating ?judgment ?content ?url ?mention
        WHERE {
            ?claimId a fn:Claim; fn:associatedReview ?associatedReview.
            ?associatedReview fn:isReviewedBy ?agent.
            ?agent schema:name ?reviewer.
            OPTIONAL{
                ?agent fn:affiliatedTo ?fco.
                ?fco schema:name ?organization.
            }
            ?associatedReview dct:title ?title.
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
            BIND("http://www.modsem.org/fakt-news#${selectedClaim}" AS ?claimToFind). 
            FILTER(?claim = ?claimToFind).
        } 
        LIMIT 100`,
        { transform: "toJSON" }
      )
      .then((result) => {
        // do some cleaning of the URI using the dataCleaning() support method
        let final = this.dataCleaning(result.records);
        this.implodeReviews(final);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  dataCleaning(data) {
    // support method, it cleans the URI of the Claim and the Review deleting
    // all characters before the "#".
    if (data !== null) {
      data.forEach((element) => {
        element.claim = element.claim.replace(/.*#/, "");
        element.review = element.review.replace(/.*#/, "");
      });
      return data;
    }
  }

  // Rendering -----------------------------------------------------------------

  render() {
    return (
      <>
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
          <div className="col-5">
            <div className="row align-items-start">
              {this.props.elements &&
                this.props.elements.map((element, index) => (
                  <ClaimCard
                    key={`card-${element.claim}`}
                    claim={element.claim}
                    claimAuthor={element.claim_author}
                    renderIndex={index}
                    date={element.claim_date}
                    content={element.content}
                    onClaimantPageClick={this.handleClaimantPageClick}
                    onRelatedReviewClick={this.handleRelatedReviewClick}
                  ></ClaimCard>
                ))}
            </div>
          </div>
          <div className="col-6">
            {this.state.reviews.map((element, index) => (
              <ReviewRichSnippet
                key={`snippet-${element.claim}-${element.review}`}
                review={element}
              />
            ))}
          </div>
        </div>
      </>
    );
  }
}

export default Results;
