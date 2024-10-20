import { NavLink } from "react-router-dom";

export default function ViewStudentBoard() {
    return (
        <div>
            <nav className="justify-end mb-6">
                <NavLink className="flex px-8 py-1 
                rounded-md border-solid border border-emerald-500 
                text-white font-sans font-semibold
                bg-gradient-to-b from-emerald-400 to-emerald-500
                active:bg-gradient-to-b active:from-emerald-500 active:to-emerald-600
                " to="/teacher">
                    Student View
                </NavLink>
            </nav>
        </div>
    )
}