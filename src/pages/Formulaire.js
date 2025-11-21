import React, { useState } from "react";
import BinaryName from "../features/BinaryName/BinaryName";
import EmailEscapePage from "../features/EmailEscape/pages/EmailEscapePage";
import PhoneMinute from "../features/PhoneMinute/PhoneMinute";
import DateWheel from "../features/DateWheel/DateWheel";
import "./Formulaire.css";

export default function Formulaire() {
  const [showDateWheel, setShowDateWheel] = useState(false);
  const [message, setMessage] = useState("");

  const handleDateToggle = () => setShowDateWheel(!showDateWheel);
  const handleSubmit = () => setMessage("Registration successful ✅");

  return (
    <div className="form-container">
      <h2>Registration Form</h2>
      <p>Please fill in all required fields</p>

      {/* Username in binary */}
      <h3>Binary Username</h3>
      <BinaryName />

      {/* Email */}
      <h3>Email</h3>
      <EmailEscapePage />

      {/* Phone number */}
      <h3>Phone Number</h3>
      <PhoneMinute horizontal />

      {/* Date of birth */}
      <h3>Date of Birth</h3>
      <button
        className={`toggle-date-btn ${showDateWheel ? "active" : ""}`}
        onClick={handleDateToggle}
      >
        {showDateWheel ? "Hide Wheel" : "Show Wheel"}
      </button>

      {showDateWheel && <DateWheel />}

      {/* Submit button */}
      <button className="submit-btn" onClick={handleSubmit}>
        Register
      </button>

      {message && <p className="success-msg">{message}</p>}
    </div>
  );
}