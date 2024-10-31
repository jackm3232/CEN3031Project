// AuthProvider.js
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import auth from "./firebaseconfig";

// exports a react context, not sure what it does
export const AuthContext = createContext(null);

// not sure what this is
const AuthProvider = ({ children }) => {
  // user react usestate hook
  const [user, setUser] = useState(null);
  // loading react usestate hook 
  const [loading, setLoading] = useState(true);

  
  // function to create a user given an email and pass
  const createUser = (email, password) => {
    setLoading(true);
    // this stuff should prob be in a try catch.
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const loginUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const authValue = {
    createUser,
    user,
    loginUser,
    logOut,
    loading,
  };

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;