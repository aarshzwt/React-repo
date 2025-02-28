import React, { useState } from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import { useDispatch, useSelector } from 'react-redux';
import { logout, setError, setLoading } from '../redux/slices/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { FaCartPlus } from 'react-icons/fa';
import {jwtDecode} from 'jwt-decode';

function CustomNavbar() {

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const role = useSelector((state) => state.auth.role);
  // const [role, setRole] = useState(null);
  // const token = localStorage.getItem("token");
  // if (token) {
  //   console.log("token in nav", token)
  //   const decodedToken = jwtDecode(token);
  //   setRole(decodedToken.role);
  //   console.log("role in nav", role);
  // }
  console.log("isAuthenticated", isAuthenticated)
  console.log("role", role)

  //using the redux state fetching categories so dont need to call apis again and again
  const categories = useSelector((state) => state.category.categories);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async (e) => {
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
          <Navbar.Brand href="/">E-Commerce Project</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />

              {categories.length > 0 && (
                <NavDropdown title="Categories" id="collapsible-nav-dropdown">
                  {categories.map((category, index) => (
                    <NavDropdown.Item key={index} href={`/productsByCategory/${category.id}`}>
                      {category.name}
                    </NavDropdown.Item>
                  ))}
                </NavDropdown>
              )}
            </Nav>

            {isAuthenticated ? (
              <Nav className='flex justify-between gap-4'>
                {role === 'customer' && (
                  <Link to="/cart" className='no-underline text-gray-400'>
                    <FaCartPlus className='text-gray-600 w-5 h-5 ' /> Cart
                  </Link>
                )}
                {role === 'customer' && (
                  <Link to="/orders" className='no-underline text-gray-400'>
                    Orders
                  </Link>
                )}
                {role === 'admin' && (
                  <Link to="/users" className='no-underline text-gray-400'>
                    Users List
                  </Link>
                )}
                {role === 'admin' && (
                  <Link to="/product/add" className='no-underline text-gray-400'>
                    Add Product
                  </Link>
                )}
                {role === 'admin' && (
                  <Link to="/admin/product" className='no-underline text-gray-400'>
                    Update Product
                  </Link>
                )}
                {role === 'admin' && (
                  <Link to="/orders/update" className='no-underline text-gray-400'>
                    Update Order
                  </Link>
                )}
                <Link to="/users/profile" className='no-underline text-gray-400'>Profile</Link>
                <Link to="/logout" className='no-underline text-gray-400' onClick={handleLogout}>Logout</Link>
              </Nav>
            ) : (
              <Nav>
                <Link to="/login" className='no-underline text-gray-400'>Login</Link>
                <Link to="/signup" className='no-underline text-gray-400'>SignUp</Link>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

    </>
  )
}

export default CustomNavbar;
