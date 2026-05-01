import { useState, useEffect } from "react"
import Grid from "./Grid.tsx"
import "./App.css"
import Keyboard from "./Keyboard.tsx"


function App() {
  type GameStatus = "won" | "lost" | "continuing"
  type BoxColorsResponse = {
    valid: Boolean
    box_colors: ("green" | "gray" | "yellow")[]
  }

  type Cell = {
    letter: string
    status: "green" | "gray" | "yellow" | ""
  }

  const ROWS = 6
  const COLS = 5
  const [currentRow, setCurrentRow] = useState(0)
  const [currentCol, setCurrentCol] = useState(0)

  const [gameStatus, setGameStatus] = useState<GameStatus>("continuing")

  const [grid, setGrid] = useState<Cell[][]>(
    Array.from({ length: ROWS }, () =>
      Array.from({ length: COLS }, () => ({ letter: "", status: "" }))
    )
  )
  const [gameId, setGameId] = useState<string | null>(null);

  // get gameId when game starts
  useEffect(() => {
    const startGame = async () => {
      const res = await fetch("https://wordle-project-jp7x.onrender.com/new-game", {
        method: "POST",
      });

      const data = await res.json();
      setGameId(data.game_id);
    };

    startGame();
  }, []);

  const getBoxColors = async (word: string): Promise<BoxColorsResponse> => {
    const res = await fetch("https://wordle-project-jp7x.onrender.com/get-box-colors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ "word": word, "game_id": gameId }),
    })

    return res.json()
  }
  const handleKey = async (key: string) => {
    if (gameStatus !== "continuing") return;

    // BACKSPACE
    if (key === "backspace") {
      if (currentCol === 0) return;

      const newGrid = grid.map(r => [...r]);
      newGrid[currentRow][currentCol - 1] = { letter: "", status: "" };

      setGrid(newGrid);
      setCurrentCol(c => c - 1);
      return;
    }

    // ENTER
    if (key === "enter") {
      if (currentCol < COLS) return;

      const guess = grid[currentRow].map(c => c.letter).join("");

      try {
        const data = await getBoxColors(guess);

        if (!data.valid) {
          alert("Invalid word");
          return;
        }

        const newGrid = grid.map(r => [...r]);

        newGrid[currentRow] = newGrid[currentRow].map((cell, i) => ({
          ...cell,
          status: data.box_colors[i],
        }));

        setGrid(newGrid);

        const newStatus = getGameStatus(data.box_colors, currentRow + 1);
        setGameStatus(newStatus);

        setCurrentRow(r => r + 1);
        setCurrentCol(0);
      } catch (error) {
        console.error("API error:", error);
      }

      return;
    }

    // LETTERS
    if (key.length === 1 && key >= "a" && key <= "z") {
      if (currentCol >= COLS) return;

      const newGrid = grid.map(r => [...r]);
      newGrid[currentRow][currentCol] = {
        letter: key,
        status: "",
      };

      setGrid(newGrid);
      setCurrentCol(c => c + 1);
    }
  }

  // this extracts the input from a keypress, like "a" or "enter"
  const handleKeyPress = async (e: KeyboardEvent) => { 
    const key = e.key.toLowerCase()
    handleKey(key)
  }

  // this useEffect tells the user when they have won and lost
  useEffect(() => {
    const handleGameStatus = async () => {
      const answerResponse = await fetch("https://wordle-project-jp7x.onrender.com/get-answer", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      })

      if (gameStatus === "won") alert("Hooray! You won!")
      if (gameStatus === "lost") {
        const answerJson = await answerResponse.json()
        alert(`Try again next time. Today's word was ${answerJson.answer}`)
      }
    }

    handleGameStatus()
  }, [gameStatus])

  useEffect(() => {
    if (gameStatus === "won") return
    window.addEventListener("keydown", handleKeyPress)
    // cleanup
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [grid, currentRow, currentCol, gameStatus])

  const getGameStatus = function (box_colors: string[], row_index: number): GameStatus {
    // check if user has won
    const allGreen = box_colors.every(value => value === "green")
    if (allGreen) return "won"
    if (row_index == ROWS) return "lost"
    return "continuing"
  }

  return (
    <>
      <h1>Wordle</h1>
      <Grid grid={grid} />
      <Keyboard onKeyPress={handleKey} />
    </>
  )
}

export default App