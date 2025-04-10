import React from "react";

import { Route, Routes, BrowserRouter } from "react-router-dom";
import Home from "./components/Home";
import PDFExtractor from "./components/PDFExtractor";
import PDFReader from "./components/PDFReader";
import PDFEditor from "./components/PDFEditor";
import MyNav from "./components/MyNav";
import PDFMerger from "./components/PDFMerger";
import ContactMe from "./components/ContactMe";
import "./App.css";

const basename = process.env.REACT_APP_BASENAME || "";
console.log("Base URL:", basename);
function App() {
  return (
    <BrowserRouter basename={basename}>
      <div className="app-wrapper">
        <MyNav></MyNav>

        <div className="app-body box">
          <Routes>
            <Route path="/" element={<Home></Home>} />
            <Route path="/extractor" element={<PDFExtractor></PDFExtractor>} />
            <Route path="/merger" element={<PDFMerger></PDFMerger>} />
            <Route path="/reader" element={<PDFReader></PDFReader>} />
            <Route path="/editor" element={<PDFEditor></PDFEditor>} />
            <Route path="/contact" element={<ContactMe></ContactMe>} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
