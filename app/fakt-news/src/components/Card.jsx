import React, { Component } from "react";

class Card extends Component {
  render() {
    return (
      <div className="card mr-3 mb-3">
        <div className="card-body">
          <h5 className="card-title">{this.props.elementName}</h5>
          <h6 className="card-subtitle mb-2 text-muted">
            {this.props.elementId}
          </h6>
          <p className="card-text">
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </p>
          <button
            type="button"
            className="btn btn-light"
            onClick={() =>
              this.props.isClicked(
                this.props.elementId,
                this.props.renderIndex,
                this.props.elementName
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

export default Card;
