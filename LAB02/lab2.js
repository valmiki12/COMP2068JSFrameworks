// Name: Valmiki
// Student Number: 200524559
// LAB-2 - Rock, Paper and Scissors in JS

const prompt = require('prompt');
const randomNum = Math.random();

console.log("Welcome, User!");
console.log("Select Rock, Paper or Scissors: ");

prompt.start();

// Asks the user to choose 
prompt.get(['userSelection'], function (err, result) {
    if (err) {
      console.error(err);
      return;
    }
  // storing user selection
  let userSelection = result.userSelection.toUpperCase();

  // ends program if the input is not valid
  if (userSelection !== 'ROCK' && userSelection !== 'PAPER' && userSelection !== 'SCISSORS') {
    console.log('Invalid choice! Please choose either Rock, Paper, or Scissor.');
    return; 
  }

  console.log(`User Chose: ${userSelection}`);

  // store's comp selection by a random number
  let computerSelection = randomNum;

  if (randomNum <= 0.34) {
    computerSelection = 'PAPER';
  } else if (randomNum <= 0.67) {
    computerSelection = 'SCISSORS';
  } else {
    computerSelection = 'ROCK';
  }

  console.log(`Computer Chose: ${computerSelection}`);

  // Winner:
  switch (userSelection + "-" + computerSelection) {
    case 'ROCK-SCISSORS':
    case 'SCISSORS-PAPER':
    case 'PAPER-ROCK':
      console.log('User Wins!');
      break;
  
    case 'SCISSORS-ROCK':
    case 'PAPER-SCISSORS':
    case 'ROCK-PAPER':
      console.log('Computer Wins!');
      break;
  
    default:
      console.log("It's a tie!");
      break;
  }  
});

