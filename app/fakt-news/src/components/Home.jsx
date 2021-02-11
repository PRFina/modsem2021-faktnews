import React, { Component } from "react";
import { Jumbotron, Col, Tabs, Tab, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const { EnapsoGraphDBClient } = require("@innotrade/enapso-graphdb-client");

class Home extends Component {
  constructor(props) {
    super(props);
    this.baseURL = "http://localhost:7200";
    this.repository = "modsem-faktnews";
    // this.repository = "quattro";
    this.graphdbUsername = "modsem";
    this.graphdbPassword = "modsem";

    this.state = { data: null };
  }

  query() {
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
        `SELECT ?eid ?claimContent ?name
        WHERE {
              ?claim a fn:Claim; fn:isClaimedBy ?author .
            ?author schema:name ?name . 
            ?claim fn:claimContent ?claimContent .
            
            BIND(STR(?claim) AS ?eid).	
              BIND(STR(?fcn) AS ?fcname)
              BIND(STR(?fcon) AS ?fconame).
        } LIMIT 100`,
        // `SELECT ?review_title ?entity_label ?info ?linked_res_wiki
        // WHERE {
        //     ?review a :Review;
        //             dct:title ?review_title.
        //     OPTIONAL {?review :mention ?wiki_entity.}
        //     BIND(URI(CONCAT(STR(dbr:), STR(?wiki_entity))) AS ?entity).

        //     SERVICE <https://dbpedia.org/sparql> {
        //         ?entity rdfs:label ?entity_label.
        //     OPTIONAL {?entity rdfs:seeAlso ?linked_res.
        //               ?linked_res foaf:isPrimaryTopicOf ?linked_res_wiki}.
        //         OPTIONAL {?entity rdfs:comment ?info}.
        //         FILTER(langMatches(lang(?entity_label), "en") &&
        //                langMatches(lang(?info),"en"))
        //     }

        // } limit 100`,
        { transform: "toJSON" }
      )
      .then((result) => {
        console.log(
          "Read the classes name:\n" + JSON.stringify(result, null, 2)
        );
        let final = this.dataCleaning(result.records);
        this.setState({ data: final });
        this.props.loadData(final);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  dataCleaning(data) {
    if (data !== null) {
      data.map((element) => {
        return (element.eid = element.eid.replace(/.*#/, ""));
      });
      return data;
    }
  }

  componentDidMount() {
    this.query();
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
                      <Form.Control type="text" placeholder="Search anything" />
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group as={Col} controlId="formGridDate">
                      <Form.Label>From</Form.Label>
                      <Form.Control type="date" />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridPassword">
                      <Form.Label>To</Form.Label>
                      <Form.Control type="date" />
                    </Form.Group>
                  </Form.Row>

                  <Link to="/search">
                    <Button variant="primary">Search</Button>
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
