import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { useDispatch } from 'react-redux';
import axiosInstance from '../utils/axiosInstance';
import { setLoading, setUserData, setError } from '../redux/slices/authSlice';
import toast from 'react-hot-toast';
import { Navigate, useNavigate } from 'react-router-dom';
import { Formik, useFormik } from 'formik';

export default function Signup() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const validate = values => {
        const errors = {};
        if (!values.first_name) {
            errors.first_name = 'First name is required';
        }
        if (!values.last_name) {   
            errors.last_name = 'Last name is required';
        }
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
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            role: 'customer'
        },
        validate,
        onSubmit: async (values) => {
            dispatch(setLoading(true));
            try {
                const response = await axiosInstance.post('auth/register', values);
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
        },
    });

    // const [formData, setFormData] = useState({
    //     first_name: '',
    //     last_name: '',
    //     email: '',
    //     password: '',
    //     role: 'customer'
    // });

    // const [errors, setErrors] = useState({
    //     first_name: '',
    //     last_name: '',
    //     email: '',
    //     password: '',
    // });

    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData((prevState) => ({
    //         ...prevState,
    //         [name]: value
    //     }));

        // Reset error for the field that is being edited
    //     setErrors((prevState) => ({
    //         ...prevState,
    //         [name]: ''
    //     }));
    // };

    // const validateForm = () => {
    //     const newErrors = {};

    //     // Check for empty fields
    //     if (!formData.first_name) newErrors.first_name = 'First name is required';
    //     if (!formData.last_name) newErrors.last_name = 'Last name is required';
    //     if (!formData.email) newErrors.email = 'Email is required';
    //     if (!formData.password) newErrors.password = 'Password is required';

    //     setErrors(newErrors);

    //     return Object.keys(newErrors).length === 0;
    // };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     if (!validateForm()) return; 

    //     dispatch(setLoading(true));

    //     try {
    //         const response = await axiosInstance.post('auth/register', formData);
    //         console.log(response);
    //         const { data } = response;

    //         dispatch(setUserData({
    //             user: data.data,
    //             role: data.data.role,
    //         }));

    //         if (response.status === 201) {
    //             toast.success('Signed Up Successfully');
    //             navigate("/login");
    //         }

    //     } catch (error) {
    //         console.error('Error:', error);
    //         if (error.status === 400) {
    //             toast.error('Email already exists');
    //         }
    //         dispatch(setError(error.response?.data?.message || 'Signup failed.'));
    //     }
    // };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <Form onSubmit={formik.handleSubmit} className="shadow-lg p-8 rounded-lg bg-white w-[80%] max-w-md">
                <Form.Group controlId="formGridFirstName" className="mb-4">
                    <Form.Label>First Name *</Form.Label>
                    <Form.Control
                        type="text"
                        id='first_name'
                        placeholder="First Name"
                        name="first_name"
                        value={formik.values.first_name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={formik.touched.first_name && formik.errors.first_name ? 'is-invalid' : ''}
                    />
                    {formik.touched.first_name && formik.errors.first_name && <div className="text-danger">{formik.errors.first_name}</div>}
                </Form.Group>

                <Form.Group controlId="formGridLastName" className="mb-4">
                    <Form.Label>Last Name *</Form.Label>
                    <Form.Control
                        type="text"
                        id='last_name'
                        placeholder="Last Name"
                        name="last_name"
                        value={formik.values.last_name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={formik.touched.last_name && formik.errors.last_name ? 'is-invalid' : ''}
                    />
                    {formik.touched.last_name && formik.errors.last_name && <div className="text-danger">{formik.errors.last_name}</div>}
                </Form.Group>

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
                    {formik.touched.email && formik.errors.email && <div className="text-danger">{formik.errors.email}</div>}
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
                    {formik.touched.password && formik.errors.password && <div className="text-danger">{formik.errors.password}</div>}
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
