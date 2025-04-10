import React from "react";
import MetaData from "./MetaData";
import FileUpload from "./FileUpload";

const Header = ({ title, pages, handleFileUpload }) => {
  return <h4>{title || "Upload PDF"}</h4>;
};

export default Header;
