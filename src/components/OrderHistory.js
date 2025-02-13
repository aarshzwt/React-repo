import React, { useState, useEffect } from "react";
import { FaBox, FaShippingFast, FaCheck, FaSpinner, FaFileDownload, FaSearch } from "react-icons/fa";
import axiosInstance from "../utils/axiosInstance"; // Import your axiosInstance
import { format } from 'date-fns';


const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get("orders");
                setOrders(response.data.orders);
            } catch (err) {
                setError("Failed to fetch orders");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getStatusIcon = (status) => {
        switch (status) {
            case "pending":
                return <FaSpinner className="text-yellow-500 animate-spin" />;
            case "delivered":
                return <FaCheck className="text-green-500" />;
            case "shipped":
                return <FaShippingFast className="text-blue-500" />;
            case "canceled":
                return <FaBox className="text-red-500" />;
            default:
                return <FaBox className="text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "delivered":
                return "bg-green-100 text-green-800";
            case "shipped":
                return "bg-blue-100 text-blue-800";
            case "canceled":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };
    const OrderCard = ({ order }) => (
        <div
            onClick={() => {
                setSelectedOrder(order);
                setIsModalOpen(true);
            }}
            className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            role="button"
            tabIndex={0}
        >
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">Order ID: {order.id}</h3>
                    <p className="text-gray-600">Ordered on {format(new Date(order.createdAt), 'MMMM dd, yyyy HH:mm:ss')}</p>
                </div>
                <div className="text-right">
                    <p className="font-bold text-xl">₹{order.total_price}</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-2">{order.status}</span>
                    </span>
                </div>
            </div>
        </div>
    );

    const OrderDetailsModal = ({ order, onClose }) => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden">
                <div className="p-6 border-b">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Order Details - {order.id}</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ×
                        </button>
                    </div>
                </div>
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    {order.OrderItems.map((item, index) => (
                        <div key={index} className="flex items-center mb-4 p-4 border rounded-lg">
                            <img
                                src={`http://localhost:5000${item.Product.image_url}`}
                                alt={item.Product.name}
                                className="w-20 h-20 object-cover rounded"
                                onError={(e) => {
                                    e.target.src = "https://images.unsplash.com/photo-1560343090-f0409e92791a"; // fallback image
                                }}
                            />
                            <div className="ml-4 flex-grow">
                                <h3 className="font-semibold">{item.Product.name}</h3>
                                <p className="text-gray-600">Quantity: {item.quantity}</p>
                                <p className="text-gray-800">₹{item.price} each</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold">
                                ₹{(item.price * item.quantity).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-6 border-t bg-gray-50">
                    <div className="flex justify-between items-center">
                        <div>
                            <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                                <FaFileDownload className="mr-2" />
                                Export Details
                            </button>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-600">Total Amount</p>
                            <p className="text-2xl font-bold">₹{order.total_price}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500 text-xl">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
                    <div className="mt-4 relative">
                        <input
                            type="text"
                            placeholder="Search orders..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    </div>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No orders found</p>
                    </div>
                ) : (
                    <div>
                        {orders.map((order) => (
                            <OrderCard key={order.id} order={order} />
                        ))}
                    </div>
                )}

                {isModalOpen && selectedOrder && (
                    <OrderDetailsModal
                        order={selectedOrder}
                        onClose={() => {
                            setIsModalOpen(false);
                            setSelectedOrder(null);
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default OrderHistory;
