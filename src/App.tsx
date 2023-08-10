import React from "react";
import { useState } from "react";

import { useControls } from "react-zoom-pan-pinch";
import { ReactZoomPanPinchState } from "react-zoom-pan-pinch";
import { useTransformContext } from "react-zoom-pan-pinch";
import { useTransformEffect } from "react-zoom-pan-pinch";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import { DndContext } from "@dnd-kit/core";
import { Droppable } from "./Droppable";
import { Draggable } from "./Draggable";

function App() {
  const [isDropped, setIsDropped] = useState(false);
  const [isBeingDragged, setIsBeingDragged] = useState(false);

  console.log("isBeingDragged", isBeingDragged);

  const handleDragEnd = (event: any) => {
    if (event.over && event.over.id === "droppable") {
      setIsDropped(true);
    }
    setIsBeingDragged(false);
  };

  const handleDragStart = (event: any) => {
    setIsBeingDragged(true);
  };

  const children = (
    <React.Fragment>
      <TransformComponent>
        <div>Example text</div>
        {!isDropped && <Draggable>drag me</Draggable>}
        <Droppable
          style={{
            width: "100vw",
            height: "100vh",
            background: "red",
          }}
        >
          {isDropped ? <Draggable>drag me</Draggable> : "drop here"}
        </Droppable>
      </TransformComponent>
      <Sidebar />
    </React.Fragment>
  );
  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      {isBeingDragged ? (
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

  const handleScroll = (e) => {
    console.log(e);
    e.preventDefault();
    e.stopPropagation();
    const { deltaY } = e;
    const { scale } = state;
    const newScale = scale - deltaY * 0.01;
    setTransform(state.positionX, state.positionY, newScale);
  };

  useTransformEffect(({ state, instance }) => {
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
