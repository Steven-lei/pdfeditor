import React from "react";
import { Button } from "react-bootstrap";

const ZoomControls = ({ onZoomIn, onZoomOut }) => {
  return (
    <div className="zoom-controls">
      <Button variant="secondary" className="mx-2" onClick={onZoomIn}>
        Zoom In
      </Button>
      <Button variant="secondary" onClick={onZoomOut}>
        Zoom Out
      </Button>
    </div>
  );
};

export default ZoomControls;
