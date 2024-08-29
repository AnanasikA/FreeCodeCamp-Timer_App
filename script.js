const { useState, useEffect } = React;

const App = () => {
    const [sessionLength, setSessionLength] = useState(25);
    const [breakLength, setBreakLength] = useState(5);
    const [timeLeft, setTimeLeft] = useState(sessionLength * 60);
    const [isSession, setIsSession] = useState(true);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        if (isRunning) {
            const interval = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev === 0) { // Timer reaches zero
                        const beep = document.getElementById('beep');
                        if (beep) {
                            beep.currentTime = 0; // Reset sound to the beginning
                            beep.play(); // Play sound
                        }
                        if (isSession) {
                            setIsSession(false);
                            return breakLength * 60; // Switch to break time
                        } else {
                            setIsSession(true);
                            return sessionLength * 60; // Switch to session time
                        }
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [isRunning, breakLength, sessionLength, isSession]);

    useEffect(() => {
        setTimeLeft(sessionLength * 60);
    }, [sessionLength]);

    const handleStartStop = () => setIsRunning(!isRunning);

    const handleReset = () => {
        setIsRunning(false);
        setSessionLength(25);
        setBreakLength(5);
        setTimeLeft(25 * 60);
        setIsSession(true);
        const beep = document.getElementById('beep');
        if (beep) {
            beep.pause(); // Stop the sound if it's playing
            beep.currentTime = 0; // Reset the sound to the beginning
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    return (
        <div className="app">
            <div id="break-label">Break Length</div>
            <button id="break-decrement" onClick={() => setBreakLength(prev => Math.max(prev - 1, 1))}>-</button>
            <div id="break-length">{breakLength}</div>
            <button id="break-increment" onClick={() => setBreakLength(prev => Math.min(prev + 1, 60))}>+</button>
            <div id="session-label">Session Length</div>
            <button id="session-decrement" onClick={() => setSessionLength(prev => Math.max(prev - 1, 1))}>-</button>
            <div id="session-length">{sessionLength}</div>
            <button id="session-increment" onClick={() => setSessionLength(prev => Math.min(prev + 1, 60))}>+</button>
            <div id="timer-label">{isSession ? "Session" : "Break"}</div>
            <div id="time-left">{formatTime(timeLeft)}</div>
            <button id="start_stop" onClick={handleStartStop}>{isRunning ? "Stop" : "Start"}</button>
            <button id="reset" onClick={handleReset}>Reset</button>
            <audio id="beep" src="beep.mp3" preload="auto"></audio>
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));




