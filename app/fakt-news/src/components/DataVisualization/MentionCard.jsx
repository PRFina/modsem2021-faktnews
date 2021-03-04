import React, { Component } from "react";
import { truncateText } from "../../Utility";

class MentionCard extends Component {
  render() {
    if (this.props.displaySpinner) {
      return (
        <div class="d-flex align-items-center">
          <strong>Loading...</strong>
          <div
            class="spinner-border ml-auto"
            role="status"
            aria-hidden="true"
          ></div>
        </div>
      );
    } else {
      return (
        <div className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">
              <a href={this.props.url}>{this.props.label}</a>
            </h5>
            <p className="card-text">
              {truncateText(this.props.info, 100, "")}
              <a href={this.props.url}>continue reading.</a>
            </p>
          </div>
          {this.state.linkedRes !== [] && (
            <div className="card-footer">
              <h6>Linked Resources</h6>

              <ul>
                {this.props.linkedRes.slice(0, 3).map((link, index) => {
                  if (link.wiki !== undefined && link.label !== undefined) {
                    return (
                      <li key={index}>
                        <a href={link.wiki}>{link.label}</a>
                      </li>
                    );
                  } else {
                    return "";
                  }
                })}
              </ul>
            </div>
          )}
        </div>
      );
    }
  }
}

export default MentionCard;
