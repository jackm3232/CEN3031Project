import { NavLink } from "react-router-dom";
import ViewStudentBoard from "./teacherview/ViewStudentBoard";
import ViewQuestionButton from "./teacherview/ViewQuestionButton";
import { useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const isProfileActive = location.pathname === "/profile";
  
  return (
    <div>
      <nav className="flex justify-between items-center mb-6">
        <NavLink to="/">
          <img alt="Math Magicians logo" style={{height:80, width:150}} className="h-10 inline" src="Math Magicians.png"></img>
        </NavLink>
        <ViewStudentBoard className="d-flex justify-content-end"/>
        <NavLink to="/profile">
        <img alt="Profile Button" 
        style={{height:40, width:40}}
         src= { isProfileActive ? "profile_image_active.png" : "profile_image.png"}
        ></img>
        </NavLink>
      </nav>
      <ViewQuestionButton className="flex basis-1/2"/>
    </div>
  );
}