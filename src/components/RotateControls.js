import React from "react";
import { Button } from "react-bootstrap";

const RotateControls = ({ onAntiClockwise, onClockWise }) => {
  return (
    <div className="zoom-controls">
      <Button variant="secondary" className="mx-2" onClick={onAntiClockwise}>
        Turn Left
      </Button>
      <Button variant="secondary" onClick={onClockWise}>
        Turn Right
      </Button>
    </div>
  );
};

export default RotateControls;
