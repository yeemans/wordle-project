type KeyboardProps = {
  onKeyPress: (key: string) => void;
};

const KEYBOARD_ROWS = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["enter", "z", "x", "c", "v", "b", "n", "m", "backspace"],
];

export default function Keyboard({ onKeyPress }: KeyboardProps) {
  return (
    <div className="keyboard">
      {KEYBOARD_ROWS.map((row, i) => (
        <div key={i} className="keyboard-row">
          {row.map((key) => (
            <button
              key={key}
              className={`key ${
                key === "enter" || key === "backspace" ? "wide" : ""
              }`}
              onClick={() => onKeyPress(key)}
            >
              {key === "backspace" ? "⌫" : key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}