import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: "calc(100vh - 156px)" }}
    >
      <Row className="w-100">
        {/* Adjust the card's width using breakpoints */}
        <Col xs={12} sm={10} md={8} lg={6} xl={5} className="mx-auto">
          <Card className="text-center shadow-lg">
            <Card.Body>
              <Card.Title as="h2" className="mb-4">
                Welcome to PDF Utility
              </Card.Title>
              <Card.Text>
                Disappointed to find that many PDF tools require registration
                and charge fees. I developed this tool to allow free usage.
                Please share your suggestions to make it better via email:
                leizhengwen@126.com.
              </Card.Text>
              <Row className="g-3">
                <Col xs={12}>
                  <Link to="/reader">
                    <Button variant="info" className="w-100">
                      PDF Reader
                    </Button>
                  </Link>
                </Col>
                <Col xs={12}>
                  <Link to="/editor">
                    <Button variant="primary" className="w-100">
                      Edit PDF
                    </Button>
                  </Link>
                </Col>
                <Col xs={12}>
                  <Link to="/extractor">
                    <Button variant="success" className="w-100">
                      Extract Pages
                    </Button>
                  </Link>
                </Col>

                <Col xs={12}>
                  <Link to="/merger">
                    <Button variant="warning" className="w-100">
                      Merge PDFs
                    </Button>
                  </Link>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
