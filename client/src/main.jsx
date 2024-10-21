import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import Record from "./components/Record";
import RecordList from "./components/RecordList";
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
    // profile page
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
        element: <StudentList />,
      },
    ],
  },
  {
    path: "/edit/:id",
    element: <App />,
    children: [
      {
        path: "/edit/:id",
        element: <Record />,
      },
    ],
  },
  {
    path: "/create",
    element: <App />,
    children: [
      {
        path: "/create",
        element: <Record />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);