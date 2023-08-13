import React, { useState, useRef, useEffect, MouseEvent } from "react";
import { DndContext } from "@dnd-kit/core";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { DraggableStory } from "./DraggableItem";
import { Controls } from "./Controls";
import { ContextMenu } from "./components/ContextMenu";
import { useAppDispatch, useAppSelector } from "./hooks";
import { increment } from "./slice";
import { updateSelectBox } from "./selectBoxSlice";

function App() {
  const [dragActive, setDragActive] = useState(false);
  const selectBox = useAppSelector((state) => state.selectBox);
  const contextMenuRef = useRef<HTMLDivElement>(null); // Ref to the context menu

  const value = useAppSelector((state) => state.counter.count);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // this uses the native KeyboardEvent, not the React KeyboardEvent
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Shift") {
        dispatch(increment());
        dispatch(
          updateSelectBox({
            active: true,
          })
        );
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "Shift") {
        dispatch(
          updateSelectBox({
            active: false,
            width: 0,
            height: 0,
            x: undefined,
            y: undefined,
          })
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [dispatch]);

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
      dispatch(
        updateSelectBox({
          x: event.clientX,
          y: event.clientY,
          width: 0,
          height: 0,
        })
      );
    }
  };

  const handleMouseUp = (event: MouseEvent) => {
    if (!event.shiftKey) {
      dispatch(
        updateSelectBox({
          active: false,
          width: 0,
          height: 0,
          x: undefined,
          y: undefined,
        })
      );
    }
  };

  return (
    <div
      onContextMenu={handleContextMenu}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={(event) => {
        if (selectBox.active && selectBox.x && selectBox.y) {
          dispatch(
            updateSelectBox({
              width: event.clientX - selectBox.x,
              height: event.clientY - selectBox.y,
            })
          );
        }
      }}
    >
      <DndContext>
        <TransformWrapper
          initialScale={1}
          limitToBounds={false}
          centerZoomedOut={false}
          disablePadding={true}
          disabled={dragActive || selectBox.active}
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
                  <div>shift was pressed: {value} times</div>
                </div>
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </DndContext>
      <ContextMenu ref={contextMenuRef} />
      {selectBox.active && selectBox.x && selectBox.y && !dragActive ? (
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
