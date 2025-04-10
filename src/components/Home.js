import React from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="d-flex justify-content-center align-items-center gap-3 m-3">
      <Card className="dialog">
        <Card.Body>
          <Card.Title as="h2" className="mb-4">
            Welcome to PDF Utility
          </Card.Title>
          <Card.Text>
            Disappointed to find that many PDF tools require registration and
            charge fees. I developed this tool to allow free usage. Please share
            your suggestions to make it better via email: leizhengwen@126.com.
          </Card.Text>
          <div className="d-grid gap-3">
            <Link to="/reader">
              <Button variant="info" className="w-100">
                PDF Reader
              </Button>
            </Link>

            <Link to="/editor">
              <Button variant="primary" className="w-100">
                Edit PDF
              </Button>
            </Link>

            <Link to="/extractor">
              <Button variant="success" className="w-100">
                Extract Pages
              </Button>
            </Link>

            <Link to="/merger">
              <Button variant="warning" className="w-100">
                Merge PDFs
              </Button>
            </Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Home;
