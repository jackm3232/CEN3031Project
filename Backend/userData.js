// Set up data for student/instructor accounts. Currently separates them when -instructor is included in an email
import { getAuth } from "firebase/auth";

const auth = getAuth();
const user = auth.currentUser;
if (user !== null) {
  const displayName = user.displayName;
  const email = user.email;
  const photoURL = user.photoURL;
  const emailVerified = user.emailVerified;
  const uid = user.uid;
}

db.collection("users").doc(uid).set({
    name: displayName,
    
    is_student: true 
  }).then(function() {
    console.log("Added new user");
  });
  if (email.contains("-instructor")) {
    db.collection("users").doc(uid).update({
    is_student: false
  })}
  else {
    db.collection("users").doc(uid).set({
        level_times: {
            level_1_mins: 0,
            level_2_mins: 0,
            level_3_mins: 0,
            level_4_mins: 0,
            level_5_mins: 0,
            total_mins: 0
        },
        wrong_answers: {
            level_1_wrong: 0,
            level_2_wrong: 0,
            level_3_wrong: 0,
            level_4_wrong: 0,
            level_5_wrong: 0
        },
        leaderboard_rank: 0,
        current_level: 1,
    }
  )};