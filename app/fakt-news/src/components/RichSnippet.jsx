import React, { Component } from "react";
import { postProcessDate } from "./Utility";
import { Pagination } from "react-bootstrap";

class RichSnippet extends Component {
  constructor(props) {
    super(props);

    this.allPages = new Map();
    this.pagesNumber = [];
    this.state = {
      actualPage: [],
    };
  }

  postProcessMention(mention) {
    return mention.replace("_", " ");
  }

  preparePagination() {
    let pagesCounter = 0;
    let items = [];

    this.props.reviewMentions.forEach((element, index) => {
      if (index % 6 === 0) {
        // if the first element or the first of a new page
        pagesCounter = pagesCounter + 1;
        this.allPages.set(pagesCounter, [element]);
      } else {
        let arrayOfLinks = this.allPages.get(pagesCounter);
        arrayOfLinks.push(element);
      }
    });
    console.log(this.allPages);

    this.allPages.forEach((value, key) => {
      console.log(key, value);
      items.push(key);
    });

    return (
      <>
        <ul>
          {this.state.actualPage.map((element) => (
            <li>
              <a href={element}>{this.postProcessMention(element)}</a>
            </li>
          ))}
        </ul>
        <div className="row justify-content-center">
          <nav aria-label="Page navigation example">
            <ul class="pagination">
              {items.map((elem, index) => (
                <li class="page-item">
                  <a
                    class="page-link"
                    href="#"
                    onClick={() =>
                      this.setState({
                        actualPage: this.allPages.get(index + 1),
                      })
                    }
                  >
                    {index + 1}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </>
    );
  }

  previousSlice() {}

  render() {
    if (this.props.displayRichSnippet === true) {
      return (
        <div className="row align-items-start">
          <div className="card col-">
            <img
              src="https://www.altroconsumo.it/-/media/altroconsumo/images/home/hi%20tech/telefono%20internet%20e%20tv%20digitale/tips/fake%20news_shu_787955047_1600x900.jpg?rev=2ae1d718-e85b-4c70-ae9f-7f88b8f1dc44&mw=660&hash=E9AAC8B9D2F8586387A021F714521035"
              className="card-img-top"
              alt="..."
            />
            <div className="card-body">
              <h5 className="card-title">{this.props.reviewAuthor}</h5>
              <h6 className="card-subtitle mb-2 text-muted">
                Author, Organization
              </h6>
              <p className="card-text">{this.props.reviewContent}</p>
            </div>
            <ul className="list-group list-group-flush">
              {/* <li className="list-group-item">Test-ID: {this.props.id}</li> */}
              <li className="list-group-item">
                Date: {postProcessDate(this.props.reviewDate)}
              </li>
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
            <div className="card-footer">{this.preparePagination()}</div>
          </div>
        </div>
      );
    } else {
      return <p></p>;
    }
  }
}

export default RichSnippet;
