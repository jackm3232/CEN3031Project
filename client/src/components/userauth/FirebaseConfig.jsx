import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC1laSN2smcmLLPM6HpLk03daHuL3z28xA",
  authDomain: "math-magicians.firebaseapp.com",
  projectId: "math-magicians",
  storageBucket: "math-magicians.appspot.com",
  messagingSenderId: "401594687086",
  appId: "1:401594687086:web:60a9e334412973138dd07f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export default auth;