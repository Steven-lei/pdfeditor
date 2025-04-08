import React from "react";

const FileUpload = ({ onFileUpload }) => (
  <div className="mt-3">
    <input type="file" accept="application/pdf" onChange={onFileUpload} />
  </div>
);

export default FileUpload;
