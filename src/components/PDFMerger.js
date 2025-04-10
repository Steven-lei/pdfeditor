import React, { useEffect, useState } from "react";
import { Button, ProgressBar } from "react-bootstrap";
import { PDFDocument } from "pdf-lib";
import PDFViewer from "./PDFViewer";
import Thumbnail from "./Thumbnail";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import MainLayout from "./MainLayout";
import FileInfo from "./FileInfo";

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
        console.log("doc", doc);
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
    <div
      ref={ref}
      style={{ opacity: isDragging ? 0.5 : 1, cursor: "pointer" }}
      className="container border p-2 gap-3 rounded overflow-hidden w-100"
    >
      <div className="row">
        <div className="col">
          {pdfDocument && <Thumbnail pdfData={pdfDocument} scale={0.15} />}
        </div>

        <div className="d-flex flex-column gap-1 text-wrap">
          <FileInfo
            pdfInfo={{
              title: pdf?.name,
              pages: pdfDocument?.numPages,
              size: pdf?.file?.size,
            }}
          ></FileInfo>
          <strong className="me-3">{pdf.name}</strong>

          <Button
            className="w-100"
            variant="outline-danger"
            size="sm"
            onClick={() => onRemove(index)}
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
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
    <MainLayout
      operater={
        <>
          <DndProvider backend={HTML5Backend}>
            <div className="d-flex flex-column box p-2 gap-2 ">
              <input
                type="file"
                accept="application/pdf"
                multiple
                onChange={handleFileUpload}
                className="form-control"
              />
              {isMerging && (
                <ProgressBar
                  now={mergeProgress}
                  label={`${mergeProgress}%`}
                  className="mb-3"
                />
              )}
              {pdfFiles.length >= 2 ? (
                <Button
                  onClick={handleMergeFiles}
                  disabled={pdfFiles.length < 2 || isMerging}
                  variant="primary"
                >
                  Merge PDFs
                </Button>
              ) : (
                <b>Select two or more pdf files to merge</b>
              )}
              {pdfFiles.map((pdf, index) => (
                <DraggableItem
                  key={pdf.id}
                  pdf={pdf}
                  index={index}
                  moveItem={moveItem}
                  onRemove={handleRemoveFile}
                />
              ))}
            </div>
          </DndProvider>
        </>
      }
      viewer={
        <>
          {mergedPdfDoc && (
            <div className="d-flex flex-column p-2 box rounded-2">
              <h5>Merged PDF Preview</h5>

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

              <PDFViewer pdfData={mergedPdfDoc} />
            </div>
          )}
        </>
      }
      title={<h4>PDF Merger</h4>}
    ></MainLayout>
  );
}

export default PDFMerger;
