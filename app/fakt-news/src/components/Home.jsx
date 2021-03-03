import React, { Component } from "react";
import { Jumbotron, Col, Tabs, Tab, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  graphDBEndpoint,
  GRAPHDB_USERNAME,
  GRAPHDB_PASSWORD,
} from "./TripleStoreConfig";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      ranking: [],
      keyword: "",
      author: "",
      startDate: null,
      endDate: null,
      language: "",
    };

    this.onKeywordChange = this.onKeywordChange.bind(this);
    this.onStartDateChange = this.onStartDateChange.bind(this);
    this.onEndDateChange = this.onEndDateChange.bind(this);
    this.handleQ1 = this.handleQ1.bind(this);
  }

  // Handling states updates ---------------------------------------------------

  onKeywordChange(newKeywork) {
    this.setState({ keyword: newKeywork });
  }

  onAuthorChange(newAuthor) {
    this.setState({ author: newAuthor });
  }

  onStartDateChange(newStartDate) {
    this.setState({ startDate: newStartDate.concat("T00:00:00Z") });
  }

  onEndDateChange(newEndDate) {
    this.setState({ endDate: newEndDate.concat("T00:00:00Z") });
  }

  onLanguageChange(newLanguage) {
    this.setState({ language: newLanguage });
  }

  isFieldFilled(field) {
    if (field === "author") {
      if (this.state.author !== "") {
        return `FILTER(contains(?claimAuthor, "${this.state.author}")).`;
      } else {
        return "";
      }
    } else if (field === "date") {
      if (this.state.startDate !== null && this.state.endDate !== null) {
        return `BIND("${this.state.startDate}"^^xsd:dateTime AS ?first_date)
            BIND("${this.state.endDate}"^^xsd:dateTime AS ?last_date)
            BIND(xsd:dateTime(?claim_date) AS ?claim_datetime).
            FILTER( ?claim_datetime > ?fsirst_date && ?claim_datetime < ?last_date ).`;
      } else {
        return "";
      }
    } else if (field === "language") {
      if (this.state.language !== "") {
        return `FILTER(contains(?language, "${this.state.language}")).`;
      } else {
        return "";
      }
    }
  }

  // Handling query requests ---------------------------------------------------

  componentDidMount() {
    this.handleQ10();
  }

  handleQ1() {
    graphDBEndpoint
      .login(GRAPHDB_USERNAME, GRAPHDB_PASSWORD)
      .then((result) => {
        // console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });

    graphDBEndpoint
      .query(
        `SELECT ?claim ?claimAuthor ?claim_date ?content ?language
        WHERE { 
            # Required
            ?claim fn:claimContent ?content.
            FILTER(contains(?content, "${this.state.keyword}")).
            
            # Filtering on claim author
            ?claim fn:isClaimedBy ?agent.
            ?agent schema:name ?claimAuthor.
            ${this.isFieldFilled("author")}
        
            # Filtering on date
            ?claim a fn:Claim; dct:date ?claim_date.
            
            ${this.isFieldFilled("date")}
            
            # Filtering on language
            ?claim dct:language ?language.
            # Note, it works with contains and not with =
            # Because for definition each string contains a substring of ""
            ${this.isFieldFilled("language")}
        }
        LIMIT 100`,
        { transform: "toJSON" }
      )
      .then((result) => {
        console.log(result.records);
        let final = this.dataCleaning(result.records);
        console.log(final);

        // Passing the data to the App component, in order to render the
        // results in the Results component.
        this.props.loadResults(final);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  dataCleaning(data) {
    if (data !== null) {
      data.map((element) => {
        return (element.claim = element.claim.replace(/.*#/, ""));
      });
      return data;
    }
  }

  handleQ10() {
    graphDBEndpoint
      .login(GRAPHDB_USERNAME, GRAPHDB_PASSWORD)
      .then((result) => {
        // console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });

    graphDBEndpoint
      .query(
        `SELECT ?claimant (count(?claim) as ?numberClaims)
        WHERE {
            ?claim a fn:Claim; fn:isClaimedBy ?someone.
            ?someone schema:name ?claimant.
        } 
        GROUP BY ?claimant
        ORDER BY DESC(?numberClaims)
        LIMIT  100`,
        { transform: "toJSON" }
      )
      .then((result) => {
        // console.log(result.records);
        this.setState({ ranking: result.records });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  componentWillUnmount() {
    // resetting the state
    this.setState({
      data: null,
      keyword: "",
      author: "",
      startDate: null,
      endDate: null,
      language: "",
    });
  }

  render() {
    return (
      <>
        <Jumbotron>
          <h1>Welcome to Fakt News</h1>
          <p>We are the best in the world in searching facts!</p>
        </Jumbotron>
        <div className="row col-12 mb-4">
          <Col md={12}>
            <Tabs
              defaultActiveKey="basicQuery"
              transition={false}
              id="noanim-tab-example"
              variant="pills"
            >
              <Tab eventKey="basicQuery" title="Basic Query">
                <Form onSubmit={this.test}>
                  <Form.Row>
                    <Form.Group as={Col} controlId="formGridDate">
                      <Form.Label></Form.Label>
                      <Form.Control
                        required
                        type="text"
                        placeholder="Search in claim content"
                        onChange={(e) => this.onKeywordChange(e.target.value)}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please type a keyword to search.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Form.Row>
                  <Link to="/search">
                    <Button
                      variant="primary"
                      onClick={this.handleQ1}
                      disabled={this.state.keyword === "" ? true : false}
                    >
                      Search
                    </Button>
                  </Link>
                </Form>
              </Tab>
              <Tab eventKey="date" title="Advanced">
                <Form>
                  <Form.Row>
                    <Form.Group as={Col} controlId="formGridDate">
                      <Form.Label></Form.Label>
                      <Form.Control
                        required
                        type="text"
                        placeholder="Search in claim content"
                        onChange={(e) => this.onKeywordChange(e.target.value)}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please type a keyword to search.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group as={Col} controlId="formGridDate">
                      <Form.Label>Author</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Claim author name"
                        onChange={(e) => this.onAuthorChange(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridPassword">
                      <Form.Label>Language</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Claim language"
                        onChange={(e) => this.onLanguageChange(e.target.value)}
                      />
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group as={Col} controlId="formGridDate">
                      <Form.Label>From</Form.Label>
                      <Form.Control
                        type="date"
                        onChange={(e) => this.onStartDateChange(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridPassword">
                      <Form.Label>To</Form.Label>
                      <Form.Control
                        type="date"
                        onChange={(e) => this.onEndDateChange(e.target.value)}
                      />
                    </Form.Group>
                  </Form.Row>

                  <Link to="/search">
                    <Button
                      variant="primary"
                      onClick={this.handleQ1}
                      disabled={this.state.keyword === "" ? true : false}
                    >
                      Search
                    </Button>
                  </Link>
                </Form>
              </Tab>
            </Tabs>
          </Col>
        </div>
        <h3 className="mt-2 mb-2">Claimant's Ranking</h3>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Claimant</th>
              <th scope="col">Number of claims</th>
            </tr>
          </thead>
          <tbody>
            {this.state.ranking.map((element, index) => {
              return (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{element.claimant}</td>
                  <td>{element.numberClaims}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </>
    );
  }
}

export default Home;
