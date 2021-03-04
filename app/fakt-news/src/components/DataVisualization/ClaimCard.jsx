import React, { Component } from "react";
import { postProcessDate } from "../../Utility";

class ClaimCard extends Component {
  render() {
    return (
      <div className="card mr-3 mb-3">
        <div className="card-body">
          <h5 className="card-title">{this.props.claimAuthor}</h5>
          <h6 className="card-subtitle mb-2 text-muted">
            {postProcessDate(this.props.date)}
          </h6>
          <p className="card-text">{this.props.content}</p>
          <button
            type="button"
            className="btn btn-light mr-2"
            onClick={() =>
              this.props.onClaimantPageClick(this.props.claimAuthor)
            }
          >
            Show claimant page
          </button>
          <button
            type="button"
            className="btn btn-light"
            onClick={() =>
              this.props.onRelatedReviewClick(
                this.props.claim,
                this.props.renderIndex
              )
            }
          >
            Show related Review
          </button>
        </div>
      </div>
    );
  }
}

export default ClaimCard;
