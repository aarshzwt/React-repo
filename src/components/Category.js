import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Card from 'react-bootstrap/Card';
import axiosInstance from '../utils/axiosInstance';
import { setLoading, setCategories, setError } from '../redux/slices/categorySlice';
import { useNavigate } from 'react-router-dom';

export default function Category() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { categories, loading, error } = useSelector((state) => state.category);

    // const [productsByCategory, setProductsByCategory] = useState({});
    const role = useSelector((state) => state.auth.role);

    const fetchCategories = async () => {
        try {
            dispatch(setLoading());
            const response = await axiosInstance.get('categories');
            dispatch(setCategories(response.data.categories));
        } catch (error) {
            dispatch(setError('Failed to fetch categories'));
        }
    };

    // Fetch products by category
    // const fetchProductsByCategory = async (categoryId) => {
    //     try {
    //         const response = await axiosInstance.get(`categories/products/${categoryId}`);
    //         setProductsByCategory((prevState) => ({
    //             ...prevState,
    //             [categoryId]: response.data.product,
    //         }));
    //     } catch (error) {
    //         setProductsByCategory((prevState) => ({
    //             ...prevState,
    //             [categoryId]: [], // No products found, set empty array
    //         }));
    //         console.error('Error fetching products for category:', error);
    //     }
    // };

    useEffect(() => {
        fetchCategories();
    }, [dispatch]);

    if (loading) {
        return <p>Loading categories...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div style={{ marginTop: '10px' }}>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Featured Categories</h2>
            <div className="flex items-center justify-end space-x-4">
                {role === 'admin' && (
                    <>
                        <button
                            className='bg-indigo-600 hover:bg-indigo-700 px-4 py-2 border border-transparent rounded-md shadow-sm text-medium font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center'
                            onClick={() => navigate('/category/add')}
                        >
                            Add Category
                        </button>
                    </>
                )}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', justifyContent: 'center' }}>

                {categories.length === 0 ? (
                    <p>No categories available.</p>
                ) : (
                    categories.map((category) => (

                        <Card
                            key={category.id}
                            style={{ width: '150px', position: 'relative' }} // Adjust width and position
                            onClick={() => {
                                if (category.id) {
                                    navigate(`/productsByCategory/${category.id}`);
                                } else {
                                    console.error('Category ID is undefined');
                                }
                            }}
                        >
                            <Card.Img
                                variant="top"
                                src={`http://localhost:5000${category.image_url}`}
                                alt={category.name}
                                style={{ height: '140px', objectFit: 'cover' }}
                            />
                            <Card.Body
                                style={{ cursor: 'pointer', textAlign: 'center' }}
                            >
                                <Card.Title>{category.name} </Card.Title>
                            </Card.Body>


                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
