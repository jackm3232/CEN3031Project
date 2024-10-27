import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <div>
      <nav className="flex justify-between items-center mb-6">
        <NavLink to="/">
          <img alt="Math Magicians logo" style={{height:80, width:150}} className="h-10 inline" src="Math Magicians.png"></img>
        </NavLink>

        <NavLink to="/create">
        <img alt="Profile Button" style={{height:40, width:40}} src="profile_image.png"></img>
        </NavLink>
      </nav>
    </div>
  );
}