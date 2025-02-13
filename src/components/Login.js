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

    const dispatch = useDispatch();

    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        dispatch(setLoading(true));

        try {

            const response = await axiosInstance.post('auth/login', formData); 
            const { data } = response;
            console.log(data.user);
            
            dispatch(setUserData({
                user: data.user,
                role: data.user.role,
                token: data.token,
            }));
            setSuccess('User logged in successfully!');
            
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
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <Form onSubmit={handleSubmit} className="shadow-lg p-8 rounded-lg bg-white w-[80%] max-w-md">

                    {/* Email */}
                    <Form.Group controlId="formGridEmail" className="mb-4">
                        <Form.Label>Email</Form.Label>
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
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                   
                    {/* Submit Button */}
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
