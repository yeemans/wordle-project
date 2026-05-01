type Cell = {
  letter: string;
  status: "green" | "yellow" | "gray" | "";
};

type Props = {
  grid: Cell[][];
};

export default function Grid({ grid }: Props) {
  return (
    <div className="grid">
      {grid.map((row, i) => (
        <div key={i} className="row">
          {row.map((cell, j) => (
            <div key={j} className={`cell ${cell.status}`}>
              {cell.letter}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}