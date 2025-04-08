import React, { useEffect, useRef } from "react";

// Thumbnail Component
const Thumbnail = ({
  pageNumber = 1,
  scale = 0.3,
  onClick = null,
  pdfData,
  selected = false,
  border = "1px solid #ccc",
  selectedborder = "3px solid #dfd",
  showPageNumber = false,
}) => {
  const canvasRef = useRef(null);
  var pageRendering = false;
  var pageNumPending = null;
  useEffect(() => {
    const renderThumbnail = async (num) => {
      if (!pdfData || !canvasRef.current || !num) return; // Check if pdfData exists
      if (pageRendering) {
        pageNumPending = num;
      } else {
        pageRendering = true;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        try {
          const page = await pdfData.getPage(num);
          const viewport = page.getViewport({ scale });
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          // Render the page onto the canvas
          await page.render({
            canvasContext: context,
            viewport,
          }).promise;
          pageRendering = false;
          if (pageNumPending !== null) {
            renderThumbnail(pageNumPending);
            pageNumPending = null;
          }
        } catch (error) {
          console.error(`Error rendering page ${pageNumber}:`, error);
        }
      }
    };

    renderThumbnail(pageNumber);
  }, [pageNumber, scale, pdfData]);

  return (
    <div
      onClick={onClick}
      style={{
        marginBottom: "10px",
        textAlign: "center",
        position: "relative",
        padding: "1px",
        border: selected ? selectedborder : border,
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)", // Added subtle shadow for depth
      }}
    >
      <canvas ref={canvasRef} style={{ display: "block", margin: "0 auto" }} />
      {showPageNumber && (
        <div
          style={{
            position: "absolute",
            bottom: "5px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "gray",
            padding: "0px 2px",
          }}
        >
          {pageNumber}
        </div>
      )}
    </div>
  );
};

export default Thumbnail;
