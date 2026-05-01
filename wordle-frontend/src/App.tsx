import { useState, useEffect } from "react";
import Grid from "./Grid.tsx";
import "./App.css";


function App() {
  const ROWS = 6;
  const COLS = 5;
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);

  type BoxColorsResponse = {
    box_colors: ("green" | "gray" | "yellow")[];
  };

  type Cell = {
    letter: string;
    status: "green" | "gray" | "yellow" | "";
  };

  const [grid, setGrid] = useState<Cell[][]>(
    Array.from({ length: ROWS }, () =>
      Array.from({ length: COLS }, () => ({ letter: "", status: "" }))
    )
  );

  const getBoxColors = async (word: string): Promise<BoxColorsResponse> => {
    const res = await fetch("http://127.0.0.1:5000/get-box-colors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ word }),
    });

    return res.json();
  };

  useEffect(() => {
    const handleKey = async (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      // backspace
      if (key === "backspace") {
        if (currentCol === 0) return;

        // copy grid, modify copied grid, then setGrid
        const newGrid = grid.map(r => [...r]);
        newGrid[currentRow][currentCol - 1] = { letter: "", status: "" };

        setGrid(newGrid);
        setCurrentCol(c => c - 1);
        return;
      }

      // submit guess
      if (key === "enter") {
        if (currentCol < COLS) return;

        const guess = grid[currentRow].map(c => c.letter).join("");

        try {

          const data = await getBoxColors(guess);
          console.log(data);
          const newGrid = grid.map(r => [...r]);

          newGrid[currentRow] = newGrid[currentRow].map((cell, i) => ({
            ...cell,
            status: data.box_colors[i],
          }));

          setGrid(newGrid);
          setCurrentRow(r => r + 1); // move to next row
          setCurrentCol(0);
        } catch (error) {
          console.error("API error:", error);
        }
        return;
      }

      // typing letters
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
    };

    window.addEventListener("keydown", handleKey);
    // cleanup
    return () => window.removeEventListener("keydown", handleKey);
  }, [grid, currentRow, currentCol]);

  return (
    <>
      <h1>Wordle</h1>
      <Grid grid={grid} />
    </>
  );
}

export default App;