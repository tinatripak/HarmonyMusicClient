import { Navigate, Outlet, useLocation } from "react-router-dom";
import React from "react";
import { useStateValue } from "../../Context/StateProvider";

const AdminRoute = () => {
  const location = useLocation();

  const [{ user }] = useStateValue();
  if (user) {
    return user.user.role === "admin" ? (
      <Outlet />
    ) : (
      <Navigate to="/home" replace state={{ from: location }} />
    );
  }
};

export default AdminRoute;
