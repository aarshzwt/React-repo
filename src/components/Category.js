import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Card from 'react-bootstrap/Card';
import axiosInstance from '../utils/axiosInstance';
import { setLoading, setCategories, setError } from '../redux/slices/categorySlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

export default function Category() {
    const dispatch = useDispatch();
    const { categories, loading, error } = useSelector((state) => state.category);

    const [productsByCategory, setProductsByCategory] = useState({});
    const [isDropdownOpen, setIsDropdownOpen] = useState(null);

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
    const fetchProductsByCategory = async (categoryId) => {
        try {
            const response = await axiosInstance.get(`categories/products/${categoryId}`);

            setProductsByCategory((prevState) => ({
                ...prevState,
                [categoryId]: response.data.product,
            }));

        } catch (error) {
            setProductsByCategory((prevState) => ({
                ...prevState,
                [categoryId]: [], // No products found, set empty array
            }));
            console.error('Error fetching products for category:', error);
        }
    };

    const toggleDropdown = (categoryId) => {
        if (isDropdownOpen === categoryId) {
            setIsDropdownOpen(null); // Close the dropdown if it's already open
        } else {
            setIsDropdownOpen(categoryId);
            fetchProductsByCategory(categoryId); // Fetch products when the dropdown is opened
        }
    };
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
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', justifyContent: 'center', marginTop: '10px' }}>
            {categories.length === 0 ? (
                <p>No categories available.</p>
            ) : (
                categories.map((category, index) => (
                    <Card
                        key={index}
                        style={{ width: '150px', position: 'relative' }} // Adjust width and position
                    >
                        <Card.Img
                            variant="top"
                            src={`http://localhost:5000${category.image_url}`}
                            alt={category.name}
                            style={{ height: '140px', objectFit: 'cover' }}
                        />
                        <Card.Body
                            onClick={() => toggleDropdown(category.id)}
                            style={{ cursor: 'pointer', textAlign: 'center' }}
                        >
                            <Card.Title>{category.name} <FontAwesomeIcon icon={faCaretDown} /></Card.Title>

                        </Card.Body>

                        {/* Dropdown for products */}
                        {isDropdownOpen === category.id && productsByCategory[category.id] && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '100%', // Position dropdown below the category image
                                    left: '0',
                                    width: '100%',
                                    maxHeight: '200px', // Maximum height for the dropdown
                                    overflowY: 'auto', // Scroll if content overflows
                                    backgroundColor: '#fff',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Shadow for dropdown
                                    padding: '10px',
                                    borderRadius: '5px',
                                    zIndex: '1000', // Ensure dropdown is above other content
                                }}
                            >
                                <h5>Products:</h5>
                                <ul>
                                    {productsByCategory[category.id] && productsByCategory[category.id].length === 0 ? (
                                        <li>No products available.</li>
                                    ) : (
                                        productsByCategory[category.id]?.map((product, idx) => (
                                            <li key={idx}>{product.name}</li>
                                        ))
                                    )}
                                </ul>
                            </div>
                        )}
                    </Card>
                ))
            )}
        </div>
    );
}
