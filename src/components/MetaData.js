import React from "react";
const MetaData = ({ metadata }) => {
  if (metadata) {
    console.log(metadata);
    const metadataMap = metadata.getAll();
    const metadataEntries = Object.entries(metadataMap);
    console.log(metadataEntries);
    return (
      <div className="metadata-card">
        <div className="card">
          <div className="card-header">
            <h5>PDF Metadata</h5>
          </div>
          <div className="card-body">
            <ul className="list-group list-group-flush">
              {metadataEntries.map(([key, value], index) => (
                <li className="list-group-item" key={index}>
                  <strong>{key}:</strong>{" "}
                  {Array.isArray(value) ? value.join(", ") : value}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
};
export default MetaData;
