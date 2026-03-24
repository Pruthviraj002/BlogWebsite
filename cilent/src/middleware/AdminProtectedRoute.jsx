import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminProtectedRoute = () => {
    const user = useSelector((state) => state.user.data);
    const token = useSelector((state) => state.user.token);

    if (!token || !user?.isAdmin) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default AdminProtectedRoute;
