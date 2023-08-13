import React, { useEffect, useState } from "react";
import {
  DndContext,
  useDraggable,
  useSensor,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  PointerActivationConstraint,
  Modifiers,
  useSensors,
} from "@dnd-kit/core";

import type { Coordinates } from "@dnd-kit/utilities";

import { Axis, Draggable, Wrapper } from "./components";

export default {
  title: "Core/Draggable/Hooks/useDraggable",
};

const defaultCoordinates = {
  x: 0,
  y: 0,
};

interface Props {
  activationConstraint?: PointerActivationConstraint;
  axis?: Axis;
  handle?: boolean;
  modifiers?: Modifiers;
  buttonStyle?: React.CSSProperties;
  style?: React.CSSProperties;
  label?: string;
  dragActive?: boolean;
  setDragActive?: (active: boolean) => void;
  scale: number;
  setRefs?: (ref: any) => void;
  index?: number;
  selectedItems?: string[];
}

export function DraggableStory({
  activationConstraint,
  axis,
  handle,
  label = "Go ahead, drag me.",
  modifiers,
  style,
  buttonStyle,
  setDragActive,
  scale,
  setRefs,
  index,
  selectedItems,
}: Props) {
  const [prevCoordinates, setPrevCoordinates] = useState<Coordinates>({
    x: 0,
    y: 0,
  });
  const [{ x, y }, setCoordinates] = useState<Coordinates>(defaultCoordinates);
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint,
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint,
  });
  const keyboardSensor = useSensor(KeyboardSensor, {});
  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={() => {
        setDragActive?.(true);
      }}
      onDragMove={({ delta }) => {
        setCoordinates({
          x: Math.floor(prevCoordinates.x + delta.x / scale),
          y: Math.floor(prevCoordinates.y + delta.y / scale),
        });
      }}
      onDragEnd={() => {
        setPrevCoordinates({ x: x, y: y });
        setDragActive?.(false);
      }}
      modifiers={modifiers}
    >
      <Wrapper>
        <DraggableItem
          axis={axis}
          label={label}
          handle={handle}
          top={y}
          left={x}
          style={style}
          buttonStyle={buttonStyle}
          setRefs={setRefs}
          index={index}
          selectedItems={selectedItems}
        />
      </Wrapper>
    </DndContext>
  );
}

interface DraggableItemProps {
  label: string;
  handle?: boolean;
  style?: React.CSSProperties;
  buttonStyle?: React.CSSProperties;
  axis?: Axis;
  top?: number;
  left?: number;
  setRefs?: (ref: any) => void;
  index?: number;
  selectedItems?: string[];
}

function DraggableItem({
  axis,
  label,
  style,
  top,
  left,
  handle,
  buttonStyle,
  setRefs,
  index,
  selectedItems,
}: DraggableItemProps) {
  const { attributes, isDragging, listeners, setNodeRef, transform, node } =
    useDraggable({
      id: "draggable",
    });


  useEffect(() => {
    setRefs?.(node);
  }, [node, setRefs])

  return (
    <Draggable
      id={`draggable-${index}`}
      ref={setNodeRef}
      dragging={isDragging}
      handle={handle}
      label={label}
      listeners={listeners}
      style={{ ...style, top, left }}
      buttonStyle={buttonStyle}
      transform={transform}
      axis={axis}
      selectedItems={selectedItems}
      {...attributes}
    />
  );
}
