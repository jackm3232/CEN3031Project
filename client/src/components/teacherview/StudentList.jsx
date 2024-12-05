//------------------------------------------------------------------------------
// Student List code
// Displays a table of students and their respective levels on the teacher side
// view. 
// 
// Notes:
//  - Student Key property needs to be the document id, not sure how to do that
//  - Delete buttons doesn't do anything rn, that'll need to be implemented on 
//    the backend, also should be icon
//  - The Student View button should let the teacher see the leaderboard from 
//    the student's perspective, this'll also allow us to test it w/out having
//    to login as a student.
//  - Student View should be under /teacher/:id, not the root of the website but
//    I haven't been able to change that yet
//  - Styling looks awful
//------------------------------------------------------------------------------

import { useEffect, useState } from "react";

const Student = (props) => (
  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
      {props.student.name}
    </td>
    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
      {props.student.level}
    </td>
    
  </tr>
);

export default function StudentList() {
    const [students, setStudents] = useState([]);
    // scrolling
    // https://buaiscia.github.io/blog/tips/handle-scroll-event-react

    // fetch students from server
    // [note]: useEffect is used for external stuff like fetching
    useEffect(() => {
        async function getStudents() {
            const response = await fetch(`http://localhost:3500/get-class-members/4thgrademath/students`);

            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                console.error(message);
                return;
            }

            const students = await response.json();
            students.sort((a, b) => b.level - a.level);
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

    // sorts the students by descending order of level
    function sortedStudentList(){
      const sortedStudents = [...students].sort((a, b) => b.level - a.level);
      
      return sortedStudents.map((student) => {
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
      <h3 className="text-lg font-semibold p-4">Student Leaderboard</h3>
      <div className="border rounded-lg overflow-hidden">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Name
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Level
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {studentList()}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}