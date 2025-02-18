import React, { useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { setProducts } from '../redux/slices/productSlice';
import axiosInstance from '../utils/axiosInstance';
import { Link, useNavigate } from 'react-router-dom';
import { setWishlistItems, setLoading, setError, addToWishlist, removeFromWishlist } from '../redux/slices/wishlistSlice';

// ProductCard component to render each product
const ProductCard = React.memo(({ product, role }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { wishlistItems } = useSelector((state) => state.wishlist)
    console.log("wishlistItems", wishlistItems)
    // const user = useSelector((state) => state.auth.user)

    // const user_id = user?.id
    // const isProductInWishlist = true
    const isProductInWishlist = product && wishlistItems && wishlistItems.some((item) => item.product && item.product.id === product.id);
    // const isProductInWishlist = wishlistItems.forEach(item => {
    //     console.log("item.product", item.product)
    //     console.log("product.id", product.id)
    //     if(item.product.id === product.id){
    //         return true;
    //     }
    // });
    console.log("isProductInWishlist", isProductInWishlist)

    const handleWishlistToggle = async (product_id) => {
        try {
            if (isProductInWishlist) {
                await axiosInstance.delete(`/wishlist/${product_id}`);
                dispatch(removeFromWishlist({ product_id }));

            } else {

                const wishlistResponse = await axiosInstance.post('/wishlist', { product_id });
                console.log("wishlistResponse", wishlistResponse)
                dispatch(addToWishlist(wishlistResponse.data.wishlistItem));

            }

        } catch (error) {
            dispatch(setError('Failed to fetch categories'));
            console.error(error);

        }
    };

    return (
        <div className="relative group bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 no-underline">
            <div className="relative aspect-square overflow-hidden">
                <img
                    src={`http://localhost:5000${product.image_url}`}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    onClick={() => navigate(`/products/${product.id}`)}
                />
                {role === "customer" && (
                    <>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleWishlistToggle(product.id);
                            }}
                            className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-colors duration-200"
                            aria-label={isProductInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                        >
                            {isProductInWishlist ? (
                                <FaHeart className="w-6 h-6 text-red-500 transition-transform duration-200 hover:scale-110" />
                            ) : (
                                <FaRegHeart className="w-6 h-6 text-gray-600 transition-transform duration-200 hover:scale-110" />
                            )}
                        </button>
                    </>
                )}
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
        </div>
    );
});

// ProductGrid component to render all products
const ProductGrid = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { products, loading, error } = useSelector((state) => state.product);
    const role = useSelector((state) => state.auth.role);

    const fetchProducts = async () => {
        dispatch(setLoading());
        try {
            const response = await axiosInstance.get('products');
            dispatch(setProducts(response.data.products));
            const wishlistResponse = await axiosInstance.get('wishlist');
            dispatch(setWishlistItems(wishlistResponse.data.wishlistItems));
        } catch (error) {
            if (error.response && error.response.status === 404) {
                dispatch(setWishlistItems([]));

            }
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [dispatch]);

    if (loading) {
        return <p>Loading products...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between px-4 py-2">
                <h2 className="text-3xl font-bold text-gray-800 mb-8">Featured Products</h2>
                <div className="flex items-center justify-end space-x-4">
                    {role === 'admin' && (
                        <>
                            <button
                                className='bg-indigo-600 hover:bg-indigo-700 px-4 py-2 border border-transparent rounded-md shadow-sm text-medium font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center'
                                onClick={() => navigate('/product/add')}
                            >
                                Add Product
                            </button>
                            <button
                                className='bg-indigo-600 hover:bg-indigo-700 px-4 py-2 border border-transparent rounded-md shadow-sm text-medium font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center'
                                onClick={() => navigate('/admin/product')}                    >
                                Update Product
                            </button>
                        </>
                    )}
                </div>

            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} role={role}/>
                ))}
            </div>
        </div>
    );
};

export default ProductGrid;
