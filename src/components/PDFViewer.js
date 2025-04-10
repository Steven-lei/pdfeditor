import React, { useState, useEffect, useRef } from "react";
import { Button } from "react-bootstrap";
import Thumbnail from "./Thumbnail";
import Page from "./Page";
import ZoomControls from "./ZoomControls";
import RotateControls from "./RotateControls";

const PDFViewer = ({
  pdfData,
  initialScale = 1.5,
  maxScale = 5,
  minScale = 0.5,
  currentPage = null,
  onSelectedPage,
}) => {
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(initialScale);
  const containerRef = useRef(null);
  const pageOffsets = useRef({});
  const [visiblePages, setVisiblePages] = useState({});
  const [renderedPages, setRenderedPages] = useState({});
  const [rotation, setRotation] = useState(0); // Track rotation state

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

  const handleZoomIn = () => setScale(Math.max(scale / 1.2, minScale));
  const handleZoomOut = () => setScale(Math.min(scale * 1.2, maxScale));
  const handleAntiClockwise = () =>
    setRotation((prevRotation) => (prevRotation + 270) % 360); // Rotate -90 degrees

  const handleClockwise = () =>
    setRotation((prevRotation) => (prevRotation + 90) % 360);
  useEffect(() => {
    Object.keys(visiblePages).forEach((pageStr) => {
      const page = parseInt(pageStr);
      if (visiblePages[page] && !renderedPages[page]) {
        setRenderedPages((prev) => ({ ...prev, [page]: true }));
      }
    });
  }, [visiblePages, renderedPages]);

  return (
    <div>
      <div className="d-flex justify-content-center gap-2 m-2">
        <RotateControls
          onAntiClockwise={handleAntiClockwise}
          onClockWise={handleClockwise}
        ></RotateControls>
        <ZoomControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />
      </div>
      {/* PDF Page Container */}
      <div
        style={{
          height: "calc(100% - 70px)", // Take the remaining height after zoom controls
          overflowY: "auto", // Enable vertical scrolling
          padding: 0, // Remove padding to ensure full-width scrolling
        }}
      >
        <div ref={containerRef}>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center", // Center vertically
              width: "auto",
              position: "relative",
              gap: "10px",
            }}
          >
            {Array.from({ length: numPages }, (_, index) => {
              const pageNumber = index + 1;
              return (
                <Page
                  key={pageNumber}
                  pageNumber={pageNumber}
                  pdfData={pdfData} // Pass pdfData here
                  scale={scale}
                  rotation={rotation}
                  observer={observe}
                  pageOffsets={pageOffsets}
                  selected={currentPage === pageNumber}
                  onClick={() => {
                    onSelectedPage && onSelectedPage(pageNumber);
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
