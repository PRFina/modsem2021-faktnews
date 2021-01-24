import React from "react";
import Card from "./Card";
import RichSnippet from "./RichSnippet";

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
        <div className="col">
          <div className="row align-items-start">
            {this.props.elements &&
              this.props.elements.map((element) => (
                <Card
                  key={element.subject}
                  elementId={element.subject}
                  elementName={element.object}
                  isClicked={this.handleCardClick}
                ></Card>
              ))}
          </div>
        </div>
        <div className="col">
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
