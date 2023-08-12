import { useState } from "react";

import { useControls } from "react-zoom-pan-pinch";
import { ReactZoomPanPinchState } from "react-zoom-pan-pinch";
import { useTransformContext } from "react-zoom-pan-pinch";
import { useTransformEffect } from "react-zoom-pan-pinch";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import { DndContext, useDndContext } from "@dnd-kit/core";

import { BasicSetup as DraggableStory } from "./DraggableStory.tsx";
import { useDraggable } from "@dnd-kit/core";

function App() {
  // the base id of the draggable element is 'draggable'
  const { active, isDragging } = useDraggable({ id: "draggable" });
  console.log(active, isDragging);

  const context = useDndContext();
  console.log(context);

  // TODO I can't access the `id: "draggable"`,
  // it might be an issue with the DndContext not being available
  // in this top level component
  //
  // the context logs out as empty, nothing happens on dragging of the DraggableStory
  // the DndContext from that component has to be moved here,
  // the core of the DraggableStory is the DraggableItem which shall
  // be the base for the parent Draggable class to be used throughout the project

  const children = (
    <>
      <TransformComponent>
        <div
          style={{
            width: "100vw",
            height: "100vh",
            backgroundColor: "gray",
          }}
        ></div>
        <DraggableStory />
      </TransformComponent>
      <Sidebar />
    </>
  );

  return (
    <DndContext
      onDragStart={(event) => {
        console.log(event);
      }}
    >
      {isDragging ? (
        <TransformWrapper
          initialScale={0.3}
          limitToBounds={false}
          centerZoomedOut={false}
          disablePadding={true}
          disabled={true}
        >
          {children}
        </TransformWrapper>
      ) : (
        <TransformWrapper
          initialScale={0.3}
          limitToBounds={false}
          centerZoomedOut={false}
          disablePadding={true}
        >
          {children}
        </TransformWrapper>
      )}
    </DndContext>
  );
}

function Sidebar() {
  const { setTransform, resetTransform } = useControls();
  const [state, setState] = useState<ReactZoomPanPinchState>({
    positionX: 0,
    positionY: 0,
    scale: 1,
    previousScale: 1,
  });

  const context = useTransformContext();
  context.onWheelZoom = (e) => {
    handleScroll(e);
  };

  const handleZoomIn = (step: number = 0.1) => {
    setTransform(state.positionX, state.positionY, state.scale + step);
  };

  const handleZoomOut = (step: number = 0.1) => {
    setTransform(state.positionX, state.positionY, state.scale - step);
  };

  const handleReset = () => {
    resetTransform();
  };

  const handleScroll = (e: WheelEvent) => {
    // TODO make sure this is right, positionX and positionY might require updating
    console.log(e);
    e.preventDefault();
    e.stopPropagation();
    const { deltaY } = e;
    const { scale } = state;
    const newScale = scale - deltaY * 0.01;
    setTransform(state.positionX, state.positionY, newScale);
  };

  useTransformEffect(({ state }) => {
    setState(state);
    return () => {};
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 50,
        left: 50,
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <button onClick={() => handleZoomIn()}>+</button>
      <button onClick={() => handleZoomOut()}>-</button>
      <button onClick={() => handleReset()}>x</button>
    </div>
  );
}

export default App;
