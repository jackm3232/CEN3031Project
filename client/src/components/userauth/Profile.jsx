//------------------------------------------------------------------------------
// Code for profile display
// shows the user information

import React from 'react';
import { AuthContext } from './AuthProv';
// import {
//     auth
//   } from "firebase/auth";


const Profile = () => {
  const userInfo = AuthContext;
  //console.log(AuthContext);

    return (
        <div className="min-h-screen flex justify-center bg-base-200">
        <div className="hero-content flex-col">
            <div className="p-6 card w-96 bg-base-100 shadow-xl rounded-lg">
                <div className="card-body">
                    <h2 className="card-title text-2xl font-bold mb-4 flex justify-center underline">User Profile</h2>
                    <p><span className="font-semibold">Name:</span> {userInfo.name}</p>
                    <p><span className="font-semibold">Email:</span> {userInfo.email}</p>
                    <p><span className="font-semibold">Grade:</span> {userInfo.grade}</p>
                </div>
            </div>
        </div>
    </div>
    );
};

export default Profile;