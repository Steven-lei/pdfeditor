import React from "react";

const MainLayout = ({ operater, viewer, title }) => {
  return (
    <div className="main-window">
      <div>{title}</div>
      <div className="main-window-content">
        <div className="operator-window">{operater}</div>
        <div className="viewer-window">{viewer}</div>
      </div>
    </div>
  );
};

export default MainLayout;
