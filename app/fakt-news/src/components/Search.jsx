import React, { Component } from "react";

class Search extends Component {
  constructor(props) {
    super(props);
    this.handleAdvanced = this.handleAdvanced.bind(this);
    this.state = { isAdvancedVisible: false };
  }

  handleAdvanced() {
    if (this.state.isAdvancedVisible) {
      this.setState({ isAdvancedVisible: false });
    } else {
      this.setState({ isAdvancedVisible: true });
    }
  }

  render() {
    return (
      <>
        <form className="col-12 align-items-center m-2">
          <div className="form-row">
            <div className="col-8">
              <input
                type="text"
                className="form-control"
                placeholder="Jane Doe"
              />
            </div>
            <div className="col-2">
              <button className="btn btn-primary">Search</button>
            </div>
            <div className="col-2">
              <button
                className="btn btn-secondary"
                onClick={this.handleAdvanced}
              >
                Advanced
              </button>
            </div>
          </div>
        </form>
      </>
    );
  }
}

export default Search;
