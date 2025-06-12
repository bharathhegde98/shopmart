// src/components/Navbar/Navbar.jsx

import { useEffect, useState } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import "./navbar.css";
import logo from "../../logo.svg";
// UPDATE: Import useLocation to read the URL
import { Link, useLocation } from "react-router-dom";
import { useCartContext } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import LoginPopup from "../Auth/LoginPopup";
import CartSidebar from "../Sidebar/CartSidebar";

const NavBar = () => {
  const { cartList } = useCartContext();
  const { user, logout } = useAuth();
  const [expand, setExpand] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  
  // UPDATE: Get the location object from react-router-dom
  const location = useLocation();

  // This useEffect handles the fixed header on scroll
  useEffect(() => {
    const scrollHandler = () => {
      setIsFixed(window.scrollY >= 100);
    };
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, []);
  
  // UPDATE: This new useEffect watches the URL for the '#login' hash
  useEffect(() => {
    // If the URL has #login at the end...
    if (location.hash === '#login') {
      // ...and if the user is not currently logged in...
      if (!user) {
        // ...then open the login popup.
        setShowLoginPopup(true);
      }
    }
  }, [location, user]); // Re-run this check whenever the URL or user's login status changes

  const handleLogout = () => {
    logout();
    setExpand(false);
  };

  const ProfileSection = () => {
    if (user) {
      return (
        <NavDropdown
          title={`Hi, ${user.firstName}`}
          id="user-profile-dropdown"
          align="end"
        >
          <NavDropdown.Item as={Link} to="/profile">
            My Profile
          </NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/orders">
            My Orders
          </NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
        </NavDropdown>
      );
    } else {
      return (
        <span
          className="cursor-pointer"
          onClick={() => setShowLoginPopup(true)}
          aria-label="Login"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="nav-icon"
            style={{ width: "24px", height: "24px", color: "#333" }}
          >
            <path
              fillRule="evenodd"
              d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      );
    }
  };

  return (
    <>
      <Navbar
        fixed="top"
        expand="md"
        className={isFixed ? "navbar fixed" : "navbar"}
      >
        <Container className="navbar-container">
          <Navbar.Brand as={Link} to="/">
            <img src={logo} alt="ShopMart" className="logo-image" />
          </Navbar.Brand>

          <div className="d-flex align-items-center">
            <div className="media-cart">
              <div className="me-3">
                <ProfileSection />
              </div>

              <span
                className="cart cursor-pointer"
                data-num={cartList.length}
                aria-label="Open Cart Sidebar"
                onClick={() => setSidebarOpen(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="nav-icon"
                  style={{ width: "24px", height: "24px", color: "#333" }}
                >
                  <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
                </svg>
              </span>
            </div>

            <Navbar.Toggle
              onClick={() => setExpand(!expand)}
              aria-controls="basic-navbar-nav"
            >
              <span></span>
              <span></span>
              <span></span>
            </Navbar.Toggle>
          </div>

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="justify-content-end flex-grow-1">
              <Nav.Item>
                <Link className="navbar-link" to="/" onClick={() => setExpand(false)}>
                  <span className="nav-link-label">Home</span>
                </Link>
              </Nav.Item>
              <Nav.Item>
                <Link className="navbar-link" to="/shop" onClick={() => setExpand(false)}>
                  <span className="nav-link-label">Shop</span>
                </Link>
              </Nav.Item>
              <Nav.Item>
                <Link className="navbar-link" to="/cart" onClick={() => setExpand(false)}>
                  <span className="nav-link-label">Cart</span>
                </Link>
              </Nav.Item>

              <Nav.Item className="expanded-cart align-items-center">
                <div className="me-3">
                  <ProfileSection />
                </div>
                
                <span
                  className="cart cursor-pointer"
                  data-num={cartList.length}
                  aria-label="Open Cart Sidebar"
                  onClick={() => setSidebarOpen(true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="nav-icon"
                    style={{ width: "24px", height: "24px", color: "#333" }}
                  >
                    <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
                  </svg>
                </span>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {!user && showLoginPopup && (
        <LoginPopup onClose={() => setShowLoginPopup(false)} />
      )}

      <CartSidebar
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
    </>
  );
};

export default NavBar;