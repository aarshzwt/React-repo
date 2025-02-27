import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../utils/axiosInstance";
import { Navigate, useNavigate } from "react-router-dom";
import { setOrderData } from "../redux/slices/cartSlice";
import toast from "react-hot-toast";

const PaymentSuccess = () => {
    const orderData = useSelector((state) => state.cart.orderData);
    console.log("orderData in paymentSuccess", orderData);
    const userData = useSelector((state) => state.auth.user);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    console.log("orderData", orderData)
    const navigate = useNavigate();
    const dispatch = useDispatch();


    const handlePayment = async () => {
        setLoading(true);
        try {
            console.log("orderData.id", orderData.id);
            const confirmOrderAPIresponse = await axiosInstance.post('orders/confirmOrder', {
                razorpay_order_id: orderData.id,
                // razorpay_payment_id: response.razorpay_payment_id,
                // razorpay_signature: response.razorpay_signature
            })
            console.log("confirmOrderAPIresponse", confirmOrderAPIresponse);
            const updatedOrderData = confirmOrderAPIresponse?.data?.order;
            console.log("updatedOrderData", updatedOrderData);
            if (!updatedOrderData) {
                toast.error("Sorry, Stock Unavailable. Order confirmation failed.");
                throw new Error("Sorry, Stock Unavailable. Order confirmation failed.");
            }
            // setTempOrderData(updatedOrderData);
            // console.log("tempOrderData", tempOrderData);
            // dispatch(setOrderData(updatedOrderData));
            // console.log("orderData after updatedOrderData", orderData);

            var options = {
                "key": "rzp_test_ECgfgVCdz6OR7w",
                "amount":  updatedOrderData.total_price * 100, 
                "currency": "INR",
                "name": "React Ecommerce",
                "description": "Pay & Checkout this Course, Upgrade your DSA Skill",
                "image": "https://media.geeksforgeeks.org/wp-content/uploads/20210806114908/dummy-200x200.png",
                "order_id": updatedOrderData.razorpay_order_id,
                "handler": async function (response) {
                    console.log(response);
                    console.log("success");
                    try {
                        const paymentAPIresponse = await axiosInstance.post('orders/payment', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        })
                        console.log("Payment API success", paymentAPIresponse);
                        dispatch(setOrderData(paymentAPIresponse.data.order));
                        toast.success("Payment Successful");
                        navigate("/order")
                    } catch (paymentError) {
                        console.log(paymentError);
                        toast.error("Payment API failed");
                    }

                },
                "prefill": {
                    "contact": "xxxxxxxxxx",
                    "name": `${userData.first_name} ${userData.last_name}`,
                    "email": userData.email
                },
                "notes": {
                    "description": "Best Course for SDE placements",
                    "language": "Available in 4 major Languages JAVA,C/C++, Python, Javascript",
                    "access": "This course have Lifetime Access"
                },
                "theme": {
                    "color": "#2300a3"
                }
            };

        } catch (confirmOrderError) {
            console.log(confirmOrderError);
            if (confirmOrderError?.status === 400) {
                toast.error("Could not confirm order, stock unavailable")
            } else {
                toast.error("Order confirmation failed.");
            }
        }
        var razorpayObject = new window.Razorpay(options);
        razorpayObject.on('payment.failed', function (response) {
            console.log(response);
            alert("This step of Payment Failed");
        });
        razorpayObject.open();
    };

    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <div>
                    <h1>Payment</h1>
                    <button id="pay-button" onClick={handlePayment}>Pay Now</button>
                </div>
            )}
        </div>
    );
};

export default PaymentSuccess;