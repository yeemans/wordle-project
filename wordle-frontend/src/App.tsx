import { useState, useEffect } from "react";
import Grid from "./Grid.tsx";
import "./App.css";


function App() {
  const ROWS = 6;
  const COLS = 5;
  type BoxColorsResponse = {
  colors: ("green" | "gray" | "yellow")[];
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

  return (
    <>
      <h1>Wordle</h1>
      <Grid grid={grid} />
    </>
  );
}

export default App;