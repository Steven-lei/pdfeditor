import { Navbar, Nav } from "react-bootstrap";
const MyNav = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" style={{ minWidth: "480px" }}>
      <Navbar.Brand className="mx-5" href="/">
        PDF Utility - Steven
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <Nav.Link href="/reader">PDF Reader</Nav.Link>
          <Nav.Link href="/editor">PDF Editor</Nav.Link>
          <Nav.Link href="/extractor">Extract Pages</Nav.Link>
          <Nav.Link href="/merger">Merge PDFs</Nav.Link>
          <Nav.Link href="/contact">Contact Me</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default MyNav;
