import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA4Ll1TbfZGRYdRGeSKIYREqNSjDKplIPo",
  authDomain: "math-magicians-93bf6.firebaseapp.com",
  projectId: "math-magicians-93bf6",
  storageBucket: "math-magicians-93bf6.appspot.com",
  messagingSenderId: "826664030826",
  appId: "1:826664030826:web:ea1b2d72372f1e6e2c7013",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);