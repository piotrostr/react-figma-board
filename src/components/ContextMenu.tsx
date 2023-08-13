import React from "react";

export const ContextMenu = React.forwardRef((props, ref) => {
  return (
    <div
      style={{
        display: "none",
        position: "absolute",
        backgroundColor: "#fff",
        border: "1px solid #ccc",
        boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
      }}
      ref={ref}
    >
      <ul style={{ listStyleType: "none", margin: 0, padding: 0 }}>
        <li
          style={{
            padding: "8px 16px",
            cursor: "pointer",
            userSelect: "none",
          }}
          onClick={() => console.log("Edit clicked")}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#f1f1f1";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "transparent";
          }}
        >
          Edit
        </li>
        <li
          style={{
            padding: "8px 16px",
            cursor: "pointer",
            userSelect: "none",
          }}
          onClick={() => console.log("Delete clicked")}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#f1f1f1";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "transparent";
          }}
        >
          Delete
        </li>
      </ul>
    </div>
  );
});
