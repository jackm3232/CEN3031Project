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
import {createUserWithEmailAndPassword, updateProfile} from "firebase/auth";
import {useNavigate} from "react-router-dom";

function createUser(name, email, password, classID, isInstructor) { // I just don't know how to use this function. Originally this was a const but that didn't
  return createUserWithEmailAndPassword(auth, email, password)       // work in this instance.
    .then((userCredential) => {
      const user = userCredential.user;
      console.log('User created:', user);
      auth.currentUser.getIdToken(/* forceRefresh */ true)
      .then((idToken) => {
        console.log('ID Token:', idToken);
        let role;
      if (isInstructor == true) {
        role = 'teachers';
      }
      else {
        role = 'students';
      }
      let first = 'http://localhost:3500/create-new-user/';
      let link = first.concat (classID, '/', role, '/', user.uid);
      fetch(link, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ classIDs: {classID},
                               level: 0,
                               name: name
         })
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
    })
    .catch((error) => {
      console.error('Error creating user:', error.message);
      window.alert(error.message);
    });
}

const CreateAccount = () => {
  const {user, loading} = AuthProv;
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
    const isInstructor = e.target.isInstructor.checked;
    createUser(name, email, password, classID, isInstructor)
      .then(() => {
        window.alert("Account created succesfully");
        navigate("/");
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
                    type="checkbox"
                    name="isInstructor"
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