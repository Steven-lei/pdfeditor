import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
const MyNav = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" style={{ minWidth: "480px" }}>
      <Navbar.Brand className="mx-5" as={Link} to="/">
        PDF Utility - Steven
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <Nav.Link as={Link} to="/reader">
            PDF Reader
          </Nav.Link>
          <Nav.Link as={Link} to="/editor">
            PDF Editor
          </Nav.Link>
          <Nav.Link as={Link} to="/extractor">
            Extract Pages
          </Nav.Link>
          <Nav.Link as={Link} to="/merger">
            Merge PDFs
          </Nav.Link>
          <Nav.Link as={Link} to="/contact">
            Contact Me
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default MyNav;
