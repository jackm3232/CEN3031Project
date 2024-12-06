import * as React from "react";
import * as ReactDOM from "react-dom/client";
import App from "./App";
// import {auth} from "./components/userauth/FirebaseConfig";
// import {AuthContext} from "./components/userauth/AuthProv";
import CreateAccount from "./components/userauth/CreateAccount.jsx";
import Login from "./components/userauth/Login.jsx";
import AuthRoute from "./components/userauth/AuthRoute.jsx";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Profile from "./components/userauth/Profile.jsx"; 
import "./index.css";
import StudentList from "./components/teacherview/StudentList";
import QuestionView from "./components/teacherview/QuestionView";

const router = createBrowserRouter([
  {
    // homepage displaying questions
    path: "/home/:id",
    element: <App />,
    children: [
      {
        path: "/home/:id",
        //element: <QuestionList />,
      },
    ],
  },
  {
    // teacherview leaderboard
    path: "/teacher",
    element: <App />,
    children: [
      {
        path: "/teacher",
        element: <StudentList />,
      },
    ],
  },
  {
    // question view
    path: "/question",
    element: <App />,
    children: [
      {
        path: "/question",
        element: <QuestionView />,
      },
    ],
  },
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <CreateAccount />,
        //element: <RecordList />,
        //element: <StudentList />,
      },
      {
        path: "/list",
        element: <StudentList />,
      },
      {
        path: "/create-account",
        element: <CreateAccount />,
       },
       {
        path: "/login",
        element: <Login />,
       },
       // profile page
       {
        path: "/profile",
        element: <Profile />,
       },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
