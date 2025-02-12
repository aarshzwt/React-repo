import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import { useDispatch, useSelector } from 'react-redux';
import { logout, setError, setLoading } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { FaCartPlus } from 'react-icons/fa';


export function CustomNavbar() {

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  //using the redux state fetching categories so dont need to call apis again and again
  const categories = useSelector((state) => state.category.categories);
  console.log(categories);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async(e) =>{
    e.preventDefault();
    dispatch(setLoading(true));

    try {
        dispatch(logout());
        navigate("/"); 
    } catch (error) {
        console.error('Error:', error); 
        dispatch(setError(error.response?.data?.message || 'Log Out failed.'));
    }
  }
  return (
    
    <>
      <Navbar collapseOnSelect expand="lg" bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Nav.Link href="#features">Features</Nav.Link>
              <Nav.Link href="#pricing">Pricing</Nav.Link>

              {categories.length > 0 && (
                <NavDropdown title="Categories" id="collapsible-nav-dropdown">
                  {categories.map((category, index) => (
                    <NavDropdown.Item key={index} href={`#category/${category.id}`}>
                      {category.name}
                    </NavDropdown.Item>
                  ))}
                </NavDropdown>
              )}
            </Nav>

            {isAuthenticated ? (
              <Nav>
                <Nav.Link href="/cart" > <FaCartPlus className='text-gray-600 w-5 h-5 '/> Cart </Nav.Link>
                <Nav.Link href="/users/profile">Profile</Nav.Link>
                <Nav.Link href="/logout" onClick={handleLogout}>Logout</Nav.Link> 
              </Nav>
            ) : (
              <Nav>
                <Nav.Link href="/login">Login</Nav.Link>
                <Nav.Link href="/signup">SignUp</Nav.Link>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

    </>
  )
}
