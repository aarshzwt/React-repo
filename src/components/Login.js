import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useDispatch } from 'react-redux';
import axiosInstance from '../utils/axiosInstance';
import { setLoading, setUserData, setError } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        // Clear errors on change
        setErrors((prevState) => ({
            ...prevState,
            [name]: '',
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        let formIsValid = true;
        let newErrors = { email: '', password: '' };

        if (!formData.email) {
            formIsValid = false;
            newErrors.email = 'Email is required.';
        }

        if (!formData.password) {
            formIsValid = false;
            newErrors.password = 'Password is required.';
        }

        if (!formIsValid) {
            setErrors(newErrors);
            return;
        }

        dispatch(setLoading(true));

        try {
            const response = await axiosInstance.post('auth/login', formData);
            const { data } = response;

            dispatch(setUserData({
                user: data.user,
                role: data.user.role,
                token: data.token,
            }));

            if (data.token) {
                toast.success('User logged in successfully!');
                navigate("/"); 
            } else {
                toast.error('Login failed: Invalid credentials or missing token.');
            }
        } catch (error) {
            toast.error('Login failed: Invalid credentials or missing token.');
            dispatch(setError(error.response?.data?.message || 'Login failed.'));
        }
    };

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
            <h1>Login</h1>
            <Form onSubmit={handleSubmit} className="shadow-lg p-8 rounded-lg bg-white w-[80%] max-w-md">
                <Form.Group controlId="formGridEmail" className="mb-4">
                    <Form.Label>Email *</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        isInvalid={!!errors.email} 
                    />
                    {errors.email && <Form.Control.Feedback type="invalid" className="text-red-500">{errors.email}</Form.Control.Feedback>}
                </Form.Group>

                <Form.Group controlId="formGridPassword" className="mb-4">
                    <Form.Label>Password *</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        isInvalid={!!errors.password}
                    />
                    {errors.password && <Form.Control.Feedback type="invalid" className="text-red-500">{errors.password}</Form.Control.Feedback>}
                </Form.Group>

                <Form.Group className="flex justify-center">
                    <Col xs="auto">
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Col>
                </Form.Group>
            </Form>
        </div>
    );
}
