import React, { forwardRef } from "react";
import classNames from "classnames";
import type { DraggableSyntheticListeners } from "@dnd-kit/core";
import type { Transform } from "@dnd-kit/utilities";
import { Handle } from "../Item/components/Handle";
import {
  draggable,
  draggableHorizontal,
  draggableVertical,
} from "./draggable-svg";
import styles from "./Draggable.module.css";
import { useAppSelector } from "../../hooks";

export enum Axis {
  All,
  Vertical,
  Horizontal,
}

interface Props {
  id: string;
  axis?: Axis;
  dragOverlay?: boolean;
  dragging?: boolean;
  handle?: boolean;
  listeners?: DraggableSyntheticListeners;
  style?: React.CSSProperties;
  buttonStyle?: React.CSSProperties;
  transform?: Transform | null;
}

export const Draggable = forwardRef<HTMLButtonElement, Props>(
  function Draggable(
    {
      id,
      axis,
      dragOverlay,
      dragging,
      handle,
      listeners,
      transform,
      style,
      buttonStyle,
      ...props
    },
    ref,
  ) {
    const selectedItems = useAppSelector(
      (state) => state.selectedItems.selectedItems,
    );

    return (
      <div
        className={classNames(
          styles.Draggable,
          dragOverlay && styles.dragOverlay,
          dragging && styles.dragging,
          handle && styles.handle,
        )}
        style={
          {
            ...style,
            "--translate-x": `${transform?.x ?? 0}px`,
            "--translate-y": `${transform?.y ?? 0}px`,
          } as React.CSSProperties
        }
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
      >
        <button
          id={id}
          {...props}
          aria-label="Draggable"
          data-cypress="draggable-item"
          {...(handle ? {} : listeners)}
          tabIndex={handle ? -1 : undefined}
          ref={ref}
          style={{
            ...buttonStyle,
            cursor: !dragging ? "grab" : "grabbing",
            border: selectedItems?.includes(id) ? "1px solid red" : "none",
          }}
        >
          {axis === Axis.Vertical
            ? draggableVertical
            : axis === Axis.Horizontal
            ? draggableHorizontal
            : draggable}
          {handle ? <Handle {...(handle ? listeners : {})} /> : null}
        </button>
        {id ? <label>{id}</label> : null}
      </div>
    );
  },
);
