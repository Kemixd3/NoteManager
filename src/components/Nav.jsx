import "bootstrap/dist/css/bootstrap.min.css";
import PropTypes from "prop-types";
import { useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Image from "react-bootstrap/Image";
import { useDarkMode } from "../Context/DarkmodeContext";

function NavbarDisplay({ user, userData }) {
  //  const postMountStoreState = store.setUserData()
  //  if (postMountStoreState !== this.state.userData) {
  //    this.setState({ storeState: postMountStoreState })
  //}
  const { darkMode, setDarkMode } = useDarkMode();

  console.log(darkMode);
  let navbarClasses = "nav"; // Default class

  if (darkMode) {
    navbarClasses += " dark-mode"; // Add dark mode class
  } else {
    navbarClasses += " light-mode"; // Add light mode class
  }
  //const userData = useSelector((state) => state.userData);

  if (user) {
    return (
      <Navbar expand="lg" className={navbarClasses} data-testid="nav">
        <Container>
          <Navbar.Brand href="#home">Your Brand</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/home">Home</Nav.Link>
              <Nav.Link href="/PO">PO oversigt</Nav.Link>
            </Nav>
            <li className="settings__darkmode">
              <button
                onClick={() => setDarkMode(!darkMode)}
                aria-label="Darkmode on/off"
                type="button"
              >
                Toggle Dark Mode
              </button>
            </li>
            <Nav>
              {user && userData && userData.userImage ? (
                <Nav.Link style={{ color: "black" }} disabled>
                  <span className="me-2">Signed in as: {user.email}</span>
                  <Image
                    src={userData.userImage}
                    alt="User Avatar"
                    roundedCircle
                    width="30"
                    height="30"
                    style={{ cursor: "pointer" }}
                  />
                </Nav.Link>
              ) : (
                // Your fallback UI when user data is not available
                <Nav.Link style={{ color: "black" }} href="#login">
                  Sign In
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  } else {
    console.log("User not loaded");
  }
}

NavbarDisplay.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  setDarkMode: PropTypes.func.isRequired,
};

export default NavbarDisplay;



