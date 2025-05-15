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
import { useFormik } from 'formik';

export default function Login() {
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const validate = values => {
        const errors = {};
        if (!values.email) {
            errors.email = 'Email is required';
        }else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
            errors.email = 'Invalid email address';
          }
        if (!values.password) { 
            errors.password = 'Password is required';
        }
        return errors;
    }
    
    const formik = useFormik({
        initialValues: {    
            email: '',
            password: '',
        },
        validate,
        onSubmit: async (values) => {
            dispatch(setLoading(true));

            try {
                const response = await axiosInstance.post('auth/login', values);
                const { data } = response;
    
                dispatch(setUserData({
                    user: data.user,
                    role: data.user.role,
                    token: data.token,
                    refreshToken: data.refreshToken,
                }));
    
                if (data.token) {
                    toast.success('User logged in successfully!');
                    navigate("/"); 
                } else {
                    toast.error('Login failed: Invalid credentials or missing token.');
                }
            } catch (error) {
                toast.error('Login failed: Invalid credentials');
                dispatch(setError(error.response?.data?.message || 'Login failed.'));
            }
        },
    });

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
            <h1>Login</h1>
            <Form onSubmit={formik.handleSubmit} className="shadow-lg p-8 rounded-lg bg-white w-[80%] max-w-md">
                <Form.Group controlId="formGridEmail" className="mb-4">
                    <Form.Label>Email *</Form.Label>
                    <Form.Control
                        type="email"
                        id='email'
                        placeholder="Enter email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={formik.touched.email && formik.errors.email ? 'is-invalid' : ''}
                    />
                    {formik.touched.email && formik.errors.email && <Form.Control.Feedback type="invalid" className="text-red-500">{formik.errors.email}</Form.Control.Feedback>}
                </Form.Group>

                <Form.Group controlId="formGridPassword" className="mb-4">
                    <Form.Label>Password *</Form.Label>
                    <Form.Control
                        type="password"
                        id='password'
                        placeholder="Password"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={formik.touched.password && formik.errors.password ? 'is-invalid' : ''}
                    />
                    {formik.touched.password && formik.errors.password && <Form.Control.Feedback type="invalid" className="text-red-500">{formik.errors.password}</Form.Control.Feedback>}
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
