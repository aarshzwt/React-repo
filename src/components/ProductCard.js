import React, { useEffect, useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, setError } from '../redux/slices/cartSlice';
import { useNavigate } from 'react-router-dom';

const ProductCard = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const cartItems = useSelector((state) => state.cart.cartItems);
    const { id } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchProductById = async () => {
            try {
                const response = await axiosInstance.get(`products/${id}`);
                setProduct(response.data.product);
            } catch (error) {
                console.log(error);
                console.error('Failed to fetch product details', error);
            }
        };

        fetchProductById();
    }, [id]);

    if (!product) {
        return <div>Product not found.</div>;
    }

    const isProductInCart = cartItems.some(item => item.product_id === product.id);
    console.log(isProductInCart);

    const handleCart = async (product_id) => {
        try {
            const response = await axiosInstance.post('cart', { product_id, quantity: 1 });
            dispatch(addToCart({ product_id }));
            console.log(response);

            // navigate("/cart");  
        } catch (error) {
            console.log(error);
            dispatch(setError('Failed to add to cart'));
        }
    };


    return (
        <div className='flex min-h-screen justify-center items-center bg-gray-100 p-4'>
            <div className='flex flex-col md:flex-row max-w-6xl w-full mx-auto bg-white rounded-xl shadow-md overflow-hidden'>
                <div className='w-full md:w-1/2 h-64 md:h-auto'>
                    <img
                        className='h-full w-full object-cover transition duration-300 ease-in-out transform hover:scale-105'
                        src={`http://localhost:5000${product.image_url}`}
                        alt={product.name}
                    />
                </div>
                <div className='w-full md:w-1/2 p-6 md:p-8'>
                    <div className='uppercase tracking-wide text-sm text-indigo-500 font-semibold'>{product.brand}</div>
                    <h2 className='block mt-1 text-xl md:text-2xl leading-tight font-medium text-black'>{product.name}</h2>
                    <p className='mt-2 text-gray-500 text-sm md:text-base'>{product.description}</p>
                    <div className='mt-4 flex items-center justify-between'>
                        <span className='text-2xl md:text-3xl font-bold text-gray-900'>₹{product.price}</span>
                        <div className='text-gray-700 text-sm md:text-base'>Stock: {product.stock}</div>
                    </div>
                    {/* <div className='mt-4'>
            <span className='text-gray-700 text-sm md:text-base'>Size:</span>
            <div className='mt-2 flex flex-wrap gap-2'>
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-2 md:px-3 py-1 text-xs md:text-sm font-medium rounded-full ${
                    selectedSize === size
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div> */}
                    <div className='mt-6 md:mt-8 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4'>
                        <button className='w-full sm:w-auto flex-1 bg-indigo-600 text-white py-2 md:py-3 px-4 md:px-6 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out text-sm md:text-base'>
                            Buy Now
                        </button>
                        {isProductInCart ? (
                            <button  onClick={() => navigate('/cart')} className='w-full sm:w-auto flex items-center justify-center bg-gray-200 text-gray-700 py-2 md:py-3 px-4 md:px-6 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-150 ease-in-out text-sm md:text-base'>
                                <FaShoppingCart className='mr-2' /> Go To Cart
                            </button>
                         ) : (
                            <button onClick={() => handleCart(product.id)} className='w-full sm:w-auto flex items-center justify-center bg-gray-200 text-gray-700 py-2 md:py-3 px-4 md:px-6 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-150 ease-in-out text-sm md:text-base'>
                                <FaShoppingCart className='mr-2' /> Add to Cart
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;