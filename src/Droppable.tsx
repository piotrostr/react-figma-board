import { useDroppable } from "@dnd-kit/core";

export interface DroppableProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function Droppable({ children, style }: DroppableProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: "droppable",
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        background: isOver ? "green" : "red",
      }}
    >
      {children}
    </div>
  );
}
