//------------------------------------------------------------------------------
// Student View Button
// Takes user to a screen to view leaderboard from student perspective
// 
// Notes:
//  - For temporary debugging, this button is on masthead and takes to /teacher
//    directory
//------------------------------------------------------------------------------


import { NavLink } from "react-router-dom";

export default function ViewStudentBoard() {
    return (
        <div>
            <nav>
                <NavLink className="flex px-3 py-1 
                rounded-md border-solid border border-cyan-950 
                text-white font-sans font-semibold
                bg-gradient-to-b from-cyan-950 to-cyan-950
                active:bg-gradient-to-b active:from-sky-950 active:to-sky-950
                " to="/teacher">
                    Student View Leaderboard
                </NavLink>
            </nav>
        </div>
    )
}