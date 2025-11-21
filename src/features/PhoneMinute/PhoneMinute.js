// PhoneMinute.js
import React, { useState, useEffect, useRef } from 'react';
import './PhoneMinute.css';

export default function PhoneMinute() {
  const MAX_PAIRS = 4; // 4 pairs for the phone number
  const [phonePairs, setPhonePairs] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState({ text: '', type: '', show: false });
  const [currentMinute, setCurrentMinute] = useState(0);
  const inputRef = useRef(null);

  // Update current minute every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentMinute(now.getUTCMinutes());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const showMessage = (text, type = 'info') => {
    setMessage({ text, type, show: true });
    setTimeout(
      () => setMessage(prev => ({ ...prev, show: false })),
      3000
    );
  };

  const handleInputChange = (e) => {
    // Accept only two digits per pair
    setInputValue(e.target.value.replace(/\D/g, '').slice(0, 2));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') validatePair();
  };

  const validatePair = () => {
    if (inputValue.length !== 2) {
      return showMessage('⚠️ Enter exactly two digits for each pair', 'error');
    }

    const pairNumber = parseInt(inputValue, 10);

    if (pairNumber === currentMinute) {
      // Correct pair
      const newPairs = [...phonePairs, inputValue];
      setPhonePairs(newPairs);
      setInputValue('');
      inputRef.current?.focus();

      if (newPairs.length === MAX_PAIRS) {
        showMessage(
          '🎉 Phone number completed: ' + newPairs.join(''),
          'success'
        );
        inputRef.current.disabled = true;
      } else {
        showMessage(
          `✓ Pair ${newPairs.length}/${MAX_PAIRS} accepted`,
          'success'
        );
      }
    } else {
      // Incorrect pair
      setInputValue('');
      inputRef.current?.focus();
      showMessage(
        `✗ Incorrect! Pair must match the current minute (${String(currentMinute).padStart(2, '0')})`,
        'error'
      );
    }
  };

  const resetPhone = () => {
    setPhonePairs([]);
    setInputValue('');
    inputRef.current.disabled = false;
    inputRef.current?.focus();
    showMessage('🔄 Reset! Start again.', 'success');
  };

  return (
    <div className="phone-minute-container">

      <div className="phone-pairs">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className={`phone-pair ${phonePairs[index] ? 'active' : ''}`}
          >
            {phonePairs[index] || '--'}
          </div>
        ))}
      </div>

      <div className="input-container">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          maxLength={2}
          placeholder="00"
        />
        <button onClick={validatePair}>Check</button>
        <button onClick={resetPhone}>Reset</button>
      </div>

      {message.show && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

    </div>
  );
}