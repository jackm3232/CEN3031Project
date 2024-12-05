import {
    createBrowserRouter,
    RouterProvider,
  } from "react-router-dom";
import AuthProv, {AuthContext} from "./AuthProv";
import { useContext } from "react";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

const AuthRoute = ({ children }) => {
    // const { user, loading } = useContext(AuthContext);

    // if(user) {
    //     return children;
    // }
    return children;
};

AuthRoute.propTypes = {
    children: PropTypes.node,
};

export default AuthRoute;