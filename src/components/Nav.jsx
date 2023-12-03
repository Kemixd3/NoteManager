import "bootstrap/dist/css/bootstrap.min.css";
import PropTypes from "prop-types";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Image from "react-bootstrap/Image";

function NavbarDisplay({ user, userData }) {
  //  const postMountStoreState = store.setUserData()
  //  if (postMountStoreState !== this.state.userData) {
  //    this.setState({ storeState: postMountStoreState })
  //}
  console.log(userData, "NAVBAR1");
  console.log(user, "NAVBAR2");

  //const userData = useSelector((state) => state.userData);

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
              <Nav.Link href="/PO">PO oversigt</Nav.Link>
            </Nav>

            <Nav>
              {user && userData && userData.userImage ? (
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

//NavbarDisplay.propTypes = {
//  darkMode: PropTypes.bool.isRequired,
//  setDarkMode: PropTypes.func.isRequired,
//};

export default NavbarDisplay;
