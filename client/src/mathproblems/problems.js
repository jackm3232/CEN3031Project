//------------------------------------------------------------------------------
// Problem Generator Code
// Generates a problem given a difficulty level (ones, tens, hundreds) and 
// an operator. 
// 
// Notes:
//  - Subtraction doesn't account for negatives
//  - Division not implemented (not sure how to handle, maybe ans needs remainder?)
//  - Should the export use props or just args
//------------------------------------------------------------------------------

export const operator = { addition: "+", subtraction: "-", multiplication: "*" };
export const difficulty = { ones: "ones", tens: "tens", hundreds: "hundreds" };

// generates a question argument based on the given difficulty level (ones, tens, hundreds)
function genArgument(difficultyLevel) {
  let multiplier = 0;
  switch (difficultyLevel) {
    case difficulty.ones:
      // get random int between 0-9
      multiplier = 10;
      break;
    case difficulty.tens:
      // get random int between 0-99
      multiplier = 100;
      break;
    case difficulty.hundreds:
      // get random int between 0-999
      multiplier = 1000;
      break;
    default:
      multiplier = 0;
      break;
  }

  return Math.floor(Math.random() * multiplier);
}

// generates answer
function genAnswer(lh, rh, op) {
  switch (op) {
    case operator.addition:
      return lh + rh;
    case operator.subtraction:
      // [note]: subtraction doesn't account for negatives
      return lh - rh;
    case operator.multiplication:
      return lh * rh;
    default:
      return 0;
  }
}

// generates a question with a given difficulty and question type
export const generateQuestion = (props) => {
  const question = {};

  question.operator = props.operator;

  question.leftHand  = genArgument(props.difficulty);
  question.rightHand = genArgument(props.difficulty);

  question.answer = genAnswer(question.leftHand, question.rightHand, question.operator);

  return [question];
};