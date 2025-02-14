import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
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

    const [errors, setErrors] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));

        // Reset error for the field that is being edited
        setErrors((prevState) => ({
            ...prevState,
            [name]: ''
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        // Check for empty fields
        if (!formData.first_name) newErrors.first_name = 'First name is required';
        if (!formData.last_name) newErrors.last_name = 'Last name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return; 

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
                navigate("/login");
            }

        } catch (error) {
            console.error('Error:', error);
            if (error.status === 400) {
                toast.error('Email already exists');
            }
            dispatch(setError(error.response?.data?.message || 'Signup failed.'));
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <Form onSubmit={handleSubmit} className="shadow-lg p-8 rounded-lg bg-white w-[80%] max-w-md">
                <Form.Group controlId="formGridFirstName" className="mb-4">
                    <Form.Label>First Name *</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="First Name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        className={errors.first_name ? 'is-invalid' : ''}
                    />
                    {errors.first_name && <div className="text-danger">{errors.first_name}</div>}
                </Form.Group>

                <Form.Group controlId="formGridLastName" className="mb-4">
                    <Form.Label>Last Name *</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Last Name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        className={errors.last_name ? 'is-invalid' : ''}
                    />
                    {errors.last_name && <div className="text-danger">{errors.last_name}</div>}
                </Form.Group>

                <Form.Group controlId="formGridEmail" className="mb-4">
                    <Form.Label>Email *</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={errors.email ? 'is-invalid' : ''}
                    />
                    {errors.email && <div className="text-danger">{errors.email}</div>}
                </Form.Group>

                <Form.Group controlId="formGridPassword" className="mb-4">
                    <Form.Label>Password *</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={errors.password ? 'is-invalid' : ''}
                    />
                    {errors.password && <div className="text-danger">{errors.password}</div>}
                </Form.Group>

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
