import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const userData = Cookies.get("UserData");

    let userRole = null;
    if (userData) {
        try {
            const parsedData = JSON.parse(userData);
            userRole = parsedData.r;
        } catch (error) {
            console.error("Error while parsing UserData: ", error);
        }
    }
    if (!userRole || !allowedRoles.includes(userRole)) {
        return <Navigate to="/auth" replace />;
    }

    return children;
};

export default ProtectedRoute;