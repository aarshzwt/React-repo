import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { useDispatch, useSelector } from 'react-redux';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { addToWishlist, removeFromWishlist, setError } from '../redux/slices/productSlice';

const ProductCard = React.memo(({ product }) => {
    const dispatch = useDispatch();
    const wishlist = useSelector((state) => state.product.wishlist);
    const isWishlisted = wishlist.includes(product.id);

    const handleWishlistToggle = async (product_id) => {
        try {
            if (isWishlisted) {
                const response = await axiosInstance.delete(`/wishlist/${product_id}`);
                dispatch(removeFromWishlist(product_id));
            } else {
                const response = await axiosInstance.post('/wishlist', { product_id });
                dispatch(addToWishlist(product_id));
            }
        } catch (error) {
            dispatch(setError('Failed to fetch categories'));
        }
    };

    return (
        <Link to={`/products/${product.id}`} className="relative group bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 no-underline">
            <div className="relative aspect-square overflow-hidden">
                <img
                    src={`http://localhost:5000${product.image_url}`}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                />
                <button
                    // onClick={() => handleWishlistToggle(product.id)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-colors duration-200"
                    aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                    {isWishlisted ? (
                        <FaHeart className="w-6 h-6 text-red-500 transition-transform duration-200 hover:scale-110" />
                    ) : (
                        <FaRegHeart className="w-6 h-6 text-gray-600 transition-transform duration-200 hover:scale-110" />
                    )}
                </button>
            </div>

            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
});

const ProductsByCategoryGrid = () => {
    const { id } = useParams(); 

    const [productsByCategory, setProductsByCategory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch products by category
    const fetchProductsByCategory = async (categoryId) => {
        try {
            const response = await axiosInstance.get(`categories/products/${categoryId}`);
            console.log('API Response:', response.data);

        if (response.data && response.data.product) {
            setProductsByCategory(response.data.product);
            console.log(productsByCategory)
        } else {
            setError('Products not found in the response.');
        }

        setLoading(false);
        } catch (error) {
            setError('Error fetching products');
            setLoading(false);
        }
    };

    // Fetch products when categoryId changes
    useEffect(() => {
        if (id) {
            fetchProductsByCategory(id);
           
        } else {
            console.error('Category ID is undefined');
            setError('Category ID is missing');
        }
    }, [id]); 

    if (loading) {
        return <p>Loading products...</p>;
    }

    if (error) {
        return <p>{error}:  No products for this category</p>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Featured Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {productsByCategory.length === 0 ? (
                    <p>No products available in this category.</p>
                ) : (
                    productsByCategory.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))
                )}
            </div>
        </div>
    );
};

export default ProductsByCategoryGrid;
