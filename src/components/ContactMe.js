import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const ContactMe = () => {
  return (
    <Container>
      <Row>
        <Col>
          <b>Email: </b>
          <a href="mailto:leizhengwen@126.com">leizhengwen@126.com</a>
        </Col>
      </Row>
    </Container>
  );
};

export default ContactMe;
