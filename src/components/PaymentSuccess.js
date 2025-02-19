import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../utils/axiosInstance";
import { Navigate, useNavigate } from "react-router-dom";
import { setOrderData } from "../redux/slices/cartSlice";

const PaymentSuccess = () => {
    const orderData = useSelector((state) => state.cart.orderData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    console.log("orderData", orderData)
    const navigate = useNavigate();
    const dispatch = useDispatch();


    const handlePayment = () => {
        var options = {
            "key": "rzp_test_ECgfgVCdz6OR7w",
            "amount": `${orderData.total_price}*100`,
            "currency": "INR",
            "name": "Dummy Academy",
            "description": "Pay & Checkout this Course, Upgrade your DSA Skill",
            "image": "https://media.geeksforgeeks.org/wp-content/uploads/20210806114908/dummy-200x200.png",
            "order_id": `${orderData.id}`,
            "handler": async function (response) {
                console.log(response);
                console.log("success");
                const APIresponse = await axiosInstance.post('orders/confirmOrder',{
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature
                })
                const paymentAPIresponse = await axiosInstance.post('orders/payment',{
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                })
                const orderData = APIresponse.data;
                dispatch(setOrderData(orderData))
                navigate("/order")
            },
            "prefill": {
                "contact": "9876543210",
                "name": "Twinkle Sharma",
                "email": "smtwinkle@gmail.com"
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