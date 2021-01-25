import React, { Component } from "react";
import Results from "./Results";
import Home from "./Home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

class App extends Component {
  constructor(props) {
    super(props);
    this.loadData = this.loadData.bind(this);

    this.state = {
      data: [],
    };
  }

  loadData(updatedData) {
    this.setState({ data: updatedData });
  }

  render() {
    return (
      <div className="container">
        <span class="navbar-brand m-2 h1">Fakt News</span>

        <Router>
          <Switch>
            <Route exact path="/">
              <Home loadData={this.loadData} />
            </Route>
            <Route path="/search">
              <Results elements={this.state.data} />
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
