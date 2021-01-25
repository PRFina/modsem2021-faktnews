import React from "react";
import Card from "./Card";
import RichSnippet from "./RichSnippet";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

class Results extends React.Component {
  constructor(props) {
    super(props);
    this.handleCardClick = this.handleCardClick.bind(this);
    this.selectedId = null;
    this.selectedName = null;

    this.state = {
      elements: this.props.elements,
      selectedId: null,
      selectedName: null,
      displayRichSnippet: false,
    };
  }

  handleCardClick(id, name) {
    // this.selectedId = id;
    // this.selectedName = name;
    // this.displayRichSnippet = true;
    this.setState({
      selectedId: id,
      selectedName: name,
      displayRichSnippet: true,
    });
    // console.log(`clicked ${this.selectedId}`);
  }

  render() {
    return (
      <div className="row">
        <div className="col-1">
          <Button variant="light" size="lg">
            <Link to="/">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="grey"
                class="bi bi-caret-left-fill"
                viewBox="0 0 16 16"
              >
                <path d="M3.86 8.753l5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
              </svg>
            </Link>
          </Button>
        </div>
        <div className="col-6">
          <div className="row align-items-start">
            {this.props.elements &&
              this.props.elements.map((element) => (
                <Card
                  key={element.eid}
                  elementId={element.eid}
                  elementName={element.object}
                  isClicked={this.handleCardClick}
                ></Card>
              ))}
          </div>
        </div>
        <div className="col-5">
          <RichSnippet
            displayRichSnippet={this.state.displayRichSnippet}
            key={this.state.elementId}
            id={this.state.selectedId}
            name={this.state.selectedName}
          />
        </div>
      </div>
    );
  }
}

export default Results;
