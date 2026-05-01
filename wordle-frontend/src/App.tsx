import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";


function App() {
  type BoxColorsResponse = {
  colors: ("green" | "gray" | "yellow")[];
  };

  type Cell = {
    letter: string;
    color: "green" | "gray" | "yellow";
  };

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
      
    </>
  );
}

export default App;