import React, { useRef, useEffect, MouseEvent, useState } from "react";
import { DndContext } from "@dnd-kit/core";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { DraggableWrapper } from "./DraggableWrapper";
import { Controls } from "./Controls";
import { ContextMenu } from "./components/ContextMenu";
import { useAppDispatch, useAppSelector } from "./hooks";
import { increment } from "./slice";
import { updateSelectBox } from "./selectBoxSlice";
import { selectItems, clearSelectedItems } from "./selectedItemsSlice";
import { hash } from "./utils";
import loadComponents from "./ComponentLoader";
interface BoundingRect {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

function App() {
  const drag = useAppSelector((state) => state.drag);
  const selectBox = useAppSelector((state) => state.selectBox);
  const contextMenuRef = useRef<HTMLDivElement>(null); // Ref to the context menu
  const selectBoxRef = useRef<HTMLDivElement>(null); // Ref to the select box
  const draggableRefs = useRef<HTMLDivElement[]>([]); // Refs to the draggable items
  const selectedItems = useAppSelector(
    (state) => state.selectedItems.selectedItems,
  );
  const [components, setComponents] = useState([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function fetchComponents() {
      const loadedComponents = await loadComponents();
      setComponents(loadedComponents);
    }
    fetchComponents();
  }, []);

  useEffect(() => {
    // this uses the native KeyboardEvent, not the React KeyboardEvent
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Shift") {
        dispatch(increment());
        dispatch(
          updateSelectBox({
            active: true,
          }),
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
          }),
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

  // this is for when you right-click with the mouse
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
        }),
      );
    } else {
      dispatch(clearSelectedItems());
    }
  };
  const checkForCollision = (selectBox: BoundingRect, rect: BoundingRect) => {
    // any time the select box is hovering over a draggable item, we want to select it
    const isColliding =
      selectBox.left < rect.right &&
      selectBox.right > rect.left &&
      selectBox.top < rect.bottom &&
      selectBox.bottom > rect.top;
    return isColliding;
  };

  const handleMouseUp = (event: MouseEvent) => {
    if (event.shiftKey) {
      draggableRefs.current
        // .filter(({ id }) => !selectedItems.includes(id))
        .forEach((ref) => {
          if (selectBoxRef.current === null) {
            return;
          }
          const selectBoxRect = selectBoxRef.current.getBoundingClientRect();
          const boundingRect = ref.getBoundingClientRect();
          const isColliding = checkForCollision(selectBoxRect, boundingRect);
          if (isColliding && selectBox.active && !drag.active) {
            dispatch(
              selectItems({
                items: [...selectedItems, ref.id],
              }),
            );
          }
        });
      dispatch(
        updateSelectBox({
          active: true,
          width: 0,
          height: 0,
          x: undefined,
          y: undefined,
        }),
      );
    }
  };

  const setDraggableRefs = (value: HTMLDivElement) => {
    if (draggableRefs.current.includes(value.current)) {
      return;
    }
    draggableRefs.current = [...draggableRefs.current, value.current];
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
            }),
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
          disabled={drag.active || selectBox.active}
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
                  {components.map((Component, i) => {
                    const Module = Component.module;
                    return (
                      <div
                        key={i}
                        id={hash(String(i))}
                        style={{
                          width: "fit-content",
                        }}
                      >
                        <DraggableWrapper
                          scale={utils.instance.transformState.scale}
                          id={hash(String(i))}
                          setDraggableRefs={setDraggableRefs}
                        >
                          <div
                            style={{
                              zIndex: 50,
                              border: "1px solid red",
                              padding: 50,
                            }}
                          >
                            <div>{Component.name}</div>
                            <div
                              style={{
                                zIndex: 998,
                              }}
                            >
                              <div
                                style={{
                                  position: "absolute",
                                  width: "100%",
                                  height: "100%",
                                  zIndex: 999,
                                }}
                              />
                              <Module />
                            </div>
                          </div>
                        </DraggableWrapper>
                      </div>
                    );
                  })}
                </div>
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </DndContext>
      <ContextMenu ref={contextMenuRef} />
      {selectBox.active && selectBox.x && selectBox.y && !drag.active ? (
        <div
          ref={selectBoxRef}
          style={{
            position: "absolute",
            border: "1px solid red",
            backgroundColor: "rgba(255, 0, 0, 0.1)",
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
