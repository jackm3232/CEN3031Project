//------------------------------------------------------------------------------
// Question View code
// Displays a question and allows the user to enter an answer and see if it's 
// correct 
// 
// Notes:
//  - try to add visualization
//  - not happy with answer checking
//------------------------------------------------------------------------------

import { useEffect, useState } from "react";
import { generateQuestion, difficulty, operator } from "../../mathproblems/problems";

// gets the proper graphic for the different operations
function getOperatorGraphic(op) {
  switch (op) {
    case operator.addition:
      return "+";
    case operator.subtraction:
      return "-";
    case operator.multiplication:
      return "x";
    default:
      return "no operator";
  }
}

function checkAnswer(ans, e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const formJson = Object.fromEntries(formData.entries());

  if (formJson.guess == ans) {
    alert("Correct!");
    console.log("Correct!");
    return true;
  }

  console.log("Not Correct!");
  alert("Not Correct!");
  return false;  
}

const Question = (props) => (
  <div className="rounded-lg bg-white shadow-md space-x-3 p-6 m-1 w-1/2">
    <div className="text-lg font-small text-black text-justify">
        Question:
    </div>
    <span className="text-md font-small text-black text-justify">
            {props.question.leftHand}
    </span>
    <span className="text-md font-small text-black text-justify">
      { getOperatorGraphic(props.question.operator) }
    </span>
    <span className="text-md font-small text-black text-justify">
      {props.question.rightHand}
    </span>
    <span className="text-md font-small text-black text-justify">
          =
    </span>
    <span className="text-md font-small text-black text-justify">
      ?
    </span>

    <form onSubmit={(e) => checkAnswer(props.question.answer, e)}>
      <label>
        Answer: <input name="guess" className="outline" />
      </label>
      <button type="submit">Check Answer</button>
    </form>
  </div>
);

// Question react component
export default function QuestionView() {  
  const [questions, setQuestions] = useState([]);
  //const [type] = useState("add");

  // requests a question from math "api"
  async function requestQuestion() {
    // spec type of question
    let questionType = { difficulty: difficulty.tens, operator: operator.multiplication };
    // generate question with type
    const newQuestion = await generateQuestion(questionType); 

    // if failed to gen a question
    if (!newQuestion) {
      console.error("Failed to get question!");
    }

    setQuestions(newQuestion);
  }

  useEffect(() => {
    requestQuestion();
  }, [questions.length]);

  function createQuestions() {
    return questions.map((question) => {
      console.log(question.answer);
      return (
        <Question
          question={question}
        />
      );
    });
  }

  // display question
  return (
    <>
      <span>
        { createQuestions() }
      </span>
      <button onClick={requestQuestion}>
        Get New Question
      </button>
    </>
  );
}