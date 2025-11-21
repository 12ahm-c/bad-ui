import React, { useState } from "react";
import "./BinaryName.css";

export default function BinaryName({ onChange }) {
  const [binaryInput, setBinaryInput] = useState("");
  const [finalName, setFinalName] = useState("");

  const handleBinaryAdd = (val) => {
    let b = binaryInput + val;

    if (b.length < 8) {
      setBinaryInput(b);
      return;
    }

    let char = String.fromCharCode(parseInt(b, 2));
    const newName = finalName + char;
    setFinalName(newName);
    setBinaryInput("");

    if (onChange) onChange(newName);
  };

  return (
    <div className="binary-name-wrapper">
      <div className="binary-display">
        <div className="binary-box">{binaryInput || "••••••••"}</div>
      </div>

      <div className="binary-buttons">
        <button onClick={() => handleBinaryAdd("0")}>0</button>
        <button onClick={() => handleBinaryAdd("1")}>1</button>
      </div>

      <div className="result">{finalName || "—"}</div>
    </div>
  );
}