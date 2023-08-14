import React, { useEffect } from "react";
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
import { updateBoundingRects } from "./boundingRectsSlice";
import { setDelta } from "./deltaSlice";
import { setDragActive } from "./dragSlice";
import { initializeCoordinates, updateCoordinates } from "./coordinatesSlice";
import { createSelector } from "@reduxjs/toolkit";

export default {
  title: "Core/Draggable/Hooks/useDraggable",
};

interface Props {
  activationConstraint?: PointerActivationConstraint;
  axis?: Axis;
  handle?: boolean;
  modifiers?: Modifiers;
  buttonStyle?: React.CSSProperties;
  style?: React.CSSProperties;
  scale: number;
  id: string;
}

export function DraggableStory({
  activationConstraint,
  axis,
  handle,
  modifiers,
  style,
  buttonStyle,
  scale,
  id,
}: Props) {
  const dispatch = useAppDispatch();

  const selectCoordinates = createSelector(
    [
      (state) => {
        if (
          !state.coordinates ||
          !state.coordinates ||
          !state.coordinates.map ||
          !state.coordinates.map[id]
        ) {
          return { coordinates: {}, prevCoordinates: {} };
        }
        return {
          coordinates: state.coordinates.map[id].coordinates,
          prevCoordinates: state.coordinates.map[id].prevCoordinates,
        };
      },
    ],
    (state) => state,
  );
  const { coordinates, prevCoordinates } = useAppSelector(selectCoordinates);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint,
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint,
  });
  const keyboardSensor = useSensor(KeyboardSensor, {});
  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  const delta = useAppSelector((state) => state.delta);
  const drag = useAppSelector((state) => state.drag);

  const selectedItems = useAppSelector(
    (state) => state.selectedItems.selectedItems,
  );

  const handleDragStart = () => {
    dispatch(setDragActive(true));
  };

  const handleDragMove = ({ delta }: { delta: Coordinates }) => {
    dispatch(setDelta({ x: delta.x, y: delta.y }));
    prevCoordinates &&
      dispatch(
        updateCoordinates({
          id,
          coordinates: {
            x: Math.floor(prevCoordinates.x + delta.x / scale),
            y: Math.floor(prevCoordinates.y + delta.y / scale),
          },
        }),
      );
  };

  const handleDragEnd = () => {
    dispatch(setDelta({ x: 0, y: 0 }));
    coordinates &&
      dispatch(
        updateCoordinates({
          id,
          prevCoordinates: { x: coordinates.x, y: coordinates.y },
        }),
      );
    dispatch(setDragActive(false));
  };

  useEffect(() => {
    if (drag.active && selectedItems?.includes(id)) {
      prevCoordinates &&
        dispatch(
          updateCoordinates({
            id,
            coordinates: {
              x: Math.floor(prevCoordinates.x + delta.x / scale),
              y: Math.floor(prevCoordinates.y + delta.y / scale),
            },
          }),
        );
    } else if (!drag.active && selectedItems?.includes(id)) {
      coordinates &&
        dispatch(
          updateCoordinates({
            id,
            prevCoordinates: coordinates,
          }),
        );
    }
  }, [
    dispatch,
    delta,
    drag,
    selectedItems,
    id,
    prevCoordinates,
    scale,
    coordinates,
  ]);

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
          handle={handle}
          top={coordinates?.y}
          left={coordinates?.x}
          style={style}
          buttonStyle={buttonStyle}
          id={id}
          selectedItems={selectedItems}
        />
      </Wrapper>
    </DndContext>
  );
}

interface DraggableItemProps {
  handle?: boolean;
  style?: React.CSSProperties;
  buttonStyle?: React.CSSProperties;
  axis?: Axis;
  top?: number;
  left?: number;
  id: string;
  selectedItems?: string[];
}

function DraggableItem({
  axis,
  style,
  top,
  left,
  handle,
  buttonStyle,
  id,
  selectedItems,
}: DraggableItemProps) {
  const { attributes, isDragging, listeners, setNodeRef, transform, node } =
    useDraggable({ id });
  const dispatch = useAppDispatch();

  useEffect(() => {
    // initialize the coordinates based on refs
    const boundingRect = node?.current?.getBoundingClientRect();
    if (!boundingRect) {
      return;
    }
    dispatch(
      initializeCoordinates({
        id,
        coordinates: {
          x: boundingRect.x,
          y: boundingRect.y,
        },
        prevCoordinates: {
          x: boundingRect.x,
          y: boundingRect.y,
        },
      }),
    );
  }, [dispatch, id, node]);

  useEffect(() => {
    if (!node?.current?.id) {
      return;
    }
    const boundingRect = node.current.getBoundingClientRect();
    dispatch(
      updateBoundingRects({
        id: node.current.id,
        boundingRect: {
          left: boundingRect.left,
          right: boundingRect.right,
          top: boundingRect.top,
          bottom: boundingRect.bottom,
        },
      }),
    );
  }, [dispatch, node]);

  return (
    <Draggable
      id={id}
      ref={setNodeRef}
      dragging={isDragging}
      handle={handle}
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
