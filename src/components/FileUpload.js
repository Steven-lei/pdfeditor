import React from "react";

const FileUpload = ({ onFileUpload }) => (
  <div>
    <input
      type="file"
      accept="application/pdf"
      className="form-control"
      onChange={onFileUpload}
    />
  </div>
);

export default FileUpload;
