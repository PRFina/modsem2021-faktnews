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

  handleClaimantPageClick(updatedClaimant) {
    this.setState({
      claimAuthor: updatedClaimant,
    });
  }

  handleRelatedReviewClick(id, index) {
    this.setState({
      renderIndex: index,
      reviews: [],
      displayRichSnippet: true,
    });
    this.handleQ7(id);
  }

  // Business Logic ------------------------------------------------------------

  implodeReviews(arr) {
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
        let final = this.dataCleaning(result.records);

        console.log(final);
        this.implodeReviews(final);

        // Passing the data to the App component, in order to render the
        // results in the Results component.
        // this.setState({
        //   reviews: final,
        // });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  dataCleaning(data) {
    // Support method for handleQ7()
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
        {/* <div className="row">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li class="breadcrumb-item active" aria-current="page">
                Search
              </li>
            </ol>
          </nav>
        </div> */}
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
