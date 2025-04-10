import React, { useEffect, useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { PDFDocument } from "pdf-lib";
import PDFViewer from "./PDFViewer";
import Thumbnail from "./Thumbnail";
import MainLayout from "./MainLayout";

const pdfjs = require("pdfjs-dist");
pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf/pdf.worker.mjs`;

const Sidebar = ({ pdfData, onClickPage, selectedPages }) => {
  const [numPages, setNumPages] = useState(0);
  const pageOffsets = useRef({});
  const [visiblePages, setVisiblePages] = useState({});
  const [renderedPages, setRenderedPages] = useState({});
  const containerRef = useRef(null);
  console.log(selectedPages);
  useEffect(() => {
    if (pdfData) {
      setNumPages(pdfData.numPages);
    }
  }, [pdfData]);

  const observer = useRef(null);

  const observe = (node, pageNumber) => {
    if (!node) return;
    if (!observer.current) {
      observer.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const page = parseInt(entry.target.dataset.page);
            setVisiblePages((prev) => ({
              ...prev,
              [page]: entry.isIntersecting,
            }));
          });
        },
        { root: containerRef.current, threshold: 0.1 }
      );
    }
    observer.current.observe(node);
  };

  useEffect(() => {
    Object.keys(visiblePages).forEach((pageStr) => {
      const page = parseInt(pageStr);
      if (visiblePages[page] && !renderedPages[page]) {
        setRenderedPages((prev) => ({ ...prev, [page]: true }));
      }
    });
  }, [visiblePages, renderedPages]);
  return (
    numPages > 0 && (
      <div className="d-flex flex-column box rounded p-3">
        {/* Sidebar with thumbnails */}
        {Array.from({ length: numPages }, (_, index) => {
          const pageNumber = index + 1;
          return (
            <Thumbnail
              key={pageNumber}
              pageNumber={pageNumber}
              scale={0.3}
              pdfData={pdfData} // Pass pdfData here
              onClick={() => {
                onClickPage && onClickPage(pageNumber);
              }}
              selected={selectedPages && selectedPages.includes(pageNumber)}
              border="3px solid #ccc"
              selectedborder="3px solid #faa"
            />
          );
        })}
      </div>
    )
  );
};

const PDFExtractor = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [selectedPages, setSelectedPages] = useState([]);
  const [extractedUrl, setExtractedUrl] = useState(null);
  const [extractedPdfDoc, setExtractedPdfDoc] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPdfFile({ file, url });

    const loadingPdf = await pdfjs.getDocument(url).promise;
    setPdfDoc(loadingPdf);
    setNumPages(loadingPdf.numPages);
    setSelectedPages([]);
    setExtractedUrl(null);
  };

  const togglePageSelection = (pageNumber) => {
    setSelectedPages((prev) =>
      prev.includes(pageNumber)
        ? prev.filter((p) => p !== pageNumber)
        : [...prev, pageNumber]
    );
  };

  const handleExtract = async () => {
    if (!pdfFile || selectedPages.length === 0) return;

    const buffer = await pdfFile.file.arrayBuffer();
    const originalPdf = await PDFDocument.load(buffer);
    const newPdf = await PDFDocument.create();

    const pagesToExtract = selectedPages
      .sort((a, b) => a - b)
      .map((p) => p - 1); // 0-indexed

    const copiedPages = await newPdf.copyPages(originalPdf, pagesToExtract);
    copiedPages.forEach((page) => newPdf.addPage(page));

    const newBytes = await newPdf.save();
    const blob = new Blob([newBytes], { type: "application/pdf" });
    const newUrl = URL.createObjectURL(blob);

    setExtractedUrl(newUrl);
    // 👇 Load the pdf with pdfjs to render it in PDFViewer
    const typedArray = new Uint8Array(await blob.arrayBuffer());
    const loadedDoc = await pdfjs.getDocument({ data: typedArray }).promise;
    setExtractedPdfDoc(loadedDoc);
  };

  const handleDownload = () => {
    if (!extractedUrl) return;
    const a = document.createElement("a");
    a.href = extractedUrl;
    a.download = "extracted.pdf";
    a.click();
  };
  useEffect(() => {
    return () => {
      if (extractedUrl) {
        URL.revokeObjectURL(extractedUrl);
      }
    };
  }, [extractedUrl]);
  return (
    <MainLayout
      operater={
        <div className="d-flex flex-column box p-2 gap-2 ">
          <Form.Group controlId="formFile">
            <Form.Label>Select a PDF file</Form.Label>
            <Form.Control
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
            />
          </Form.Group>
          {numPages > 0 && (
            <Button
              variant="primary"
              onClick={handleExtract}
              disabled={selectedPages.length === 0}
            >
              Extract Now
            </Button>
          )}
          <Sidebar
            pdfData={pdfDoc}
            selectedPages={selectedPages}
            onClickPage={togglePageSelection}
          />
        </div>
      }
      viewer={
        <>
          {extractedUrl && (
            <div className="d-flex flex-column p-2 box rounded-2">
              <h5>Merged PDF Preview</h5>

              {extractedUrl && (
                <Button
                  as="a"
                  variant="link"
                  className="ms-3 text-decoration-underline text-success"
                  onClick={handleDownload}
                >
                  Download Extracted PDF
                </Button>
              )}

              <PDFViewer pdfData={extractedPdfDoc} />
            </div>
          )}
        </>
      }
      title={<h4>PDF Extractor</h4>}
    ></MainLayout>
  );
};

export default PDFExtractor;
