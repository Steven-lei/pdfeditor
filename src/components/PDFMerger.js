import React, { useEffect, useState } from "react";
import {
  Button,
  ProgressBar,
  ListGroup,
  Container,
  Row,
  Col,
} from "react-bootstrap";
//import PDFOverview from "./PDFOverview"; // Existing component for thumbnail view
import PDFReader from "./PDFReader"; // Existing component for detailed view
import { PDFDocument } from "pdf-lib";
import PDFViewer from "./PDFViewer";
import Thumbnail from "./Thumbnail";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const pdfjs = require("pdfjs-dist");
pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf/pdf.worker.mjs`;

const ItemType = "PDF";
// Load the PDF document using pdfjs
function loadPdfDocument(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const typedArray = new Uint8Array(fileReader.result);
      pdfjs.getDocument(typedArray).promise.then(resolve).catch(reject);
    };
    fileReader.readAsArrayBuffer(file);
  });
}

function DraggableItem({ pdf, index, moveItem, onRemove }) {
  const [pdfDocument, setPdfDocument] = useState(null);

  useEffect(() => {
    loadPdfDocument(pdf.file)
      .then((doc) => {
        setPdfDocument(doc); // Store the loaded document
      })
      .catch((err) => {
        console.error("Error loading PDF:", err);
      });
  }, [pdf.file]);
  const ref = React.useRef(null);

  const [, drop] = useDrop({
    accept: ItemType,
    hover(item) {
      if (!ref.current || item.index === index) return;
      moveItem(item.index, index);
      item.index = index;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { id: pdf.id, index },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  drag(drop(ref));
  return (
    <Container
      ref={ref}
      style={{ opacity: isDragging ? 0.5 : 1, cursor: "pointer" }}
      className=" border p-2 mb-2 rounded"
    >
      <Row className="align-items-center">
        <Col xs="auto">
          {pdfDocument && <Thumbnail pdfData={pdfDocument} scale={0.15} />}
        </Col>
        <Col>
          <Container>
            <Row className="mb-3">
              <Col className="text-wrap w-100">
                <strong className="me-3">{pdf.name}</strong>
              </Col>
            </Row>
            <Row>
              <Col>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => onRemove(index)}
                >
                  Remove
                </Button>
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
    </Container>
  );
}
function PDFMerger() {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [isMerging, setIsMerging] = useState(false);
  const [mergeProgress, setMergeProgress] = useState(0);
  const [mergedPdfUrl, setMergedPdfUrl] = useState(null);
  const [mergedPdfDoc, setMergedPdfDoc] = useState(null);

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    const newPdfFiles = await Promise.all(
      files.map(async (file, index) => {
        const url = URL.createObjectURL(file);
        const fileBuffer = await file.arrayBuffer();
        const document = await PDFDocument.load(fileBuffer); // Load once!
        return {
          id: `${Date.now()}-${index}`,
          name: file.name,
          file,
          url,
          document: document,
        };
      })
    );
    setPdfFiles((prevFiles) => [...prevFiles, ...newPdfFiles]);
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = [...pdfFiles];
    URL.revokeObjectURL(updatedFiles[index].url);
    updatedFiles.splice(index, 1);
    setPdfFiles(updatedFiles);
  };
  const moveItem = (fromIndex, toIndex) => {
    const updated = [...pdfFiles];
    const [movedItem] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, movedItem);
    setPdfFiles(updated);
  };

  const handleMergeFiles = async () => {
    setIsMerging(true);
    setMergeProgress(0);

    const mergedPdf = await PDFDocument.create();

    for (let i = 0; i < pdfFiles.length; i++) {
      const fileBuffer = await pdfFiles[i].file.arrayBuffer();
      const loadedPdf = await PDFDocument.load(fileBuffer);
      const copiedPages = await mergedPdf.copyPages(
        loadedPdf,
        loadedPdf.getPageIndices()
      );
      copiedPages.forEach((page) => mergedPdf.addPage(page));
      setMergeProgress(Math.round(((i + 1) / pdfFiles.length) * 100));
    }

    const mergedPdfBytes = await mergedPdf.save();
    const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    setMergedPdfUrl(url);
    // 👇 Load the pdf with pdfjs to render it in PDFViewer
    const typedArray = new Uint8Array(await blob.arrayBuffer());
    const loadedDoc = await pdfjs.getDocument({ data: typedArray }).promise;
    setMergedPdfDoc(loadedDoc);
    setIsMerging(false);
  };

  const handleDownloadMergedPdf = () => {
    if (!mergedPdfUrl) return;
    const anchor = document.createElement("a");
    anchor.href = mergedPdfUrl;
    anchor.download = "merged.pdf";
    anchor.click();
  };
  useEffect(() => {
    return () => {
      if (mergedPdfUrl) {
        URL.revokeObjectURL(mergedPdfUrl);
      }
    };
  }, [mergedPdfUrl]);
  return (
    <Container fluid>
      <Row>
        <Col xs="auto">
          <DndProvider backend={HTML5Backend}>
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
              <h2 className="mb-4">PDF Merger</h2>

              <Row className="mb-3">
                <Col>
                  <input
                    type="file"
                    accept="application/pdf"
                    multiple
                    onChange={handleFileUpload}
                    className="form-control"
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  {isMerging && (
                    <ProgressBar
                      now={mergeProgress}
                      label={`${mergeProgress}%`}
                      className="mb-3"
                    />
                  )}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col>
                  <Button
                    onClick={handleMergeFiles}
                    disabled={pdfFiles.length < 2 || isMerging}
                    variant="primary"
                  >
                    Merge PDFs
                  </Button>
                </Col>
              </Row>
              {pdfFiles.map((pdf, index) => (
                <DraggableItem
                  key={pdf.id}
                  pdf={pdf}
                  index={index}
                  moveItem={moveItem}
                  onRemove={handleRemoveFile}
                />
              ))}
            </Container>
          </DndProvider>
        </Col>
        <Col>
          <Container xs="auto">
            {mergedPdfDoc && (
              <Row className="mt-4">
                <Col>
                  <Container>
                    <Row>
                      <Col xs="auto">
                        <h5 className="mb-3">Merged PDF Preview</h5>
                      </Col>
                      <Col>
                        {mergedPdfUrl && (
                          <Button
                            as="a"
                            variant="link"
                            className="ms-3 text-decoration-underline text-success"
                            onClick={handleDownloadMergedPdf}
                          >
                            Download Merged PDF
                          </Button>
                        )}
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <PDFViewer pdfData={mergedPdfDoc} />
                      </Col>
                    </Row>
                  </Container>
                </Col>
              </Row>
            )}
          </Container>
        </Col>
      </Row>
    </Container>
  );
}

export default PDFMerger;
