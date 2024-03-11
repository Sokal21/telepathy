import React, { useRef, useState } from "react";
import { useSpring, animated, config } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { DirectionMarkerProps } from "./types";
import PencilIcon from "../../assets/images/pencil.svg?react";

export const DirectionMarker: React.FC<DirectionMarkerProps> = ({
  markerHeight = 25,
  markerWidth = 50,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [style, api] = useSpring(() => ({
    from: {
      x: 0,
      zIndex: 10,
      scale: 1,
      width: markerWidth,
      height: markerHeight,
    },
    immediate: (key: string) => key === "x" || key === "zIndex",
    config: config.stiff,
  }));

  const bind = useDrag(({ active, movement: [x] }) => {
    if (containerRef.current) {
      if (active) {
        api({
          to: {
            scale: 1.2,
            x: x + currentPosition,
            zIndex: 100,
          },
        });
      } else {
        const destination =
          containerRef.current.clientWidth / 2 > x + currentPosition
            ? 0
            : containerRef.current.clientWidth - markerWidth;

        api({
          to: {
            scale: 1,
            x: destination,
            zIndex: 100,
          },
        });
        setCurrentPosition(destination);
      }
    }
  });

  return (
    <div
      className="w-full relative points-tracker flex justify-between"
      ref={containerRef}
      style={{
        height: markerHeight,
      }}
    >
      <animated.div
        style={{ ...style, touchAction: "none" }}
        className="absolute"
      >
        <PencilIcon
          className={"cursor-grab absolute top-[-240%] left-[-23%]"}
          {...bind()}
          width={markerWidth*1.5}
        />
      </animated.div>
      <div
        className="bg-cyan-900 points-tracker__track rounded"
        style={{
          width: markerWidth,
          height: markerHeight,
        }}
      />
      <div
        className="bg-cyan-900 points-tracker__track rounded"
        style={{
          width: markerWidth,
          height: markerHeight,
        }}
      />
    </div>
  );
};
