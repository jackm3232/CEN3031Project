//------------------------------------------------------------------------------
// Code for account creation
// Handles requests and creates instructor/student accounts
// 
// 
// Notes:

//------------------------------------------------------------------------------
import {useEffect, useContext, useState} from "react";
import AuthProv, {AuthContext} from "./AuthProv";
import {updateProfile} from "firebase/auth";
import {useNavigate} from "react-router-dom";

const CreateAccount = () => {
  const { user, loading} = AuthProv;
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
  },[user, navigate]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const classID = e.target.classID.value;
    const isInstructor = e.target.isInstructor.value;
    createUser(email, password, classID, isInstructor)
      .then((result) => {
        updateProfile(result.user, {
          displayName: name,
        });
        navigate("/");
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
    e.target.reset();
  };


  return (
    <div>
      <div className="min-h-screen bg-base-200">
        <div className="hero-content flex-col">
          <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <div className="card-body">
              <form onSubmit={handleFormSubmit}>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Name: </span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    className="input input-bordered"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email: </span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="myinbox@mailprovider.com"
                    className="input input-bordered"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Password: </span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Your Password"
                    className="input input-bordered"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Class ID: </span>
                  </label>
                  <input
                    type="classID"
                    name="classID"
                    placeholder="Your Class ID, e.g. niebauer1"
                    className="input input-bordered"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Are you an instructor? </span>
                  </label>
                  <input 
                    type="hidden"
                    name="isInstructor"
                    value="false"
                    className="input input-bordered"
                  />
                  <input
                    type="checkbox"
                    name="isInstructor"
                    value="true"
                    className="input input-bordered"
                  />
                </div>
                <div className="form-control mt-6">
                  <button className="btn btn-primary">Create My Account</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;