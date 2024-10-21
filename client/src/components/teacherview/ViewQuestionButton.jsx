//------------------------------------------------------------------------------
// View Question Button
// Takes user to a screen to view questions
// 
// Notes:
//  - For temporary debugging, this button is on masthead and takes to /question
//    directory
//------------------------------------------------------------------------------


import { NavLink } from "react-router-dom";

export default function ViewQuestion() {
    return (
        <div>
            <nav className="justify-end mb-6">
                <NavLink className="flex px-8 py-1 
                rounded-md border-solid border border-purple-500 
                text-white font-sans font-semibold
                bg-gradient-to-b from-purple-400 to-purple-500
                active:bg-gradient-to-b active:from-purple-500 active:to-purple-600
                " to="/question">
                    View Question
                </NavLink>
            </nav>
        </div>
    )
}