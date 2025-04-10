import React from "react";
import { Button } from "react-bootstrap";

const ZoomControls = ({ onZoomIn, onZoomOut }) => {
  return (
    <>
      <Button variant="secondary" className="mx-2" onClick={onZoomIn}>
        Zoom In
      </Button>
      <Button variant="secondary" onClick={onZoomOut}>
        Zoom Out
      </Button>
    </>
  );
};

export default ZoomControls;
