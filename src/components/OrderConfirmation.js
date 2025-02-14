import React, { useState, useEffect } from "react";
import { FaCheck, FaPrint, FaEnvelope, FaTruck } from "react-icons/fa";
import axiosInstance from "../utils/axiosInstance";
import { useSelector } from "react-redux";

const OrderConfirmation = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const orderData = useSelector((state) => state.cart.orderData);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axiosInstance.get(`orders/${orderData.order.id}`);
        setOrderDetails(response.data);
        console.log("order details",response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch order details");
        setLoading(false);
      }
    };
      fetchOrderDetails();
  }, []);

  if (loading) {
    return <p>Loading order details...</p>;
  }
  if (error) {
    return <p>{error}</p>;
  }

  const handlePrint = () => {
    window.print();
  };

  const handleEmailOrder = () => {
    console.log("Sending order details via email");
  };


  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCheck className="h-6 w-6 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Order Confirmed!</h1>
          <p className="text-gray-600 mt-2">Thank you for your purchase</p>
        </div>

        <div className="border-t border-b border-gray-200 py-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Order Number</p>
              <p className="font-semibold">{orderDetails.order.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Order Date</p>
              <p className="font-semibold">
              {new Date(orderDetails.order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Estimated Delivery</p>
              <p className="font-semibold">
                {new Date(
                  Date.now() + 7 * 24 * 60 * 60 * 1000
                ).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          {orderDetails?.order?.OrderItems && orderDetails.order.OrderItems.length > 0 ? (
            orderDetails.order.OrderItems.map((product) => (
              <div
                key={product.id}
                className="flex items-center py-4 border-b border-gray-200"
              >
                <img
                  src={`http://localhost:5000${product.Product.image_url}`}
                  alt={product.Product.name}
                  className="h-20 w-20 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1580870069867-74c57ee1bb07"; // Fallback image
                  }}
                />
                <div className="ml-4 flex-1">
                  <h3 className="font-medium">{product.Product.name}</h3>
                  <p className="text-gray-600">Quantity: {product.quantity}</p>
                </div>
                <p className="font-semibold">
                ₹{(product.price * product.quantity).toFixed(2)}
                </p>
              </div>
            ))
          ) : (
            <p>No items found in your order.</p>
          )}
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="text-gray-600">Subtotal</p>
              <p className="font-medium">
              ₹{parseFloat(orderDetails?.order?.total_price).toFixed(2)}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-600">Tax</p>
              <p className="font-medium">0.00</p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-600">Shipping</p>
              <p className="font-medium">FREE</p>
            </div>
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex justify-between">
                <p className="text-lg font-semibold">Total</p>
                <p className="text-lg font-semibold">
                ₹{parseFloat(orderDetails?.order?.total_price).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={handlePrint}
            className="flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
          >
            <FaPrint className="mr-2" />
            Print Order
          </button>
          <button
            onClick={handleEmailOrder}
            className="flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
          >
            <FaEnvelope className="mr-2" />
            Email Order
          </button>
          <div className="flex items-center px-6 py-3 bg-green-50 text-green-700 rounded-lg">
            <FaTruck className="mr-2" />
            Tracking details will be sent shortly
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
