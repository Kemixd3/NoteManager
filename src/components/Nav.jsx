import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import SignInButton from "./SignInButton";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import { useAuth } from "../Context/AuthContext";
import Image from "react-bootstrap/Image";
import { getTheme, setTheme } from "../store/ThemeColors";
import ThemeToggle from "./ThemeToggle";

function NavbarDisplay({ user, userData }) {
  const { logout } = useAuth();
  const [currentTheme] = useState(getTheme());

  useEffect(() => {
    setTheme(currentTheme);
  }, [currentTheme]);

  if (user) {
    return (
      <Navbar expand="lg" data-testid="nav">
        <Container fluid>
          <Navbar.Brand href="/">UXV Technologies Stock Receiving</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="justify-content-between">
            <Nav className="me-auto">
              <Nav.Link href="/home">Home</Nav.Link>
              <Nav.Link href="/PO">PO Overview</Nav.Link>
              <Nav.Link href="/search">Search</Nav.Link>
            </Nav>

            {user && userData && userData.image ? (
              <Nav className="align-items-center">
                <Nav.Link href="/account">
                  <span className="me-2">Signed in as: {userData.email}</span>
                  <span className="me-2">In {userData.Organization}</span>
                  <Image
                    src={userData.image}
                    alt="User Avatar"
                    roundedCircle
                    width="30"
                    height="30"
                    style={{ cursor: "pointer" }}
                  />
                </Nav.Link>
                <div className="me-5">
                  <ThemeToggle />
                </div>
                <div>
                  <button className="logout-btn ms-5" onClick={logout}>
                    Log out
                  </button>
                </div>
              </Nav>
            ) : (
              <Nav>
                <SignInButton />
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  } else {
    console.log("User not loaded");
  }
}

export default NavbarDisplay;
