import { useState } from "react";
import { DndContext } from "@dnd-kit/core";
import { ChevronDown, ChevronUp, Logs } from "lucide-react";

import { useCompanion } from "@/contexts/useCompanion";
import { DraggableBox } from "@/components/DraggableBox";
import GameInfo from "@/components/GameInfo";
import { logger } from "@/utils/logger";

import "./App.css";

function App() {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [show, setShow] = useState(true);
  const config = useCompanion();

  const handleDragEnd = (event: { delta: { x: number; y: number } }) => {
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

  const logGameState = () => logger.log("Game State:", config);

  if (!config) return null;
  if (Object.keys(config.players).length === 0) return null;

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <DraggableBox position={position}>
        {({ attributes, listeners }) => (
          <>
            <div className="cc-flex cc-items-center cc-justify-around cc-gap-2">
              <h3
                className="cc-m-0 cc-text-black cc-flex-1 cc-font-bold cc-text-center cc-cursor-move cc-select-none"
                {...attributes}
                {...listeners}
              >
                Colonist Companion
              </h3>
              {show ? (
                <ChevronUp color="black" onClick={toggleShow} />
              ) : (
                <ChevronDown color="black" onClick={toggleShow} />
              )}
              {import.meta.env.DEV && (
                <Logs color="black" onClick={logGameState} />
              )}
            </div>
            {show && <GameInfo />}
          </>
        )}
      </DraggableBox>
    </DndContext>
  );
}

export default App;
