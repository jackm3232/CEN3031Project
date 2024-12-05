import {
    createBrowserRouter,
    RouterProvider,
  } from "react-router-dom";
import AuthProv, {AuthContext} from "./AuthProv";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

const AuthRoute = ({ children }) => {
    if(user) {
        return children;
    }
    return <Navigate to = "/login" />
};

AuthRoute.propTypes = {
    children: PropTypes.node,
};

export default AuthRoute;