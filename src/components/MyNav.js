import { useState } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../logo192.webp"; // Import the logo file

const MyNav = () => {
  const [expanded, setExpanded] = useState(false);
  const handleNavClick = () => {
    setExpanded(false); // Collapse navbar after clicking a link
  };
  return (
    <Navbar
      variant="dark"
      expand="md"
      style={{ minWidth: "320px" }}
      expanded={expanded}
      fixed="top"
      onToggle={() => setExpanded(!expanded)}
      className="custom-navbar"
    >
      <Navbar.Brand className="mx-5" as={Link} to="/">
        <img
          className="me-2"
          src={logo} // Use the imported logo file
          alt="Logo"
          style={{ height: "26px" }} // Customize the logo size and margin
        />
        PDF Utility - Steven
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" onClick={handleNavClick}>
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
