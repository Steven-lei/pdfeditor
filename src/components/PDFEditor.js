import React, { useEffect, useState } from "react";

const PDFEditor = () => {
  const [pdfInfo, setPdfInfo] = useState(null);
  return (
    <div>
      {/* Header with PDF Info */}
      <h4>{pdfInfo ? `PDF Editor: ${pdfInfo.title}` : "PDF Editor"}</h4>
      Sorry, this functionality is still under construction ...
    </div>
  );
};

export default PDFEditor;
