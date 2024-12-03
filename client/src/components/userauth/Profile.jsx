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
        // Add other user info as needed
    };

    return (
        <div>
            <h1>User Profile</h1>
            <p>Name: {userInfo.name}</p>
            <p>Email: {userInfo.email}</p>
            {/* Display other user information as needed */}
        </div>
    );
};

export default Profile;