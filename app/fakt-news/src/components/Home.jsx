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
      keyword: "",
      startDate: null,
      endDate: null,
    };

    this.onKeywordChange = this.onKeywordChange.bind(this);
    this.onStartDateChange = this.onStartDateChange.bind(this);
    this.onEndDateChange = this.onEndDateChange.bind(this);
    this.handleSearchDate = this.handleSearchDate.bind(this);
  }

  // Handling states updates ---------------------------------------------------

  onKeywordChange(newKeywork) {
    this.setState({ keyword: newKeywork });
  }

  onStartDateChange(newStartDate) {
    this.setState({ startDate: newStartDate.concat("T00:00:00Z") });
  }

  onEndDateChange(newEndDate) {
    this.setState({ endDate: newEndDate.concat("T00:00:00Z") });
  }

  // Handling query requests ---------------------------------------------------

  handleSearchDate() {
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
        `SELECT ?claim ?claimAuthor ?claim_date ?content
        WHERE { 
            ?claim a fn:Claim; dct:date ?claim_date.
            ?claim fn:claimContent ?content.
            ?claim fn:isClaimedBy ?agent.
            ?agent schema:name ?claimAuthor.
            BIND("${this.state.startDate}"^^xsd:dateTime AS ?first_date)
            BIND("${this.state.endDate}"^^xsd:dateTime AS ?last_date)
            BIND(xsd:dateTime(?claim_date) AS ?claim_datetime)
            FILTER( ?claim_datetime > ?first_date && ?claim_datetime < ?last_date )
        } limit 100 `,
        { transform: "toJSON" }
      )
      .then((result) => {
        let final = this.dataCleaning(result.records);

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

  render() {
    return (
      <>
        <Jumbotron>
          <h1>Welcome to Fakt News</h1>
          <p>We are the best in the world in searching facts!</p>
        </Jumbotron>
        <div className="row col-12 mb-2">
          <Col md={12}>
            <Tabs
              defaultActiveKey="basicQuery"
              transition={false}
              id="noanim-tab-example"
              variant="pills"
            >
              <Tab eventKey="basicQuery" title="Basic Query">
                <Form>
                  <Form.Row>
                    <Form.Group as={Col} controlId="formGridDate">
                      <Form.Label></Form.Label>
                      <Form.Control type="text" placeholder="Search anything" />
                    </Form.Group>
                  </Form.Row>

                  <Link to="/search">
                    <Button variant="primary">Search</Button>
                  </Link>
                </Form>
              </Tab>
              <Tab eventKey="date" title="Advanced">
                <Form>
                  <Form.Row>
                    <Form.Group as={Col} controlId="formGridDate">
                      <Form.Label></Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Search anything"
                        onChange={(e) => this.onKeywordChange(e.target.value)}
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
                    <Button variant="primary" onClick={this.handleSearchDate}>
                      Search
                    </Button>
                  </Link>
                </Form>
              </Tab>
            </Tabs>
          </Col>
        </div>
      </>
    );
  }
}

export default Home;
