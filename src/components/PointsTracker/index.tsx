import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSpring, animated, config } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { PointsTrackerProps } from "./types";
import MarkerIcon from "../../assets/images/marker.svg?react";
import classNames from "classnames";

export const PointsTracker: React.FC<PointsTrackerProps> = ({
  markerHeight = 25,
  markerWidth = 50,
  pointsToWin = 11,
  markerFill,
  labelDirection = "left",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [markerPosition, setMarkerPosition] = useState(pointsToWin - 1);
  const [MARKERS_GAP, SET_MARKERS_GAP] = useState(0);
  const [style, api] = useSpring(() => ({
    from: {
      y: 0,
      zIndex: 10,
      scale: 1,
      width: markerWidth,
      height: markerHeight,
    },
    immediate: (key: string) => key === "y" || key === "zIndex",
    config: config.stiff,
  }));

  const movingFunction = useCallback(
    (active: boolean, y: number, gap: number, currentMarker: number) => {
      if (active) {
        api({
          to: {
            scale: 1.2,
            y: y + currentMarker * (gap + markerHeight),
            zIndex: 100,
          },
        });
      } else {
        const newMarkerPosition = Math.min(
          Math.max(0, Math.round(y / (markerHeight + gap)) + currentMarker),
          pointsToWin - 1
        );

        api({
          to: {
            scale: 1,
            y: newMarkerPosition * (gap + markerHeight),
            zIndex: 100,
          },
        });

        setMarkerPosition(newMarkerPosition);
      }
    },
    [api, markerHeight]
  );

  useEffect(() => {
    if (containerRef.current) {
      const MARKERS_GAP =
        (containerRef.current.clientHeight - pointsToWin * markerHeight) /
        (pointsToWin - 1);
      SET_MARKERS_GAP(MARKERS_GAP);
      movingFunction(false, 0, MARKERS_GAP, pointsToWin - 1);
    }
  }, [markerHeight, movingFunction, pointsToWin]);

  const bind = useDrag(({ active, movement: [, y] }) => {
    movingFunction(active, y, MARKERS_GAP, markerPosition);
  });

  return (
    <div
      className="h-full relative points-tracker"
      ref={containerRef}
      style={{
        width: markerWidth,
      }}
    >
      <animated.div
        style={{ ...style, touchAction: "none" }}
        className="absolute"
      >
        <MarkerIcon
          className={classNames(
            "cursor-grab absolute top-[-310%] left-[-33%]",
            markerFill
          )}
          {...bind()}
          height={markerHeight * 5}
        />
      </animated.div>
      <div>
        {[...Array(pointsToWin).keys()].map((_, index) => (
          <div
            className="absolute"
            style={{
              top: index * ((MARKERS_GAP || 0) + markerHeight),
              zIndex: 1,
            }}
          >
            <label
              className={classNames(
                "absolute font-bold text-cyan-900",
                labelDirection === "left" ? "-left-8" : "-right-8"
              )}
            >
              {pointsToWin - index - 1}
            </label>
            <div
              className="bg-cyan-900 points-tracker__track rounded"
              style={{
                width: markerWidth,
                height: markerHeight,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
