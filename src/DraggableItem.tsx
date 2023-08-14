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
import { useAppDispatch, useAppSelector } from "./hooks";
import { updateDraggableRefs } from "./draggableRefsSlice";
import { setDelta } from "./deltaSlice";
import { clearSelectedItems } from "./selectedItemsSlice";

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
  index?: number;
}

export function DraggableStory({
  activationConstraint,
  axis,
  handle,
  label = "Go ahead, drag me.",
  modifiers,
  style,
  buttonStyle,
  dragActive,
  setDragActive,
  scale,
  index,
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

  const dispatch = useAppDispatch();
  const delta = useAppSelector((state) => state.delta);

  const selectedItems = useAppSelector(
    (state) => state.selectedItems.selectedItems,
  );

  const handleDragStart = () => {
    setDragActive?.(true);
    if (!selectedItems?.includes(`draggable-${index}`)) {
      dispatch(clearSelectedItems());
    }
  };

  const handleDragMove = ({ delta }: { delta: Coordinates }) => {
    dispatch(setDelta({ x: delta.x, y: delta.y }));
    setCoordinates({
      x: Math.floor(prevCoordinates.x + delta.x / scale),
      y: Math.floor(prevCoordinates.y + delta.y / scale),
    });
  };

  const handleDragEnd = () => {
    dispatch(setDelta({ x: 0, y: 0 }));
    setPrevCoordinates({ x, y });
    setDragActive?.(false);
  };

  useEffect(() => {
    if (dragActive && selectedItems?.includes(`draggable-${index}`)) {
      setCoordinates({
        x: Math.floor(prevCoordinates.x + delta.x / scale),
        y: Math.floor(prevCoordinates.y + delta.y / scale),
      });
    } else if (!dragActive && selectedItems?.includes(`draggable-${index}`)) {
      setPrevCoordinates({ x, y });
    }
  }, [delta, dragActive, selectedItems, index, prevCoordinates, scale, x, y]);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
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
  index,
  selectedItems,
}: DraggableItemProps) {
  const { attributes, isDragging, listeners, setNodeRef, transform, node } =
    useDraggable({
      id: "draggable",
    });
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(updateDraggableRefs(node.current));
  }, [dispatch, node]);

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
