import React from "react";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import Home from "./components/Home";
import PDFExtractor from "./components/PDFExtractor";
import PDFReader from "./components/PDFReader";
import PDFEditor from "./components/PDFEditor";
import MyNav from "./components/MyNav";
import PDFMerger from "./components/PDFMerger";
import ContactMe from "./components/ContactMe";

function App() {
  return (
    <Router>
      <MyNav></MyNav>

      <Container fluid className="my-4" style={{ minWidth: "480px" }}>
        <Row>
          <Col>
            <Routes>
              <Route path="/" exact element={<Home></Home>} />
              <Route
                path="/extractor"
                element={<PDFExtractor></PDFExtractor>}
              />
              <Route path="/merger" element={<PDFMerger></PDFMerger>} />
              <Route path="/reader" element={<PDFReader></PDFReader>} />
              <Route path="/editor" element={<PDFEditor></PDFEditor>} />
              <Route path="/contact" element={<ContactMe></ContactMe>} />
            </Routes>
          </Col>
        </Row>
      </Container>
    </Router>
  );
}

export default App;
