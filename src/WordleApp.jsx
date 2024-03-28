import Board from "./Board";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { randomWord } from "./wordList";
import PopUps from "./PopUps";

function WordleApp() {
  const [answer, setAnswer] = useState(randomWord().split(""));
  const [greenSet, setGreenSet] = useState(new Set());
  const [yellowSet, setYellowSet] = useState(new Set());
  const [greySet, setGreySet] = useState(new Set());
  const [keyboard, setKeyboard] = useState([
    {
      string: "qwertyuiop".split(""),
      colors: new Array(10).fill("light-grey"),
    },
    {
      string: "asdfghjkl".split(""),
      colors: new Array(9).fill("light-grey"),
    },
    {
      string: "zxcvbnm".split(""),
      colors: new Array(9).fill("light-grey"),
    },
  ]);
  const [guesses, setGuesses] = useState(
    new Array(6).fill({
      string: new Array(5).fill(" "),
      colors: new Array(5).fill("light-grey"),
    })
  );
  const [numGuess, setNumGuess] = useState(0);
  const [invalidMessage, setInvalidMessage] = useState(null);
  const [resultMessage, setResultMessage] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);
  const [winCount, setWinCount] = useState(
    JSON.parse(localStorage.getItem("winCount")) || 0
  );
  const [loseCount, setLoseCount] = useState(
    JSON.parse(localStorage.getItem("loseCount")) || 0
  );
  const [winsTracker, setWinsTracker] = useState(
    JSON.parse(localStorage.getItem("winsTracker")) || new Array(6).fill(0)
  );
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [isDirectionOpen, setIsDirectionOpen] = useState(false);

  ////////////////

  useEffect(() => {
    document.addEventListener("keydown", keyHandler);
    return () => {
      document.removeEventListener("keydown", keyHandler);
    };
  });

  const keyHandler = (evt) => {
    const { keyCode } = evt;
    if (keyCode <= 90 && keyCode >= 60) {
      handleGuess(evt);
    } else if (keyCode === 8) {
      handleDelete();
    } else if (keyCode === 13) {
      handleSubmit();
    }
  };
  // when ANY KEY is pressed, run handle guess -> this is not a submit
  const handleGuess = (e) => {
    if (invalidMessage) {
      setInvalidMessage(null);
    } //if invalid message, once they start typing a new answer, remove message
    let targetLetter = e.type === "click" ? e.target.value : e.key;
    let newGuesses = guesses.map((guess, index) => {
      if (numGuess === index) {
        let guessIndex = guess.string.indexOf(" ");
        let currGuess = guess.string.map((char, index) => {
          if (guessIndex === index) {
            return targetLetter;
          } else {
            return char;
          }
        });
        return { ...guess, string: currGuess };
      } else {
        return guess;
      }
    });
    setGuesses(newGuesses);
  };

  const handleDelete = () => {
    setInvalidMessage(null);
    let currGuess = guesses[numGuess].string;
    let indexTargetChar =
      currGuess.indexOf(" ") === -1
        ? currGuess.length - 1
        : currGuess.indexOf(" ") - 1;
    let updatedGuess = currGuess.map((char, index) => {
      if (index === indexTargetChar) {
        return " ";
      } else {
        return char;
      }
    });
    let updatedGuesses = guesses.map((guess, index) => {
      if (index === numGuess) {
        return { ...guess, string: updatedGuess };
      } else {
        return guess;
      }
    });
    setGuesses(updatedGuesses);
  };
  // when they click submit, first check to see if word is valid and/or correct length.
  const handleSubmit = async () => {
    let word = guesses[numGuess].string.join("");
    if (word.trim().length === 5) {
      //if word is 5 letter, check it to dictionary, if it is valid word, submit guess
      try {
        const response = await axios.get(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
        );
        submitGuess();
      } catch {
        // if not valid word, set invalid message, no submit
        setInvalidMessage("Invalid word");
      }
    } else {
      // if not 5 letters, set invalid message, no submit
      setInvalidMessage("Too short");
    }
  };

  const submitGuess = () => {
    let colorsArr = new Array(5).fill(" "); //["","","","","",]
    let copyAnswer = [...answer]; //["v","o","t","e","r",]
    // guesses-> [{colors,guesssArr},{},{},{},{}] // guesses[numguess] => {color,stringArr} guesses[numguess].string -> ["g","r", "e", "a", "t"]
    let copyGuess = guesses[numGuess].string.map((char, index) => {
      //on first guess, num guess is 0, guesses[0]
      if (char === copyAnswer[index]) {
        colorsArr[index] = "green"; //set color of that chars index to green
        copyAnswer[index] = null; //nullify the letter in the answer array so it cannot be compared to anymore
        setGreenSet(greenSet.add(char)); //add the character to the green set
        return null; // return null so it wont be checked for yellow
      } else {
        return char; // if not green, return char to same index in copyGuess so it can be checked for yellow
      }
    });

    copyGuess.map((char, index) => {
      //copyGuess is now the guess string array but all green letter(corerct letters) have been removed and replaced with null
      if (char) {
        //not if null
        if (copyAnswer.indexOf(char) !== -1) {
          //if char is in copy answer...
          colorsArr[index] = "yellow"; //add yellow to that index in colors arr
          setYellowSet(yellowSet.add(char)); //add to yellow set
          copyAnswer[copyAnswer.indexOf(char)] = null; //nullify the yellow letter in answer so cannot be compared anymore.
        } else {
          colorsArr[index] = "dark-grey";
          setGreySet(greySet.add(char));
        }
      }
    });

    let newGuesses = guesses.map((guess, index) => {
      //guesses is [{color, string},{color string},{},{},{},]
      if (index === numGuess) {
        //
        return { ...guess, colors: colorsArr };
      } else {
        return guess;
      }
    });

    let updatedKeyboard = keyboard.map((row, index) => {
      console.log(row);
      console.log(index);
      let newColorsArray = row.colors;
      for (let i = 0; i < row.string.length; i++) {
        if (index === 2) {
          if (greenSet.has(row.string[i])) {
            newColorsArray[i + 1] = "green";
          } else if (yellowSet.has(row.string[i])) {
            newColorsArray[i + 1] = "yellow";
          } else if (greySet.has(row.string[i])) {
            newColorsArray[i + 1] = "dark-grey";
          }
        } else if (greenSet.has(row.string[i])) {
          newColorsArray[i] = "green";
        } else if (yellowSet.has(row.string[i])) {
          newColorsArray[i] = "yellow";
        } else if (greySet.has(row.string[i])) {
          newColorsArray[i] = "dark-grey";
        }
      }

      return { ...row, colors: newColorsArray };
    });

    setGuesses(newGuesses);
    setKeyboard(updatedKeyboard);

    if (checkGameOver() === false) {
      setNumGuess(numGuess + 1);
    }
  };

  const checkGameOver = () => {
    if (guesses[numGuess].string.join("") === answer.join("")) {
      setResultMessage("YOU WIN");
      setIsGameOver(true);
      setIsPopUpOpen(true);
      localStorage.setItem("winCount", JSON.stringify(winCount + 1));
      setWinCount(winCount + 1);
      const nextTracker = winsTracker.map((count, index) => {
        if (index === numGuess) {
          return count + 1;
        } else {
          return count;
        }
      });
      localStorage.setItem("winsTracker", JSON.stringify(nextTracker));
      setWinsTracker(nextTracker);
      return true;
    } else if (numGuess + 1 === 6) {
      setResultMessage("YOU LOSE");
      setIsGameOver(true);
      setIsPopUpOpen(true);
      setLoseCount(loseCount + 1);
      localStorage.setItem("loseCount", JSON.stringify(loseCount + 1));
      return true;
    } else {
      return false;
    }
  };

  const reset = () => {
    setAnswer(randomWord().split(""));
    setGreenSet(new Set());
    setYellowSet(new Set());
    setGreySet(new Set());
    setKeyboard([
      {
        string: "qwertyuiop".split(""),
        colors: new Array(10).fill("light-grey"),
      },
      {
        string: "asdfghjkl".split(""),
        colors: new Array(9).fill("light-grey"),
      },
      {
        string: "zxcvbnm".split(""),
        colors: new Array(9).fill("light-grey"),
      },
    ]);
    setGuesses(
      new Array(6).fill({
        string: new Array(5).fill(" "),
        colors: new Array(5).fill("light-grey"),
      })
    );
    setNumGuess(0);
    setInvalidMessage(null);
    setResultMessage("");
    setIsGameOver(false);
    setIsPopUpOpen(false);
  };

  return (
    <div className="wordle-app">
      <h1>Wordle</h1>
      <div className="info-stats-header-buttons">
        {!isPopUpOpen && isGameOver && (
          <button onClick={reset} className="reset-button">
            New Game
          </button>
        )}
        <button
          onClick={() => {
            setIsDirectionOpen(!isDirectionOpen);
          }}
        >
          i
        </button>
        <button onClick={() => setIsPopUpOpen(!isPopUpOpen)}>s</button>
      </div>
      <PopUps
        isDirectionOpen={isDirectionOpen}
        setIsDirectionOpen={setIsDirectionOpen}
        isPopUpOpen={isPopUpOpen}
        isGameOver={isGameOver}
        setIsPopUpOpen={setIsPopUpOpen}
        winCount={winCount}
        loseCount={loseCount}
        reset={reset}
        invalidMessage={invalidMessage}
        resultMessage={resultMessage}
        answer={answer}
        winsTracker={winsTracker}
      />

      <div className="gameBoard">
        <Board arrayOfStringObjects={guesses} boardType="gameBoard" />
      </div>
      <div className="keyBoard">
        <Board
          arrayOfStringObjects={keyboard}
          boardType="keyBoard"
          handleClick={handleGuess}
          handleDelete={handleDelete}
          handleSubmit={handleSubmit}
          disabled={isGameOver}
        />
      </div>
    </div>
  );
}

export default WordleApp;
