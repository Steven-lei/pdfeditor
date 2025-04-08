import React, { useEffect, useRef } from "react";

// Page Component
const Page = ({
  pageNumber = null,
  pdfData,
  scale,
  observer,
  pageOffsets,
  rotation,
  selected,
  onClick,
}) => {
  console.log(rotation);
  const canvasRef = useRef(null);
  var pageRendering = false;
  var pageNumPending = null;
  useEffect(() => {
    const renderPage = async (num) => {
      if (!pdfData || !canvasRef.current) return; // Check if pdfData exists
      if (pageRendering) {
        pageNumPending = num;
      } else {
        pageRendering = true;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);

        try {
          const page = await pdfData.getPage(num);
          const viewport = page.getViewport({
            scale,
            rotation: (page.rotate + rotation) % 360,
          });

          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render({
            canvasContext: context,
            viewport,
          }).promise;
          pageRendering = false;
          if (pageNumPending !== null) {
            renderPage(pageNumPending);
            pageNumPending = null;
          }
        } catch (error) {
          console.error("Error rendering page:", error);
        }
      }
    };

    renderPage(pageNumber);
  }, [pageNumber, pdfData, scale, rotation]);

  return (
    <div
      ref={(node) => {
        if (node) {
          const pageOffset = node.offsetTop;
          pageOffsets.current[pageNumber] = pageOffset;
          observer(node, pageNumber);
        }
      }}
      onClick={onClick}
      style={{
        marginBottom: "10px",
        padding: "2px",
        backgroundColor: "gray",
        border: selected ? "3px solid #dfd" : "1px solid #ccc",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)", // Added subtle shadow for depth
      }}
    >
      <canvas ref={canvasRef} style={{ display: "block", margin: "0 auto" }} />
    </div>
  );
};

export default Page;
