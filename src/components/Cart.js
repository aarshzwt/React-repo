import { useState, useEffect } from "react";
import { FiMinus, FiPlus, FiTrash2, FiHeart, FiShoppingBag } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart, updateCartQuantity, setError, setLoading, setOrderData } from "../redux/slices/cartSlice";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  
  const dispatch = useDispatch();
  const { cartItems, loading, error } = useSelector((state) => state.cart);
  const [loadedCartItems, setLoadedCartItems] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const navigate = useNavigate();


  const fetchProductDetails = async (productId) => {
    try {
      const response = await axiosInstance.get(`products/${productId}`);
      return response.data.product;
    } catch (error) {
      dispatch(setError("Failed to fetch product details"));
      return null;
    }
  };
  const fetchCartItemsAndDetails = async () => {
    try {
      // Fetch cart items from the API
      const response = await axiosInstance.get("cart");
  
      // Check if cartItems exists in the response
      const cartItemsFromAPI = response.data.cartItems;  // Ensure 'data' is used to access the response body
  
      console.log(cartItemsFromAPI);
  
      // Fetch product details for each cart item
      const cartWithDetails = await Promise.all(
        cartItemsFromAPI.map(async (item) => {
          const productDetails = item.product;  // Since product details are nested inside the 'product' object
          if (productDetails) {
            return {
              ...item,
              ...productDetails,  // Merging product details into the cart item
            };
          } else {
            return item;
          }
        })
      );
  
      setLoadedCartItems(cartWithDetails);  // Set the final cart items with product details
    } catch (error) {
      dispatch(setError("Failed to fetch cart items"));
    }
  };

  useEffect(() => {
    fetchCartItemsAndDetails();
  }, []);

  const handleCartQuantityChange = async (product_id, action) => {
    try {
      const existingItem = loadedCartItems.find(item => item.product_id === product_id);
      if (!existingItem) return;

      const currentQuantity = existingItem.quantity;
      let updatedCartItems = [...loadedCartItems];
      const index = updatedCartItems.findIndex(item => item.product_id === product_id);

      if (action === 'increase') { //pending: when stock<quantity
        updatedCartItems[index].quantity += 1;
        dispatch(updateCartQuantity({ product_id, quantity: updatedCartItems[index].quantity }));
        await axiosInstance.post('cart', { product_id, quantity: updatedCartItems[index].quantity });
      } else if (action === 'decrease') {
        if (currentQuantity === 1) {
          updatedCartItems = updatedCartItems.filter(item => item.product_id !== product_id);
          dispatch(removeFromCart({ product_id }));
          await axiosInstance.delete(`cart/${product_id}`);
        } else {
          updatedCartItems[index].quantity -= 1;
          dispatch(updateCartQuantity({ product_id, quantity: updatedCartItems[index].quantity }));
          await axiosInstance.post('cart/decrease', { product_id, quantity: updatedCartItems[index].quantity });
        }
      }

      setLoadedCartItems(updatedCartItems);
    } catch (error) {
      dispatch(setError('Failed to update cart'));
    }
  };

  const handleRemoveItem = async (product_id) => {
    try {
      await axiosInstance.delete(`cart/${product_id}`);
      setLoadedCartItems((prevItems) =>
        prevItems.filter((item) => item.product_id !== product_id)
      );
      dispatch(removeFromCart({ product_id }));
    } catch (error) {
      dispatch(setError('Failed to remove item from cart'));
    }
  };

  const placeOrder = async () => {
    try {
      const response = await axiosInstance.post("/orders");
      const orderData = response.data;
      dispatch(setOrderData(orderData));
      console.log(orderData)
      navigate("/order");
    } catch (err) {
      setError("Error placing order.");
    }
  };


  if (error) {
    return <p>{error}</p>;
  }

  if (loadedCartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-4">Add items to start shopping</p>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Shopping Cart ({loadedCartItems.length} items)</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {loadedCartItems.map((item) => {
              // Get product details for each item
              console.log(item);
              const { product_id, quantity, name, description, price, image_url, brand } = item;

              return (
                <div key={product_id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 transition-all hover:shadow-md">
                  <div className="flex items-center space-x-4">
                    <img
                      src={`http://localhost:5000${image_url}`}
                      alt={name}   // Product name
                      className="w-24 h-24 object-cover rounded-lg"
                      loading="lazy"
                    />
                    <div className="flex-1">
                      <div className='uppercase tracking-wide text-sm text-indigo-500 font-semibold'>{brand}</div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{name}</h3>
                      <p className="text-gray-600 dark:text-gray-300">${price}</p>

                      <div className="flex items-center mt-2 space-x-2">
                        <button onClick={() => handleCartQuantityChange(product_id, 'decrease')} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                          <FiMinus className="w-5 h-5" />
                        </button>
                        <span className="w-8 text-center">{quantity}</span>
                        <button onClick={() => handleCartQuantityChange(product_id, 'increase')} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                          <FiPlus className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      <span className="font-semibold text-lg text-gray-800 dark:text-white">
                        ${(price * quantity)}
                      </span>
                      <div className="flex space-x-2">
                        <button onClick={() => handleRemoveItem(product_id)} className="p-2 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
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
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Order Summary</h2>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Subtotal</span>
                  <span>${loadedCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
                <div className="flex justify-between text-lg font-bold text-gray-800 dark:text-white">
                  <span>Total</span>
                  <span>${loadedCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)}</span>
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

                <button className="w-full px-6 py-3 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
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