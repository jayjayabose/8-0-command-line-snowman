//`readline-sync` is a library that allows you to access user input from the command line. 
const readline = require("readline-sync");

//The `dictionary` variable will have an array of words that can be used for your game.
const dictionary = require("./dictionary");

//This function returns a random word from the list in `src/dictionary.js`. call it from the `run()` function.
function getRandomWord() {
  const index = Math.floor(Math.random() * dictionary.length);
  return dictionary[index];
}


class gameObj {
  constructor(word){
    this.word = word;
    this.status = 'continue';
    this.guessedLetters = [];  //track guessed letters
    this.remainingGuesses = (word.length < 6) ? 6 : word.length;
    //this.remainingLetters = [];  //track remaining letters // initialize by split words (?)
    this.puzzle = []; 
    console.log(`test`);
    word.split('').forEach( letter => {      
      this.puzzle.push(new puzzleLetter(letter));
    })
  }

  hasLetter(userInput) {return (this.puzzle.find( element => element.letter === userInput) === undefined) ? false : true;}  

  updatePuzzle(userInput){
    //set guessed true for each matched letter in puzzle
    this.puzzle.forEach(element => {
      if(element.letter === userInput) element.guessed = true;
    });
    //check if puzzle is solved, update game status
    if (this.puzzle.findIndex (element => element.guessed === false) === -1) this.status = 'won';
  }

  recordGuess(userInput){

    //NOTE: Do not decrement if guess is a match
    //decrement guessedCount
    if (! this.hasLetter(userInput)) this.remainingGuesses += -1;
    //add to guessed letters
    this.guessedLetters.push(userInput);  
    this.guessedLetters.sort();
    //check if player is ot of guesses, update game status    
    if (this.remainingGuesses === 0) this.status = 'lost';
  }

  isValidInput(userInput){
    return ( userInput.length === 1  && userInput.match(/[a-z]/i) && !this.guessedLetters.includes(userInput) );
  }
};

//represents each letter of puzzle
class puzzleLetter {
  constructor(letter){
    //letter
    this.letter = letter;
    //true if the user has guessed the letter
    this.guessed = false;
  }
};

//runs the gamee
function run() {
  //beginning of game messaging
  console.log(`'Welcome to Snowman!\n-----------`);

  //loop until game is over: win | lose
  while (game.status === 'continue'){
    updateUser();
    //get user input
    let userInput = readline.question("Guess a letter: ");
    userInput = userInput.toLocaleLowerCase();

    //NOTE: TO DO: INPUT VALIDATION
    //loop until validate input is received
    while( !(game.isValidInput(userInput)) ){
      //console.log(userInput + `is not a valid guess`)
      userInput = readline.question(`Invalid guess. \nBe sure your guess is a letter that you have not guessed before.\n\nGuess a letter: `);
      userInput = userInput.toLocaleLowerCase();
    }
      //if invalid, "Please to enter a letter" && do not increment guess count.

    //update counter and save guessed letter 
    game.recordGuess(userInput);
    
    //is letter in puzzle, if yes set value to true for each key / value
    if (game.hasLetter) game.updatePuzzle(userInput);       
  }
  updateUser();
  //end of game messaging: win | lose
  if (game.status === 'won') console.log(`Winner! You took ${game.guessedLetters.length} guesses`); 
  if (game.status === 'lost') console.log(`You lost, so sad! \nThe word was: ${game.word}`); //
}

//writes game status to console
const updateUser = () => {
  let lineOne = `\nRemaining Incorrect Guesses: ${game.remainingGuesses}\n`;
  let lineTwo = `Letters Guessed: ${game.guessedLetters.join(`,`)}\n`;
  let puzzleRendering = [];
  game.puzzle.forEach( element => {    
    (element.guessed) ? puzzleRendering.push(element.letter) : puzzleRendering.push(`_`);
  });
  let lineThree = `Word: ${puzzleRendering.join(' ')}`;
  console.log(lineOne + lineTwo + lineThree +`\n`);
};

//create a new game obj
const game = new gameObj(getRandomWord());

//run the game
run();

