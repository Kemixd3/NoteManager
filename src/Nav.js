import "bootstrap/dist/css/bootstrap.min.css";

import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Image from "react-bootstrap/Image";

function NavbarDisplay({ user }) {
  console.log(user, "here");
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="#home">Your Brand</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/#home">Home</Nav.Link>
            <Nav.Link href="/scan">Scan page</Nav.Link>
          </Nav>
          <Nav>
            {user ? (
              <Nav.Link style={{ color: "black" }} disabled>
                <span className="me-2">Signed in as: {user.email}</span>
                <Image
                  src={user.avatar_url}
                  alt="User Avatar"
                  roundedCircle
                  width="30"
                  height="30"
                  style={{ cursor: "pointer" }}
                />
              </Nav.Link>
            ) : (
              <Nav.Link style={{ color: "black" }} href="#login">
                Sign In
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarDisplay;
