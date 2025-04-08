import React, { useEffect, useRef, useState } from "react";
import Thumbnail from "./Thumbnail";
import { Container } from "react-bootstrap";

const Sidebar = ({ pdfData, onSelectedPage, currentPage }) => {
  const [numPages, setNumPages] = useState(0);
  const pageOffsets = useRef({});
  const [visiblePages, setVisiblePages] = useState({});
  const [renderedPages, setRenderedPages] = useState({});
  const containerRef = useRef(null);
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
    <div style={{ display: "flex" }}>
      {/* Sidebar with thumbnails */}
      <div
        style={{
          height: "68vh", // Ensuring the sidebar takes up 80% of the viewport height
          overflowY: "auto", // Enables scrolling when thumbnails exceed sidebar height
          padding: "1rem",
          marginRight: "1rem",
        }}
      >
        {Array.from({ length: numPages }, (_, index) => {
          const pageNumber = index + 1;
          return (
            <Thumbnail
              key={pageNumber}
              pageNumber={pageNumber}
              scale={0.3}
              pdfData={pdfData} // Pass pdfData here
              onClick={() => {
                onSelectedPage && onSelectedPage(pageNumber);
              }}
              selected={pageNumber === currentPage}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
