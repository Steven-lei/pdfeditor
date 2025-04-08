import React from "react";
import MetaData from "./MetaData";
import FileUpload from "./FileUpload";

const Header = ({ title, pages, handleFileUpload }) => {
  return (
    <div className="row p-2">
      <div className="col">
        <h4>{title || "Upload PDF"}</h4>
      </div>
      <div className="col">
        <FileUpload onFileUpload={handleFileUpload} />
      </div>
    </div>
  );
};

export default Header;
