import React, { useEffect } from "react";
import {
  DndContext,
  useDraggable,
  useSensor,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  PointerActivationConstraint,
  useSensors,
} from "@dnd-kit/core";
import type { Coordinates } from "@dnd-kit/utilities";
import { useAppDispatch, useAppSelector } from "./hooks";
import { setDelta } from "./deltaSlice";
import { setDragActive } from "./dragSlice";
import { initializeCoordinates, updateCoordinates } from "./coordinatesSlice";
import { createSelector } from "@reduxjs/toolkit";
import { clearSelectedItems } from "./selectedItemsSlice";

export default {
  title: "Core/Draggable/Hooks/useDraggable",
};

interface Props {
  activationConstraint?: PointerActivationConstraint;
  handle?: boolean;
  scale: number;
  id: string;
  setDraggableRefs: (value: HTMLDivElement) => void;
  children?: React.ReactNode;
}

export function DraggableWrapper({
  activationConstraint,
  handle,
  scale,
  id,
  setDraggableRefs,
  children,
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

  const selectedItems = useAppSelector(
    (state) => state.selectedItems.selectedItems,
  );

  const handleDragStart = () => {
    dispatch(setDragActive(true));
    if (!selectedItems?.includes(id)) {
      dispatch(clearSelectedItems());
    }
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

  return (
    <DndContext
      onClick={() => {
        dispatch(clearSelectedItems());
      }}
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
    >
      <DraggableItem
        scale={scale}
        handle={handle}
        top={coordinates?.y}
        left={coordinates?.x}
        id={id}
        setDraggableRefs={setDraggableRefs}
      >
        {children}
      </DraggableItem>
    </DndContext>
  );
}

interface DraggableItemProps {
  scale: number;
  handle?: boolean;
  top?: number;
  left?: number;
  id: string;
  setDraggableRefs?: (value: HTMLDivElement) => void;
  children?: React.ReactNode;
}

function DraggableItem({
  scale,
  top,
  left,
  handle,
  id,
  children,
  setDraggableRefs,
}: DraggableItemProps) {
  const { isDragging, listeners, setNodeRef, node } = useDraggable({
    id,
  });
  const dispatch = useAppDispatch();
  const delta = useAppSelector((state) => state.delta);
  const drag = useAppSelector((state) => state.drag);
  const selectedItems = useAppSelector(
    (state) => state.selectedItems.selectedItems,
  );
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

  useEffect(() => {
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
    setDraggableRefs(node);
  }, [node, setDraggableRefs]);

  useEffect(() => {
    if (drag.active && selectedItems?.includes(id) && !isDragging) {
      coordinates &&
        dispatch(
          updateCoordinates({
            id,
            coordinates: {
              x: Math.floor(prevCoordinates.x + delta.x / scale),
              y: Math.floor(prevCoordinates.y + delta.y / scale),
            },
          }),
        );
    } else if (!drag.active && selectedItems?.includes(id) && !isDragging) {
      coordinates &&
        dispatch(
          updateCoordinates({
            id,
            prevCoordinates: coordinates,
          }),
        );
    }
  }, [delta]);

  return (
    <div
      style={{
        top: top,
        left: left,
        transform: `translateX(${coordinates.x}px) translateY(${coordinates.y}px)`,
      }}
      onMouseDown={(event) => {
        event.stopPropagation();
      }}
    >
      <button
        id={id}
        {...(handle ? {} : listeners)}
        ref={setNodeRef}
        style={{
          all: "unset",
          cursor: !isDragging ? "grab" : "grabbing",
          border: selectedItems?.includes(id) ? "1px solid red" : "none",
        }}
      >
        {children}
      </button>
    </div>
  );
}
