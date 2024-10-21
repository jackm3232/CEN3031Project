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
            <nav className="justify-end mb-6">
                <NavLink className="flex px-8 py-1 
                rounded-md border-solid border border-violet-500 
                text-white font-sans font-semibold
                bg-gradient-to-b from-violet-400 to-violet-500
                active:bg-gradient-to-b active:from-violet-500 active:to-violet-600
                " to="/teacher">
                    Student View
                </NavLink>
            </nav>
        </div>
    )
}