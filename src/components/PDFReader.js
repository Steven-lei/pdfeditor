import React, { useState } from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import Header from "./Header";
import Sidebar from "./Sidebar";
import PDFViewer from "./PDFViewer";
import { Col, Container, Row } from "react-bootstrap";

const pdfjs = require("pdfjs-dist");
pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf/pdf.worker.mjs`;

function PDFReader() {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfInfo, setPdfInfo] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pdfData, setPdfData] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setCurrentPage(1);
      setPdfFile(file);
      const pdf = await pdfjs.getDocument(URL.createObjectURL(file)).promise;
      setPdfData(pdf);
      setPdfInfo({
        title: file.name,
        pages: pdf.numPages,
      });
      const docMetadata = await pdf.getMetadata();
      setMetadata(docMetadata.metadata);
    }
  };
  const handleSelectedPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Container fluid>
      <Row>
        <Col xs="auto">
          <Container
            className="py-4 flex mb-3"
            style={{
              width: "400px",
              maxHeight: "87vh", // Set your desired max height
              overflowY: "auto",
              overflowX: "hidden",
              paddingRight: "10px", // optional: space for scrollbar
              border: "1px solid #ccc",
            }}
          >
            <Row>
              <Col>
                <Header
                  title={
                    pdfInfo ? `PDF Reader: ${pdfInfo.title}` : "PDF Reader"
                  }
                  pages={pdfInfo?.pages}
                  handleFileUpload={handleFileUpload}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <Sidebar
                  pdfData={pdfData}
                  currentPage={currentPage}
                  onSelectedPage={handleSelectedPage}
                />
              </Col>
            </Row>
          </Container>
        </Col>

        <Col style={{ overflow: "auto" }}>
          {pdfData && (
            <PDFViewer
              pdfData={pdfData}
              currentPage={currentPage}
              onSelectedPage={handleSelectedPage}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default PDFReader;
