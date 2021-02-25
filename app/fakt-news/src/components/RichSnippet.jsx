import React, { Component } from "react";
import { Carousel } from "react-bootstrap";

class RichSnippet extends Component {
  render() {
    if (this.props.displayRichSnippet === true) {
      return (
        <div className="row align-items-start">
          <div className="card" style={{ width: "18rem" }}>
            <img
              src="https://www.altroconsumo.it/-/media/altroconsumo/images/home/hi%20tech/telefono%20internet%20e%20tv%20digitale/tips/fake%20news_shu_787955047_1600x900.jpg?rev=2ae1d718-e85b-4c70-ae9f-7f88b8f1dc44&mw=660&hash=E9AAC8B9D2F8586387A021F714521035"
              className="card-img-top"
              alt="..."
            />
            <div className="card-body">
              <h5 className="card-title">{this.props.reviewAuthor}</h5>
              <h6 class="card-subtitle mb-2 text-muted">
                Author, Organization
              </h6>
              <p className="card-text">{this.props.reviewContent}</p>
            </div>
            <ul className="list-group list-group-flush">
              {/* <li className="list-group-item">Test-ID: {this.props.id}</li> */}
              <li className="list-group-item">Date: {this.props.reviewDate}</li>
              <li className="list-group-item">
                Rating: {this.props.reviewRating}
              </li>
              <li className="list-group-item">
                Judgment: {this.props.reviewJudgment}
              </li>
              <li className="list-group-item">Trusted Source</li>
            </ul>
            <div className="card-body">
              <a href={this.props.reviewURL} className="card-link">
                Review URL
              </a>
            </div>
            <div class="card-footer">
              <Carousel>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src="holder.js/800x400?text=First slide&bg=373940"
                    alt="First slide"
                  />
                  <Carousel.Caption>
                    <h3>First slide label</h3>
                    <p>
                      Nulla vitae elit libero, a pharetra augue mollis interdum.
                    </p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src="holder.js/800x400?text=Second slide&bg=282c34"
                    alt="Second slide"
                  />

                  <Carousel.Caption>
                    <h3>Second slide label</h3>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </p>
                  </Carousel.Caption>
                </Carousel.Item>
              </Carousel>
            </div>
          </div>
        </div>
      );
    } else {
      return <p></p>;
    }
  }
}

export default RichSnippet;
