import React from "react";

class Left extends React.Component {
  render() {
    return (
      <div className="row align-items-start">
        <div className="card mr-3">
          <div className="card-body">
            <h5 className="card-title">Card title</h5>
            <h6 className="card-subtitle mb-2 text-muted">Card subtitle</h6>
            <p className="card-text">
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </p>
            <a href="#testLeft0" className="card-link">
              Card link
            </a>
            <a href="#testLeft1" className="card-link">
              Another link
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default Left;
