import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  return !localStorage.token ? <Navigate to="/" /> : <Outlet />;
};

export default PrivateRoute;
