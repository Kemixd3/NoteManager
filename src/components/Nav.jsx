import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import { useAuth } from "../Context/AuthContext";
import Image from "react-bootstrap/Image";
import { themes, getTheme, setTheme } from "../ThemeColors";

function NavbarDisplay({ user, userData }) {
  const { logout } = useAuth();
  const [currentTheme, setCurrentTheme] = useState(getTheme());
  useEffect(() => {
    setTheme(currentTheme);
  }, [currentTheme]);

  const handleThemeChange = (event) => {
    setCurrentTheme(event.target.value);
  };

  if (user) {
    return (
      <Navbar expand="lg" data-testid="nav">
        <Container>
          <Navbar.Brand href="https://www.uxvtechnologies.com">
            UXV Technologies
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="collapse">
            <Nav className="me-auto">
              <Nav.Link href="/home">Home</Nav.Link>
              <Nav.Link href="/PO">PO Overview</Nav.Link>
              <Nav.Link href="/search">Search</Nav.Link>

            </Nav>

            <Nav>
              {user && userData && userData.userImage ? (
                <Nav>
                  <div>
                    {" "}
                    <select onChange={handleThemeChange} value={currentTheme}>
                      {themes.map((theme, i) => (
                        <option key={i} value={theme}>
                          {theme}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Nav.Link style={{ color: "black" }} href="/account">
                    <span className="me-2">
                      Signed in as: {userData.userEmail}
                    </span>
                    <span className="me-5">In {userData.userOrg} </span>
                    <Image
                      src={userData.userImage}
                      alt="User Avatar"
                      roundedCircle
                      width="30"
                      height="30"
                      style={{ cursor: "pointer" }}
                    />
                  </Nav.Link>
                  <button onClick={logout}>Log out</button>
                </Nav>
              ) : (
                //Your fallback UI when user data is gone
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

export default NavbarDisplay;
