import { useState } from "react";
import { DndContext } from "@dnd-kit/core";

import { DraggableBox } from "@/components/DraggableBox";
import { useCompanion } from "@/contexts/companion";
import GameInfo from "@/components/PlayerList";

import "./App.css";

function App() {
  const [position, setPosition] = useState({ x: 50, y: -500 });
  const [show, setShow] = useState(true);
  const config = useCompanion();

  const handleDragEnd = (event: any) => {
    const { delta } = event;
    setPosition((prev) => ({
      x: prev.x + delta.x,
      y: prev.y + delta.y,
    }));
  };

  const toggleShow = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShow((state) => !state);
  };

  const logGameState = () => {
    console.log("Players", JSON.stringify(config.players, null, 2));
    console.log("Dices", config.dices);
    console.log("Total logs", config.logs.size)
  };

  if (!config) return null;
  if (Object.keys(config.players).length === 0) return null;

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <DraggableBox position={position}>
        {({ attributes, listeners }) => (
          <>
            <div className="cc-flex cc-items-center cc-justify-around cc-gap-4">
              <h2
                className="cc-m-0 cc-text-black cc-flex-1 cc-font-bold cc-text-center cursor-move"
                {...attributes}
                {...listeners}
              >
                Colonist Companion
              </h2>
              <button onClick={toggleShow}>{show ? "Hide" : "Show"}</button>
              <button onClick={logGameState}>Print</button>
            </div>
            {show && <GameInfo />}
          </>
        )}
      </DraggableBox>
    </DndContext>
  );
}

export default App;
