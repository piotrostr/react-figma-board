export function Controls({ zoomIn, zoomOut, resetTransform }) {
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
      <button onClick={() => zoomIn()}>+</button>
      <button onClick={() => zoomOut()}>-</button>
      <button onClick={() => resetTransform()}>x</button>
    </div>
  )
}
