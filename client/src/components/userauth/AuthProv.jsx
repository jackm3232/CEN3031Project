import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import auth from "./FirebaseConfig";

export const AuthContext = createContext(null);

const AuthProv = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  function createUser(email, password, classId, isInstructor) { // I just don't know how to use this function. Originally this was a const but that didn't
    createUserWithEmailAndPassword(auth, email, password)       // work in this instance.
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('User created:', user);
        auth.currentUser.getIdToken(/* forceRefresh */ true)
        .then((idToken) => {
          console.log('ID Token:', idToken);
        })
        let role;
        if (isInstructor == "true") {
          role = 'teachers';
        }
        else {
          role = 'students';
        }
        let first = 'http://localhost:3500/create-new-user/';
        let link = first.concat (classId, '/', role, '/', user.uid);
        fetch(link, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
          },
          body: JSON.stringify({ your: 'data' }) // Not sure what data to put here
          })
          .then(response => response.json())
          .then(data => {
            console.log('Success:', data);
          })
          .catch((error) => {
            console.error('Error:', error);
          });
        
      })
      .catch((error) => {
        console.error('Error creating user:', error.message);
      });
      ;
  }
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

AuthProv.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProv;