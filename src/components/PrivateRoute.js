import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const PrivateRoute = ({ children, roles }) => {
    const user = useSelector((state) => state.auth.user);

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (roles && !roles.includes(user.role)) {
        toast.error('You are not authorized to view this page');
        return <Navigate to="/" />;
    }

    return children;
};

export default PrivateRoute;