//------------------------------------------------------------------------------
// Code for account creation
// Handles requests and creates instructor/student accounts
// 
// 
// Notes:

//------------------------------------------------------------------------------
import {useEffect, useContext, useState} from "react";
import AuthProv, {AuthContext} from "./AuthProv";
import auth from "./FirebaseConfig";
import {signInWithEmailAndPassword, updateProfile} from "firebase/auth";
import {useNavigate} from "react-router-dom";

function userLogin(email, password) { 
  return signInWithEmailAndPassword(auth, email, password)      
    .catch((error) => {
      console.error('Error creating user:', error.message);
      window.alert(error.message);
      throw error; // Skip .then that comes after this function is executed
    })
}

const Login = () => {
  //const {user, loading} = AuthProv;
  const { user, loginUser, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  
  if (loading) {
    return (
      <div>Loading</div>
    );
  }

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    // if (email == "") {
    //   window.alert("Could not sign in, you need to include your email!");
    // }
    // else if (password == "") {
    //   window.alert("Could not create your account, you need to include a password!");
    // }
    // else {

    AuthProv.loginUser(email, password).then(() => {
      window.alert("Logged in"); 
      navigate("/");
    });
    
      userLogin(email, password)
      .then(() => {
        //loginUser(email, password);
        window.alert("You're logged in!");
        navigate("/");
      })
      .catch((error) => { // Catches error thrown within signIn function to skip navigate("/")
        
      });
    
    // }
  };

  

  return (
    <div>
      <div className="min-h-screen flex justify-center bg-base-200">
        <div className="hero-content flex-col">
          <div className="p-4 card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100 rounded-lg">
            <div className="card-body">
              <form onSubmit={handleFormSubmit}>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold">Email: </span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="myinbox@mailprovider.com"
                    className="input input-bordered"
                    size="30"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold">Password: </span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Your Password"
                    className="input input-bordered"
                    size="30"
                  />
                </div>
                <div className="form-control mt-6 flex justify-center">
                  <button className="p-1 bg-cyan-950 hover:bg-blue-300 text-white btn btn-primary rounded-lg "> Log In </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;