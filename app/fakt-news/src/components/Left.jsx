import React from "react";
import Card from "./Card";

class Left extends React.Component {
  constructor(props) {
    super(props);
    this.draggedItem = null;
    this.draggedIndex = null;
    this.startRow = null;
    this.doneDragging = false;

    this.state = {
      elements: [],
    };
  }

  render() {
    return (
      <div className="row align-items-start">
        {/* {this.props.elements.forEach((element) => (
          <Card title={element.object}></Card>
        ))} */}
      </div>
    );
  }
}

export default Left;
