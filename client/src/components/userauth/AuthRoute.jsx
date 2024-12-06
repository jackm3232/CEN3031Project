import AuthProv, { AuthContext } from "./AuthProv";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { useContext } from "react";

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