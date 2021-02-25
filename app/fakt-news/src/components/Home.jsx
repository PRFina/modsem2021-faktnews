import React, { Component } from "react";
import { Jumbotron, Col, Tabs, Tab, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
// import { query3 } from "./Query";

const { EnapsoGraphDBClient } = require("@innotrade/enapso-graphdb-client");

class Home extends Component {
  constructor(props) {
    super(props);
    this.baseURL = "http://localhost:7200";
    this.repository = "modsem-faktnews";
    // this.repository = "quattro";
    this.graphdbUsername = "modsem";
    this.graphdbPassword = "modsem";

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
    const DEFAULT_PREFIXES = [
      EnapsoGraphDBClient.PREFIX_OWL,
      EnapsoGraphDBClient.PREFIX_RDF,
      EnapsoGraphDBClient.PREFIX_RDFS,
      EnapsoGraphDBClient.PREFIX_XSD,
      {
        prefix: "", // TODO: gestire il prefisso vuoto
        iri: "http://www.modsem.org/fakt-news#",
      },
      {
        prefix: "fn",
        iri: "http://www.modsem.org/fakt-news#",
      },
      {
        prefix: "dct",
        iri: "http://purl.org/dc/terms/",
      },
      {
        prefix: "prov",
        iri: "http://www.w3.org/ns/prov#",
      },
      {
        prefix: "schema",
        iri: "http://schema.org/",
      },
      {
        prefix: "dbr",
        iri: "http://dbpedia.org/resource/",
      },
      {
        prefix: "foaf",
        iri: "http://xmlns.com/foaf/0.1/",
      },
    ];

    let graphDBEndpoint = new EnapsoGraphDBClient.Endpoint({
      baseURL: this.baseURL,
      repository: this.repository,
      prefixes: DEFAULT_PREFIXES,
      transform: "toJSON",
    });

    graphDBEndpoint
      .login(this.graphdbUsername, this.graphdbPassword)
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
        // `SELECT ?eid ?claimContent ?name
        // WHERE {
        //       ?claim a fn:Claim; fn:isClaimedBy ?author .
        //     ?author schema:name ?name .
        //     ?claim fn:claimContent ?claimContent .

        //     BIND(STR(?claim) AS ?eid).
        //       BIND(STR(?fcn) AS ?fcname)
        //       BIND(STR(?fcon) AS ?fconame).
        // } LIMIT 100`,
        { transform: "toJSON" }
      )
      .then((result) => {
        console.log(
          "Read the classes name:\n" + JSON.stringify(result, null, 2)
        );
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
              <Tab eventKey="advanced" title="Advanced">
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
              <Tab eventKey="date" title="Date">
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
