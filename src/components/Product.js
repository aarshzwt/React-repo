import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { FaAngleLeft, FaAngleRight, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
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
    // const user = useSelector((state) => state.auth.user)

    // const user_id = user?.id
    // const isProductInWishlist = true
    const isProductInWishlist = product && wishlistItems && wishlistItems.some((item) => item.product && item.product.id === product.id);
    const handleWishlistToggle = async (product_id) => {
        try {
            if (isProductInWishlist) {
                await axiosInstance.delete(`/wishlist/${product_id}`);
                dispatch(removeFromWishlist({ product_id }));

            } else {
                const wishlistResponse = await axiosInstance.post('/wishlist', { product_id });
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
            <div className='uppercase tracking-wide text-sm text-indigo-500 font-semibold'>{product.brand}</div>
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
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const [totalPages, setTotalPages] = useState(0);
    const [filters, setFilters] = useState({
        name: '',
        maxPrice: '',
        stock: '',
        order: 'ASC', // default order
        col: 'createdAt', // default column for sorting
    });

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    const handleSortChange = (e) => {
        setFilters({
            ...filters,
            order: e.target.value,
        });
    };

    const handleColumnChange = (e) => {
        setFilters({
            ...filters,
            col: e.target.value,
        });
    };

    const fetchProducts = async (page = 1) => {
        dispatch(setLoading());
        try {
            const response = await axiosInstance.get('products', {
                params: {
                    page: page,
                    limit: 5,
                    name: filters.name,
                    maxPrice: filters.maxPrice,
                    stock: filters.stock,
                    order: filters.order,
                    col: filters.col,
                },
            });
            dispatch(setProducts(response.data.products));
            setTotalPages(response.data.pagination.totalPages);

            if (isAuthenticated && role === 'customer') {
                try {
                    const wishlistResponse = await axiosInstance.get('wishlist');
                    dispatch(setWishlistItems(wishlistResponse.data.wishlistItems));
                } catch (error) {
                    if (error.response && error.response.status === 404) {
                        dispatch(setWishlistItems([]));
                    }
                }
            }
            // try {
            //     const cartResponse = await axiosInstance.get('cart');
            //     dispatch(setCartItems(cartResponse?.data?.cartItems));
            // } catch (error) {
            //     if (error.response && error.response.status === 404) {
            //         dispatch(setCartItems([]));
            //     } else {
            //         console.log("error in fetching cart", error);
            //     }
            // }
        } catch (error) {
            console.log(error)
        }
    };


    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchProducts(currentPage);
    }, [currentPage, filters]);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const renderPageNumbers = () => {
        console.log("totalpages in renderPageNumbers()", totalPages)
        const pageNumbers = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-3 py-2 mx-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentPage === i
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                    aria-label={`Page ${i}`}
                    aria-current={currentPage === i ? 'page' : undefined}
                >
                    {i}
                </button>
            );
        }

        return pageNumbers;
    };

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
            <div className="flex justify-between px-4 py-4">
                        <input
                            type="text"
                            name="name"
                            value={filters.name}
                            onChange={handleFilterChange}
                            placeholder="Filter by name"
                            className="px-4 py-2 border rounded"
                        />

                        <input
                            type="number"
                            name="maxPrice"
                            value={filters.maxPrice}
                            onChange={handleFilterChange}
                            placeholder="Max Price"
                            className="px-4 py-2 border rounded"
                        />

                        <input
                            type="number"
                            name="stock"
                            value={filters.stock}
                            onChange={handleFilterChange}
                            placeholder="Min Stock"
                            className="px-4 py-2 border rounded"
                        />

                        <select
                            name="col"
                            value={filters.col}
                            onChange={handleColumnChange}
                            className="px-4 py-2 border rounded"
                        >
                            <option value="createdAt">Created At</option>
                            <option value="price">Price</option>
                            <option value="name">Name</option>
                        </select>

                        <select
                            name="order"
                            value={filters.order}
                            onChange={handleSortChange}
                            className="px-4 py-2 border rounded"
                        >
                            <option value="ASC">Ascending</option>
                            <option value="DESC">Descending</option>
                        </select>
                    </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} role={role} />
                ))}
            </div>

            <nav className="flex flex-wrap items-center justify-center space-x-2 my-8" aria-label="Pagination">
                <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="First page"
                >
                    <FaAngleDoubleLeft className="w-5 h-5" />
                </button>
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Previous page"
                >
                    <FaAngleLeft className="w-5 h-5" />
                </button>
                {renderPageNumbers()}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Next page"
                >
                    <FaAngleRight className="w-5 h-5" />
                </button>
                <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Last page"
                >
                    <FaAngleDoubleRight className="w-5 h-5" />
                </button>
            </nav>
        </div>
    );
};

export default ProductGrid;
