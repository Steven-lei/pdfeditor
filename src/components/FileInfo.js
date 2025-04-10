import React from "react";
import MetaData from "./MetaData";
function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
const FileInfo = ({ pdfInfo }) => {
  console.log(pdfInfo);
  return (
    pdfInfo && (
      <>
        <div>
          <b>Title:</b> {pdfInfo?.title}
        </div>
        <div>
          <b>Pages:</b> {pdfInfo?.pages}
        </div>
        <div>
          <b>Size:</b> {formatFileSize(pdfInfo?.size)}
        </div>
      </>
    )
  );
};

export default FileInfo;
