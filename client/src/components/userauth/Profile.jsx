//------------------------------------------------------------------------------
// Code for profile display
// shows the student/teachers information
// 
// 
// Notes:
// components/userauth/Profile.jsx

//import { userInfo } from 'os';
import React from 'react';
//import user from './AuthProv';

//const auth = getAuth();

const Profile = (user) => {
    // static data
    const userInfo = {
      name: user.name,
      email: user.email
    };

    return (
        <div>
            <h1>User Profile</h1>
            <p>Name: {userInfo.name}</p>
            <p>Email: {userInfo.email}</p>
           
        </div>
    );
};

export default Profile;