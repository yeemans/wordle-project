import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";

type BoxColorsResponse = {
  // adjust this based on your Flask API response
  colors?: string[];
  word?: string;
};

function App() {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const sendData = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/get-box-colors", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            word: "crane",
          }),
        });

        const data: BoxColorsResponse = await res.json();
        console.log(data);
      } catch (error) {
        console.error("Error fetching box colors:", error);
      }
    };

    sendData();
  }, []);

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>

        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
          </p>
        </div>

        <button
          type="button"
          className="counter"
          onClick={() => setCount((c: number) => c + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <h2>Documentation</h2>
        </div>

        <div id="social">
          <h2>Connect with us</h2>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  );
}

export default App;