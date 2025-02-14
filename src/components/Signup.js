import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useDispatch } from 'react-redux';
import axiosInstance from '../utils/axiosInstance';
import { setLoading, setUserData, setError } from '../redux/slices/authSlice';
import toast from 'react-hot-toast';
import { Navigate, useNavigate } from 'react-router-dom';

export default function Signup() {

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        role: 'customer'
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        dispatch(setLoading(true));

        try {

            const response = await axiosInstance.post('auth/register', formData);
            console.log(response);
            const { data } = response;

            dispatch(setUserData({
                user: data.data,
                role: data.data.role,
            }));
            if (response.status === 201) {
                toast.success('Signed Up Successfully');
                navigate("/login")
              }
        } catch (error) {
            console.error('Error:', error);
            // Handle errors (e.g., email already exists)
            dispatch(setError(error.response?.data?.message || 'Signup failed.'));
        }

    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <Form onSubmit={handleSubmit} className="shadow-lg p-8 rounded-lg bg-white w-[80%] max-w-md">
                {/* First Name */}
                <Form.Group controlId="formGridFirstName" className="mb-4">
                    <Form.Label>First Name *</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="First Name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                {/* Last Name */}
                <Form.Group controlId="formGridLastName" className="mb-4">
                    <Form.Label>Last Name *</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Last Name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                {/* Email */}
                <Form.Group controlId="formGridEmail" className="mb-4">
                    <Form.Label>Email *</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                {/* Password */}
                <Form.Group controlId="formGridPassword" className="mb-4">
                    <Form.Label>Password *</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                {/* Role Selection */}
                {/* <Form.Group controlId="formGridRole" className="mb-4">
                    <Form.Label className="text-center d-block">Role</Form.Label>
                    <div className="flex justify-center gap-4">
                        <Form.Check
                            type="radio"
                            label="Customer"
                            name="role"
                            value="customer"
                            checked={formData.role === 'customer'}
                            onChange={handleChange}
                        />
                        <Form.Check
                            type="radio"
                            label="Admin"
                            name="role"
                            value="admin"
                            checked={formData.role === 'admin'}
                            onChange={handleChange}
                        />
                    </div>
                </Form.Group> */}

                {/* Submit Button */}
                <Form.Group className="flex justify-center">
                    <Col xs="auto">
                        <Button variant="primary" type="submit" block>
                            Submit
                        </Button>
                    </Col>
                </Form.Group>
            </Form>
        </div>
    );
}
