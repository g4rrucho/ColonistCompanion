// DraggableBox.tsx
import { useDraggable } from "@dnd-kit/core";
import { type CSSProperties, type ReactNode } from "react";

interface Props {
  position: { x: number; y: number };
  children: (props: {
    attributes: ReturnType<typeof useDraggable>["attributes"];
    listeners: ReturnType<typeof useDraggable>["listeners"];
    setNodeRef: ReturnType<typeof useDraggable>["setNodeRef"];
  }) => ReactNode;
}

export const DraggableBox = ({ position, children }: Props) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "draggable",
  });

  const style: CSSProperties = {
    transform: `translate3d(${position.x + (transform?.x ?? 0)}px, ${
      position.y + (transform?.y ?? 0)
    }px, 0)`,
    position: "absolute",
    touchAction: "none",
    zIndex: 100,
    borderRadius: "0.25rem",
    width: "300px",
    padding: "4px",
  };

  return (
    <div
      ref={setNodeRef}
      className="cc-bg-[#f8fafc] cc-shadow-md"
      style={style}
    >
      {children({ attributes, listeners, setNodeRef })}
    </div>
  );
};
