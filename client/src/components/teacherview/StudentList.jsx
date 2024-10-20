import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const Student = (props) => (
    <div className="flex flex-col rounded-lg bg-white shadow-md space-y-3 p-6 m-1 w-1/2">
        <div className="text-2xl font-semibold text-black">
            {props.student.name}
        </div>
        <div className="text-md font-small text-black text-justify">
            {props.student.level}
        </div>
        <div className="text-sm text-black">
            {props.student.birthday}
        </div>
    </div>
);

export default function StudentList() {
    const [students, setStudents] = useState([]);

    console.log("here");

    // scrolling
    // https://buaiscia.github.io/blog/tips/handle-scroll-event-react

    // fetch records from database
    // [note]: useEffect is used for external stuff like fetching
    useEffect(() => {
        async function getStudents() {
            // [note]: in server/server.js express is told to use records from 
            // server/routes/record.js when in the /record directory, that's
            // why we fetch from /record but the express code in record.js
            // is just the root (/)
            const response = await fetch(`http://localhost:3500/`);

            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                console.error(message);
                return;
            }

            const students = await response.json();
            setStudents(students);
        }

        getStudents();
        return;
    }, [students.length]);

    // map students to table
    function studentList() {
        return students.map((student) => {
            return (
                <Student
                    student={student}
                    key={student.studentid}
                />
            );
        });
    }

    // display students
    return (
        <>
            <div className="flex overflow-visible space-y-10 items-center flex-col">
                { studentList() }
            </div>
        </>
    );
}