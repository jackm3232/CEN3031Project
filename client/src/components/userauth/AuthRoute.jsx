import {
    createBrowserRouter,
    RouterProvider,
  } from "react-router-dom";
//import { AuthProv, AuthContext } from "./AuthProv";
import AuthProv, { AuthContext } from "./AuthProv";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
//import AuthProv from "./AuthProv";
//import AuthProv from "./AuthRoute";

const AuthRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
    if (user) {
        return children;
    }
    return <Navigate to = "/login" />
};

AuthRoute.propTypes = {
    children: PropTypes.node,
};

export default AuthRoute;