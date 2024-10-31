//------------------------------------------------------------------------------
// Firebase Configuration Code
// Returns firebase authentication object for managing user accounts.
// 
// Notes:
//  - This file is in the gitignore. It's not supposed to be like that, 
//    sensitive info, like apiKey, should be stored in a config.env file (which
//    should be in the .gitignore). This file should NOT be in the .gitignore.
//------------------------------------------------------------------------------

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC1laSN2smcmLLPM6HpLk03daHuL3z28xA",
  authDomain: "math-magicians.firebaseapp.com",
  databaseURL: "https://math-magicians-default-rtdb.firebaseio.com",
  projectId: "math-magicians",
  storageBucket: "math-magicians.appspot.com",
  messagingSenderId: "401594687086",
  appId: "1:401594687086:web:60a9e334412973138dd07f",
  measurementId: "G-0JE4PYWY3V"
};

// a firebase app hold init info for firebase services
// initializeApp creates the app instance 
const app = initializeApp(firebaseConfig);
// each firebase app can have 1 auth. getAuth creates and/or returns auth obj
const auth = getAuth(app);

export default auth;