import { useEffect, useState } from "react";
import { FiMinus, FiPlus, FiTrash2, FiHeart } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, updateCartQuantity, setError, setLoading, setOrderData, setCartItems, setTempOrderData } from "../redux/slices/cartSlice";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Cart = () => {
  const dispatch = useDispatch();
  const { cartItems, loading, error } = useSelector((state) => state.cart);
  const [promoCode, setPromoCode] = useState("");
  const navigate = useNavigate();

  const fetchCartItemsAndDetails = async () => {
    try {
      const response = await axiosInstance.get("cart");
      const cartItemsFromAPI = response.data.cartItems;
      dispatch(setCartItems(cartItemsFromAPI));
    } catch (error) {
      if (error.response && error.response.status === 404) {
        dispatch(setCartItems([]));
      }
      console.log(error)
    }
  };

  useEffect(() => {
    fetchCartItemsAndDetails();
  }, []);

  const handleCartQuantityChange = async (product_id, action) => {
    try {
      const existingItem = cartItems.find(item => item.product.id === product_id);
      if (!existingItem) return;

      let updatedCartItems = [...cartItems];
      const index = updatedCartItems.findIndex(item => item.product.id === product_id);

      if (action === 'increase') {
        const validStock = existingItem.product.stock;

        if (validStock <= updatedCartItems[index].quantity) {
          toast.error(`Not enough stock available. Only ${validStock} items available.`);
          return;
        }

        updatedCartItems[index] = {
          ...updatedCartItems[index],
          quantity: updatedCartItems[index].quantity + 1
        };

        const temp = await axiosInstance.post('cart', { product_id, quantity: 1 });
        dispatch(updateCartQuantity({ product_id, quantity: updatedCartItems[index].quantity }));
      } else if (action === 'decrease') {
        if (updatedCartItems[index].quantity === 1) {
          updatedCartItems = updatedCartItems.filter(item => item.product.id !== product_id);
          await handleRemoveItem(existingItem.id);
        } else {
          updatedCartItems[index] = {
            ...updatedCartItems[index],
            quantity: updatedCartItems[index].quantity - 1
          };
          dispatch(updateCartQuantity({ product_id, quantity: updatedCartItems[index].quantity }));
          await axiosInstance.post('cart/decrease', { product_id, quantity: 1 });
        }
      }
      dispatch(setCartItems(updatedCartItems));
    } catch (error) {
      if (error.status === 400) {
        toast.error("Not Enough Stock Available");
      }
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    const isConfirmed = window.confirm("Are you sure you want to remove this item from the cart?");
    if (!isConfirmed) return;
    try {
      dispatch(removeFromCart({ id: cartItemId }));
      await axiosInstance.delete(`cart/${cartItemId}`);
      toast.success("Product removed from cart");
    } catch (error) {
      console.log(error)
      dispatch(setError('Failed to remove item from cart'));
    }
  };

  const placeOrder = async () => {
    try {
      const response = await axiosInstance.post("/orders");
      const orderData = response?.data;
      if (orderData) {
        dispatch(setOrderData(orderData.razorpayOrder));
        console.log("orderData", orderData);
        toast.success("Order processing initiated");
        navigate("/payment");
      }
    } catch (err) {
      if (err.response?.status === 400) {
        toast.error("Could not place order, stock unavailable");
      } else {
        toast.error("Order could not be placed");
        dispatch(setError("Error placing order."));
      }
    }
  };

  if (error) {
    return <p>{error}</p>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-4">Add items to start shopping</p>
        <button onClick={() => navigate('/')} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart ({cartItems.length} items)</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems && cartItems.length > 0 && cartItems.map((item) => {
              if (!item.product) {
                return null;
              }
              return (
                <div key={item.product.id} className="bg-white rounded-lg shadow-sm p-4 transition-all hover:shadow-md">
                  <div className="flex items-center space-x-4">
                    <img
                      src={`http://localhost:5000${item.product.image_url}`}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover rounded-lg cursor-pointer transition duration-300 ease-in-out transform hover:scale-110"
                      loading="lazy"
                      onClick={() => navigate(`/products/${item.product.id}`)}
                    />
                    <div className="flex-1">
                      <div className='uppercase tracking-wide text-sm text-indigo-500 font-semibold'>{item.product.brand}</div>
                      <h3 className="text-lg font-semibold text-gray-700 cursor-pointer hover:text-black" onClick={() => navigate(`/products/${item.product.id}`)}>{item.product.name}</h3>
                      <p className="text-gray-600">₹{item.product.price}</p>

                      <div className="flex items-center mt-2 space-x-2">
                        <button onClick={() => handleCartQuantityChange(item.product.id, 'decrease')} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                          <FiMinus className="w-5 h-5" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button onClick={() => handleCartQuantityChange(item.product.id, 'increase')} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                          <FiPlus className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      <span className="font-semibold text-lg text-gray-800 dark:text-white">
                      ₹{(item.product.price * item.quantity)}
                      </span>
                      <div className="flex space-x-1">
                        <button onClick={() => handleRemoveItem(item.id)} className="p-2 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                          <FiHeart className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleRemoveItem(item.id)} className="p-2 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span> ₹{cartItems.reduce((sum, item) => {
                    if (item.product && item.product.price) {
                      return sum + item.product.price * item.quantity;
                    }
                    return sum;
                  }, 0)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 ">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
                <div className="flex justify-between text-lg font-bold text-gray-800">
                  <span>Total</span>
                  ₹{cartItems.reduce((sum, item) => {
                    if (item.product && item.product.price) {
                      return sum + item.product.price * item.quantity;
                    }
                    return sum;
                  }, 0)}

                </div>
              </div>

              <div className="space-y-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Promo code"
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  <button className="px-4 py-2 bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                    Apply
                  </button>
                </div>

                <button onClick={placeOrder} className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Proceed to Checkout
                </button>

                <button className="w-full px-6 py-3 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => navigate('/')}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
