import { WORDS } from "./words.js";

//board dimension
var height = 6;
var width = 5;
// player position starting at [0,0]
var row = 0;
var col = 0;

var gameOver = false;
//getting random word from array in other script file
var word = WORDS[Math.floor(Math.random() * WORDS.length)].toUpperCase();

window.onload = function(){
    initialize();
}

function initialize() {
    //create board
    for(let r = 0; r < height; r++){
        for(let c = 0; c < width; c++){
            //creating spans for each box with id of form "#-#"
            let box = document.createElement("span");
            box.id = r.toString() + "-" + c.toString();
            box.classList.add("box");
            box.innerText = "";
            document.getElementById("board").appendChild(box);
        }
    }

    //event listening for key press
    document.addEventListener("keyup", (e) => {
        if(gameOver) return;

        //checking for valid alphabetical input
        if("KeyA" <= e.code && e.code <= "KeyZ" ){
            //user can input letters until end of row
            if(col < width){
                let currentBox = document.getElementById(row.toString() + '-' + col.toString());
                if(currentBox.innerText == ""){
                    currentBox.innerText = e.code[3];
                    col += 1;
                }
            }
        }
        //let user hit back space to go back a column and delete the letter
        else if (e.code == "Backspace"){
            if (0 < col && col <= width) {
                col -=1;
                let currentBox = document.getElementById(row.toString() + '-' + col.toString());
                currentBox.innerText = "";
                document.getElementById("answer").innerText = "";
            }
        }
        //user finalizes input
        else if (col == width && e.code == "Enter"){
            let inputWord = "";
           
            for(let c = 0; c < width; c++){
                let currentBox = document.getElementById(row.toString() + '-' + c.toString());
                inputWord += currentBox.innerText;
            }
            // check if user input is valid
            if(WORDS.includes(inputWord.toLowerCase())){
                update();
            } else{
                document.getElementById("answer").innerText = "invalid word";
            }

        }

        if(!gameOver && row == height){
            gameOver = true;
            document.getElementById("answer").innerText = word;
        }
    })
}

//this function analyzes the user's input for that row
function update(){
    let correct = 0;
    let letterCount = {}; //dictionary to keep track of letter count
    for (let i = 0; i < word.length; i++){
        let letter = word[i];
        if(letterCount[letter]) {
            letterCount[letter] += 1;
        } else{
            letterCount[letter] = 1;
        }
    }

    //First check if letter is equal and in same position
    for (let c = 0; c < width; c++){
        let currentBox = document.getElementById(row.toString() + '-' + c.toString());
        let letter = currentBox.innerText;

        //letter is in the same position
        if(word[c] == letter) {
            currentBox.classList.add("correct");
            correct += 1;

            letterCount[letter] -= 1;
        }

        // user guesses word correctly
        if(correct == width){
            document.getElementById("answer").innerText = "You got it!";
            gameOver = true;
        }
    }

    
    for (let c = 0; c < width; c++){
        let currentBox = document.getElementById(row.toString() + '-' + c.toString());
        let letter = currentBox.innerText;
        if(!currentBox.classList.contains("correct")){
        // now checking for if letter is somewhere in word
         if (word.includes(letter)){
            if(letterCount[letter] > 0){
            currentBox.classList.add("present");
            letterCount[letter] -= 1;
            } else{
            currentBox.classList.add("incorrect");
            }
        } //letter not in correct posititon and not in word
        else{
            currentBox.classList.add("incorrect");
        }
        }
        
    }
    row += 1; //move to next row
    col = 0; //get back to 0 column
}