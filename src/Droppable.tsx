import { useDroppable } from "@dnd-kit/core";

export interface DroppableProps {
  id: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export function Droppable({ id, children, style }: DroppableProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
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
