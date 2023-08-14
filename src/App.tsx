import React, { useRef, useEffect, MouseEvent } from "react";
import { DndContext } from "@dnd-kit/core";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { DraggableStory } from "./DraggableItem";
import { Controls } from "./Controls";
import { ContextMenu } from "./components/ContextMenu";
import { useAppDispatch, useAppSelector } from "./hooks";
import { increment } from "./slice";
import { updateSelectBox } from "./selectBoxSlice";
import { selectItems, clearSelectedItems } from "./selectedItemsSlice";
import { hash } from "./utils";
import { BoundingRect } from "./boundingRectsSlice";

function App() {
  const drag = useAppSelector((state) => state.drag);
  const selectBox = useAppSelector((state) => state.selectBox);
  const contextMenuRef = useRef<HTMLDivElement>(null); // Ref to the context menu
  const selectBoxRef = useRef<HTMLDivElement>(null); // Ref to the select box
  const selectedItems = useAppSelector(
    (state) => state.selectedItems.selectedItems,
  );
  const boundingRects = useAppSelector(
    (state) => state.boundingRects.boundingRects,
  );
  const dispatch = useAppDispatch();
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
    return (
      selectBox.left < rect.right &&
      selectBox.right > rect.left &&
      selectBox.top < rect.bottom &&
      selectBox.bottom > rect.top
    );
  };

  const handleMouseUp = (event: MouseEvent) => {
    if (event.shiftKey) {
      boundingRects
        // .filter(({ id }) => !selectedItems.includes(id))
        .forEach(({ boundingRect, id }) => {
          if (selectBoxRef.current === null) {
            return;
          }
          const clientRect = selectBoxRef.current.getBoundingClientRect();
          const selectBoxRect = {
            left: clientRect.left,
            right: clientRect.right,
            top: clientRect.top,
            bottom: clientRect.bottom,
          };
          console.log(selectBoxRect, boundingRect);

          if (
            checkForCollision(selectBoxRect, boundingRect) &&
            !selectBox.active &&
            !drag.active
          ) {
            dispatch(
              selectItems({
                items: [...selectedItems, id],
              }),
            );
          }
        });
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
                  {Array.from(Array(5).keys()).map((i) => (
                    <div
                      key={i}
                      id={hash(String(i))}
                      style={{
                        width: "fit-content",
                        border: selectedItems.includes(hash(String(i)))
                          ? "1px solid red"
                          : "none",
                      }}
                    >
                      <DraggableStory
                        scale={utils.instance.transformState.scale}
                        id={hash(String(i))}
                      />
                    </div>
                  ))}
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
