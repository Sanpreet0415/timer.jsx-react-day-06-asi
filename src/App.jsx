import React, { useState, useRef, useEffect } from 'react';
import './Timer.css'; // Ensure to create this CSS file for styling

const App = () => {
  const [time, setTime] = useState(0); // Time in seconds
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);
  const inputRef = useRef(null);
  const progressBarRef = useRef(null);
  const messageRef = useRef(null);

  useEffect(() => {
    if (isActive && !isPaused) {
      timerRef.current = setInterval(() => {
        setTime(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            messageRef.current.textContent = "Time's up!";
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (isPaused) {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current); // Cleanup interval on unmount
  }, [isActive, isPaused]);

  const startTimer = () => {
    setIsActive(true);
    setIsPaused(false);
    messageRef.current.textContent = ''; // Clear message
  };

  const pauseTimer = () => {
    setIsPaused(true);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    setTime(parseInt(inputRef.current.value) || 0);
    messageRef.current.textContent = '';
  };

  const handleInputChange = (e) => {
    const newDuration = parseInt(e.target.value) || 0;
    if (!isActive) {
      setTime(newDuration);
      progressBarRef.current.style.width = '100%';
    }
  };

  useEffect(() => {
    if (time > 0) {
      progressBarRef.current.style.width = `${(time / (inputRef.current.value || 1)) * 100}%`;
      document.body.style.backgroundColor = time < 10 ? 'red' : 'white';
    }
  }, [time]);

  return (
    <div className="timer-container">
      <input
        type="number"
        ref={inputRef}
        onChange={handleInputChange}
        placeholder="Set duration in seconds"
      />
      <div className="timer-controls">
        <button onClick={startTimer}>Start</button>
        <button onClick={pauseTimer}>Pause</button>
        <button onClick={resetTimer}>Reset</button>
      </div>
      <div className="progress-bar-container">
        <div
          className="progress-bar"
          ref={progressBarRef}
        />
      </div>
      <div className="time-display">
        {Math.floor(time / 60)}:{('0' + (time % 60)).slice(-2)}
      </div>
      <div className="message" ref={messageRef}></div>
    </div>
  );
};

export default App;
