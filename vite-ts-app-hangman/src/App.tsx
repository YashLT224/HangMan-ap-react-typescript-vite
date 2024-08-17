import { useCallback, useEffect, useState } from "react";
import { HangManKeyBoard } from "./HangmanKeyboard";
import { HangManDrawing } from "./hangManDrawing";
import { HangManWord } from "./hangmanWord";
import words from "./wordList.json";
import "./App.css";

function getWord() {
  return words[Math.floor(Math.random() * words.length)];
}
function App() {
  const [wordToGuess] = useState(getWord);
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const inCorrectLetters = guessedLetters.filter(
    (letter) => !wordToGuess.includes(letter)
  );

  console.log(wordToGuess, guessedLetters);
  const isLoser = inCorrectLetters.length >= 6;
  const isWinner = wordToGuess
    .split("")
    .every((letter) => guessedLetters.includes(letter));
  const addGuessedLetter = useCallback(
    (letter: string) => {
      if (guessedLetters.includes(letter)||isLoser||isWinner) return;

      setGuessedLetters((currentletter) => [...currentletter, letter]);
    },
    [guessedLetters,isLoser,isWinner]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key;
      if (!key.match(/^[a-z]$/)) return;
      e.preventDefault();
      addGuessedLetter(key);
    };

    document.addEventListener("keypress", handler);

    return () => {
      document.removeEventListener("keypress", handler);
    };
  }, [guessedLetters]);


  return (
    <div
      style={{
        maxWidth: "800px",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        margin: "0 auto",
        alignItems: "center",
      }}
    >
      <div style={{ fontSize: "2rem", textAlign: "center" }}>
        {isWinner && "Winner!= Refresh to try again"}
        {isLoser && "Nice Try!= Refresh to try again"}
      </div>
      <HangManDrawing numberOfGuesses={inCorrectLetters.length} />
      <HangManWord reveal={isLoser} guessedLetters={guessedLetters} wordToGuess={wordToGuess} />
      <div style={{ alignSelf: "stretch" }}>
        {" "}
        <HangManKeyBoard
        disabled={isWinner||isLoser}
          activeLetters={guessedLetters.filter((letter) =>
            wordToGuess.includes(letter)
          )}
          inactiveLetters={inCorrectLetters}
          addGuessedLetter={addGuessedLetter}
        />
      </div>
    </div>
  );
}

export default App;
