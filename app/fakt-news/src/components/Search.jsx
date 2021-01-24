import React, { Component } from "react";
import { Col, Tabs, Tab, Form, Button } from "react-bootstrap";

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
      <div className="row col-12 mb-2">
        <Col md={12}>
          <Tabs
            defaultActiveKey="basicQuery"
            transition={false}
            id="noanim-tab-example"
            variant="tabs"
          >
            <Tab eventKey="basicQuery" title="Basic Query">
              <Form>
                <Form.Row>
                  <Form.Group as={Col} controlId="formGridDate">
                    <Form.Label></Form.Label> {/* Needed for spacing */}
                    <Form.Control type="text" placeholder="Search anything" />
                  </Form.Group>
                </Form.Row>

                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Form>
            </Tab>
            <Tab eventKey="advanced" title="Advanced">
              <Form>
                <Form.Row>
                  <Form.Group as={Col} controlId="formGridDate">
                    <Form.Label></Form.Label> {/* Needed for spacing */}
                    <Form.Control type="text" placeholder="Search anything" />
                  </Form.Group>
                </Form.Row>

                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Form>
            </Tab>
            <Tab eventKey="date" title="Date">
              <Form>
                <Form.Row>
                  <Form.Group as={Col} controlId="formGridDate">
                    <Form.Label></Form.Label> {/* Needed for spacing */}
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
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Form>
            </Tab>
          </Tabs>
        </Col>
      </div>
    );
  }
}

export default Search;
