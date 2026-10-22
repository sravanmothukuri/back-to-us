import React, { memo } from "react";
import "./FloatingSymbols.css"; // Ensure the CSS file is imported

const FloatingSymbols = memo(() => {
  const symbols = Array(30).fill("♡"); // Generates 30 heart symbols

  // Function to generate random styles for each symbol
  const generateRandomStyles = () => {
    const randomX = Math.random() * 100; // Random X position
    const randomDelay = Math.random() * 5; // Random animation delay
    const randomDuration = Math.random() * 5 + 5; // Animation duration between 5-10 seconds
    const randomScale = Math.random() * 0.5 + 0.5; // Scale between 0.5x to 1x

    return {
      left: `${randomX}%`, // Random X position
      animationDelay: `${randomDelay}s`, // Random animation delay
      animationDuration: `${randomDuration}s`, // Random animation duration
      transform: `scale(${randomScale})`, // Random scale
    };
  };

  return (
    <div className="floating-container">
      {symbols.map((symbol, index) => (
        <span
          key={index}
          className="floating-symbol"
          style={generateRandomStyles()} // Apply random styles to each symbol
        >
          {symbol}
        </span>
      ))}
    </div>
  );
});

export default FloatingSymbols;
