import React from "react";

interface UIProps {
  view: "system" | "star" | "planet";
  setView: (v: "system" | "star" | "planet") => void;
}

const UI = ({ view, setView }: UIProps) => {
  return (
    <div style={{ position: "absolute", top: 20, left: 20, color: "white" }}>
      <h2>Rho Coronae Borealis</h2>
      <p>A Sun-like star known to host exoplanets</p>
      <div>
        <button onClick={() => setView("system")}>System</button>
        <button onClick={() => setView("star")}>Star</button>
        <button onClick={() => setView("planet")}>Planet</button>
      </div>
      <p>View: {view}</p>
    </div>
  );
};

export default UI;
