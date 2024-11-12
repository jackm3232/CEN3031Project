import * as React from "react";
import * as ReactDOM from "react-dom/client";
import App from "./App";
// import {auth} from "./components/userauth/FirebaseConfig";
// import {AuthContext} from "./components/userauth/AuthProv";
import CreateAccount from "./components/userauth/CreateAccount.jsx";
import Login from "./components/userauth/Login.jsx";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Record from "./components/Record";
import RecordList from "./components/RecordList";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <RecordList />,
      },
      {
        path: "/create-account",
        element: <CreateAccount />,
       },
       {
        path: "/login",
        element: <Login />,
       },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);