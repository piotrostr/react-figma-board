import { useState, useRef, useEffect } from "react";
import { DndContext } from "@dnd-kit/core";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { DraggableStory } from "./DraggableItem";
import { Controls } from "./Controls";
import { ContextMenu } from "./components/ContextMenu";

function App() {
  const [dragActive, setDragActive] = useState(false);
  const [selectBox, setSelectBox] = useState(null);
  const contextMenuRef = useRef(null); // Ref to the context menu

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Shift") {
        setSelectBox({
          x: event.clientX,
          y: event.clientY,
          width: 0,
          height: 0,
        });
      }
    };
    const handleKeyUp = (event) => {
      if (event.key === "Shift") {
        setSelectBox(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const handleContextMenu = (event) => {
    event.preventDefault();
    contextMenuRef.current.style.left = `${event.clientX}px`;
    contextMenuRef.current.style.top = `${event.clientY}px`;
    contextMenuRef.current.style.display = "block";
  };

  const handleCloseContextMenu = () => {
    contextMenuRef.current.style.display = "none";
  };

  const handleMouseDown = (event) => {
    handleCloseContextMenu();
    if (event.shiftKey) {
      console.log("shift key down");
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
        if (selectBox !== null) {
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
      {selectBox !== null ? (
        <div
          style={{
            position: "absolute",
            border: "1px solid red",
            left:
              selectBox.width < 0 ? selectBox.x + selectBox.width : selectBox.x,
            right:
              selectBox.width > 0
                ? `calc(100% - ${selectBox.x + selectBox.width}px)`
                : null,
            top:
              selectBox.height < 0
                ? selectBox.y + selectBox.height
                : selectBox.y,
            bottom:
              selectBox.height > 0
                ? `calc(100% - ${selectBox.y + selectBox.height}px)`
                : null,
            width: Math.abs(selectBox.width),
            height: Math.abs(selectBox.height),
          }}
        />
      ) : null}
    </div>
  );
}

export default App;
