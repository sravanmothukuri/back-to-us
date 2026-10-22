import React, { useState, useEffect } from "react";
import "./RectangleText.css";

const RectangleText = ({ messages, onYes, onNo, showYesNo }) => {
  const [currentMessage, setCurrentMessage] = useState(0);

  // This will change the text when Enter is pressed
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Enter" && !showYesNo) {
        setCurrentMessage((prev) => Math.min(prev + 1, messages.length - 1));  // Go to next message
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [messages.length, showYesNo]);

  return (
    <div className="rectangle">
      <div className="emoji">✨</div> {/* Display the emoji at the top */}
      <p>{messages[currentMessage]}</p>

      {/* Render Yes/No buttons only when showYesNo is true and we're on the last message */}
      {showYesNo && currentMessage === messages.length - 1 && (
        <div className="button-container">
          <button className="yes-button" onClick={onYes}>Yes</button>
          <button className="no-button" onClick={onNo}>No</button>
        </div>
      )}
    </div>
  );
};

export default RectangleText;
