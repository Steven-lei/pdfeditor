import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";

const PDFEditor = () => {
  const [pdfInfo, setPdfInfo] = useState(null);
  return (
    <Container fluid style={{ height: "100vh", overflow: "hidden" }}>
      {/* Header with PDF Info */}
      <Row>
        <Col>
          <h4>{pdfInfo ? `PDF Editor: ${pdfInfo.title}` : "PDF Editor"}</h4>
          Be patient, it is still under construction ...
        </Col>
      </Row>
    </Container>
  );
};

export default PDFEditor;
