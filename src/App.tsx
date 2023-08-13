import React, { useState, useRef, useEffect, MouseEvent } from "react";
import { DndContext } from "@dnd-kit/core";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { DraggableStory } from "./DraggableItem";
import { Controls } from "./Controls";
import { ContextMenu } from "./components/ContextMenu";

interface SelectBox {
  x?: number;
  y?: number;
  width: number;
  height: number;
}

function App() {
  const [dragActive, setDragActive] = useState(false);
  const [selectBox, setSelectBox] = useState<SelectBox | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null); // Ref to the context menu

  // this uses the native KeyboardEvent, not the React KeyboardEvent
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Shift") {
      setSelectBox({
        width: 0,
        height: 0,
      });
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    if (event.key === "Shift") {
      setSelectBox(null);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const handleContextMenu = (event: MouseEvent) => {
    event.preventDefault();
    if (contextMenuRef.current === null) {
      return;
    }
    contextMenuRef.current.style.left = `${event.clientX}px`;
    contextMenuRef.current.style.top = `${event.clientY}px`;
    contextMenuRef.current.style.display = "block";
  };

  const handleCloseContextMenu = () => {
    if (contextMenuRef.current === null) {
      return;
    }
    contextMenuRef.current.style.display = "none";
  };

  const handleMouseDown = (event: MouseEvent) => {
    handleCloseContextMenu();
    if (event.shiftKey) {
      setSelectBox({
        x: event.clientX,
        y: event.clientY,
        width: 0,
        height: 0,
      });
    }
  };

  const handleMouseUp = () => {
    if (selectBox !== null) {
      setSelectBox(null);
    }
  };

  return (
    <div
      onContextMenu={handleContextMenu}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={(event) => {
        if (selectBox !== null && selectBox.x && selectBox.y) {
          setSelectBox({
            ...selectBox,
            width: event.clientX - selectBox.x,
            height: event.clientY - selectBox.y,
          });
        }
      }}
    >
      <DndContext>
        <TransformWrapper
          initialScale={1}
          limitToBounds={false}
          centerZoomedOut={false}
          disablePadding={true}
          disabled={dragActive || selectBox !== null}
          minScale={0.1}
          maxScale={10}
        >
          {(utils) => (
            <>
              <Controls {...utils} />
              <TransformComponent>
                <div
                  style={{
                    width: "100vw",
                    height: "100vh",
                  }}
                >
                  <DraggableStory
                    setDragActive={setDragActive}
                    scale={utils.instance.transformState.scale}
                  />
                </div>
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </DndContext>
      <ContextMenu ref={contextMenuRef} />
      {selectBox !== null && selectBox.x && selectBox.y && !dragActive ? (
        <div
          style={{
            position: "absolute",
            border: "1px solid red",
            left:
              selectBox.width < 0 ? selectBox.x + selectBox.width : selectBox.x,
            right:
              selectBox.width > 0
                ? `calc(100% - ${selectBox!.x + selectBox.width}px)`
                : "",
            top:
              selectBox.height < 0
                ? selectBox.y + selectBox.height
                : selectBox.y,
            bottom:
              selectBox.height > 0
                ? `calc(100% - ${selectBox!.y + selectBox.height}px)`
                : "",
            width: Math.abs(selectBox.width),
            height: Math.abs(selectBox.height),
          }}
        />
      ) : null}
    </div>
  );
}

export default App;
