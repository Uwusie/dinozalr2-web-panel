import React, { useState } from "react";
import "./style.scss";

interface Slice {
  name: string;
  percent: string;
  color: string;
}

function WheelOfFortune() {
  const [slices, setSlices] = useState<Slice[]>([]);

  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  const generatePaths = () => {
    let cumulativePercent = 0;
    let pathId = 0;

    return slices.map((slice) => {
      const percent = parseFloat(slice.percent) / 100;
      if (isNaN(percent) || percent < 0 || percent > 1) {
        return null; // Skip invalid slices
      }

      const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
      cumulativePercent += percent;
      const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
      const largeArcFlag = percent > 0.5 ? 1 : 0;

      const pathData = `M ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY} L 0 0`;

      return (
        <>
          <path key={pathId++} d={pathData} fill={slice.color} />;
        </>
      );
    });
  };

  const handlePercentChange = (index: number, newValue: string) => {
    setSlices((prevSlices) =>
      prevSlices.map((slice, i) =>
        i === index ? { ...slice, percent: newValue } : slice
      )
    );
  };
  const handleColorChange = (index: number, newValue: string) => {
    setSlices((prevSlices) =>
      prevSlices.map((slice, i) =>
        i === index ? { ...slice, color: newValue } : slice
      )
    );
  };

  const addSlice = () => {
    setSlices((prev) => [
      ...prev,
      { name: "test", percent: "10%", color: "red" },
    ]);
  };

  return (
    <div className="wheelOfFortune-wrapper">
      <div className="wheelOfFortune-wheel">
        {slices.length <= 0 ? (
          <>Empty</>
        ) : (
          <svg
            height="500"
            width="500"
            viewBox="-1 -1 2 2"
            style={{ transform: "rotate(-90deg)" }}
          >
            {generatePaths()}
          </svg>
        )}
      </div>
      <div className="inputsWrapper">
        {slices.map((slice, index) => (
          <div className="singleInputWrapper" key={index}>
            <input value={slice.name} readOnly />
            :
            <input
              value={slice.percent}
              onChange={(e) => handlePercentChange(index, e.target.value)}
            />
            :
            <input
              value={slice.color}
              onChange={(e) => handleColorChange(index, e.target.value)}
            />
          </div>
        ))}

        <button onClick={addSlice}>+</button>
      </div>
    </div>
  );
}

export default WheelOfFortune;
