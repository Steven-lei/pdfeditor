import React, { useState } from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import Header from "./Header";
import Sidebar from "./Sidebar";
import PDFViewer from "./PDFViewer";
import MainLayout from "./MainLayout";
import FileUpload from "./FileUpload";
import FileInfo from "./FileInfo";
import { Form } from "react-bootstrap";

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
        size: file.size,
      });
      const docMetadata = await pdf.getMetadata();
      setMetadata(docMetadata.metadata);
    }
  };
  const handleSelectedPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <MainLayout
      operater={
        <>
          <div className="d-grid box p-2 gap-2">
            <Form.Group controlId="formFile">
              <Form.Label>Select a PDF file</Form.Label>
              <Form.Control
                type="file"
                accept="application/pdf"
                onChange={handleFileUpload}
              />
            </Form.Group>
            <FileInfo pdfInfo={pdfInfo}></FileInfo>
            <Sidebar
              pdfData={pdfData}
              currentPage={currentPage}
              onSelectedPage={handleSelectedPage}
            />
          </div>
        </>
      }
      viewer={
        <div>
          {pdfData && (
            <PDFViewer
              pdfData={pdfData}
              currentPage={currentPage}
              onSelectedPage={handleSelectedPage}
            />
          )}
        </div>
      }
      title={
        <Header
          title={pdfInfo ? `PDF Reader: ${pdfInfo.title}` : "PDF Reader"}
          pages={pdfInfo?.pages}
          handleFileUpload={handleFileUpload}
        />
      }
    ></MainLayout>
  );
}

export default PDFReader;
