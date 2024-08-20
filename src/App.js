import React, { useState, useEffect, useRef } from "react";
import  { Mafs,Coordinates, Point, Polyline, Line } from "mafs";
import "mafs/core.css";

function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState([{ x: 0, y: 0 }]);
  const [load, setLoad] = useState(1); // Load factor affecting movement
  const [stepSize, setStepSize] = useState(0.2); // Step size
  const [bias, setBias] = useState(0.6); // Bias towards forward movement
  const [isRunning, setIsRunning] = useState(true); // Control simulation
  const [trackLength, setTrackLength] = useState(10); // Track length
  const yRange = 1; // Fixed range of y-axis movement
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setPosition((prev) => {
          const adjustedBias = bias - load * 0.05; // Heavier load reduces forward bias
          
          // Stepwise motion with load consideration
          let newX = prev.x + (Math.random() < adjustedBias ? stepSize / load : -stepSize / load);
          let newY = prev.y + (Math.random() - 0.5) * 0.2 / load; // Small fluctuations in the y direction

          // Keep motor within the track length
          newX = Math.max(-trackLength, Math.min(newX, trackLength));

          // Keep y within the fixed range
          newY = Math.max(-yRange, Math.min(newY, yRange));

          return { x: newX, y: newY };
        });
      }, 100);

      return () => clearInterval(intervalRef.current);
    }
  }, [isRunning, load, stepSize, bias, trackLength]);

  useEffect(() => {
    setTrail((prevTrail) => [...prevTrail, position]);
  }, [position]);

  const toggleRunning = () => {
    setIsRunning((prev) => !prev);
    if (isRunning) {
      clearInterval(intervalRef.current);
    }
  };

  return (
    <div className="App">
      <h1>Molecular Motor Simulation</h1>
      <p>
        This simulation illustrates the concept of a Brownian ratchet, a model that demonstrates how random motion (Brownian motion) can be converted into directed movement. The ratchet mechanism harnesses thermal fluctuations to move in one direction while preventing movement in the reverse direction, thereby converting thermal energy into mechanical work.
      </p>
      <p>
        In real cells, molecular motors such as kinesin and dynein use similar principles. These motors travel along protein filaments within the cell, converting chemical energy from ATP into mechanical work. The random thermal motion of the motor proteins, combined with directional bias from the cellular environment, allows them to move along tracks within the cell efficiently, similar to how this simulation demonstrates movement on a track.
      </p>
      <p>
        In this simulation:
        <ul>
          <li><strong>Load</strong>: Affects the motor's movement by introducing resistance. Higher load values make the motion more sluggish.</li>
          <li><strong>Step Size</strong>: Determines the size of each step the motor takes. Larger step sizes lead to more significant movements per step.</li>
          <li><strong>Bias</strong>: Represents the tendency for the motor to move in one direction. A higher bias increases the probability of moving forward.</li>
          <li><strong>Track Length</strong>: Defines the boundaries within which the motor can move. Adjusting this changes the range of possible movement along the x-axis.</li>
        </ul>
      </p>
      <Mafs>
        <Coordinates.Cartesian
          xMin={-trackLength - 1}
          xMax={trackLength + 1}
          yMin={-yRange - 1}
          yMax={yRange + 1}
        />

        {/* Visualizing the Track */}
        <Line.Segment
          point1={[-trackLength, 0]}
          point2={[trackLength, 0]}
          color="green"
          opacity={0.5}
        />

        <Polyline points={trail.map((p) => [p.x, p.y])} color="blue" />
        <Point x={position.x} y={position.y} color="red" />
      </Mafs>
      <div className="controls">
        <div className="control-group">
          <label htmlFor="load">Load:</label>
          <input
            id="load"
            type="range"
            min="1"
            max="10"
            value={load}
            onChange={(e) => setLoad(Number(e.target.value))}
          />
          <span>{load}</span>
        </div>
        <div className="control-group">
          <label htmlFor="stepSize">Step Size:</label>
          <input
            id="stepSize"
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            value={stepSize}
            onChange={(e) => setStepSize(Number(e.target.value))}
          />
          <span>{stepSize.toFixed(1)}</span>
        </div>
        <div className="control-group">
          <label htmlFor="bias">Bias:</label>
          <input
            id="bias"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={bias}
            onChange={(e) => setBias(Number(e.target.value))}
          />
          <span>{bias.toFixed(2)}</span>
        </div>
        <div className="control-group">
          <label htmlFor="trackLength">Track Length:</label>
          <input
            id="trackLength"
            type="range"
            min="5"
            max="20"
            value={trackLength}
            onChange={(e) => setTrackLength(Number(e.target.value))}
          />
          <span>{trackLength}</span>
        </div>
        <button className="toggle-button" onClick={toggleRunning}>
          {isRunning ? "Stop" : "Start"} Simulation
        </button>
      </div>
    </div>
  );
}

export default App;
