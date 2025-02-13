import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { useDispatch } from 'react-redux';
import axiosInstance from '../utils/axiosInstance';
import { setLoading, setUserData, setError } from '../redux/slices/authSlice';
import toast from 'react-hot-toast';


export default function UpdateUserProfile() {

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: ''
    });

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUserProfile = async () => {
            dispatch(setLoading(true));
            try {
                const response = await axiosInstance.get('users/profile');
                const { data } = response;
                setFormData({
                    first_name: data.user.first_name,
                    last_name: data.user.last_name,
                    email: data.user.email
                });
                dispatch(setUserData({
                    user: data,
                    role: data.role,
                }));
                dispatch(setLoading(false));
            } catch (error) {
                console.error('Error fetching user profile:', error);
                dispatch(setError('Failed to fetch profile data.'));
                dispatch(setLoading(false));
            }
        };
        fetchUserProfile();
    }, [dispatch]);


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
            const response = await axiosInstance.put('users/profile', formData);
            console.log(response);
            const { data } = response;

            dispatch(setUserData({
                user: data.data,
                role: data.data.role,
            }));
            setFormData({
                first_name: "",
                email: "",
                last_name: "",
              });
            toast.success("Profile Updated Successfully")
        } catch (error) {
            console.error('Error:', error);
            // Handle errors (e.g., email already exists)
            dispatch(setError(error.response?.data?.message || 'Signup failed.'));
        }

    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <Form onSubmit={handleSubmit} className="shadow-lg p-8 rounded-lg bg-white w-[80%] max-w-md">

                <Form.Group controlId="formGridFirstName" className="mb-4">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="First Name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formGridLastName" className="mb-4">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Last Name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

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
