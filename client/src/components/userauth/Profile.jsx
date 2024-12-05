//------------------------------------------------------------------------------
// Code for profile display
// shows the student/teachers information
// 
// 
// Notes:
// components/userauth/Profile.jsx

import React from 'react';

const Profile = () => {
    // static data
    const userInfo = {
        name: "John Doe",
        email: "john.doe@example.com",
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