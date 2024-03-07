import {
  config,
  useSpring,
  animated,
  useTransition,
  useSpringRef,
} from "react-spring";
import { Button, Slider } from "antd";
import { useEffect, useState } from "react";

const getRandomArbitrary = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateImageUrl = (): string => {
  const folder = getRandomArbitrary(1, 14);
  const image = getRandomArbitrary(1, 14);

  return `/cards/${folder}/image_part_0${image < 10 ? `0${image}` : image}.jpg`;
};

function App() {
  const [showBar, setShowBar] = useState(false);
  const [selectorPosition, setSelectorPosition] = useState(0);
  const [image, setImage] = useState<string>();

  const [pointsStyles, apiPointsStyles] = useSpring(() => ({
    from: {
      left: "0",
    },
    config: config.stiff,
  }));

  const [barStyles, apiBarStyles] = useSpring(() => ({
    from: {
      width: "0%",
    },
    config: config.stiff,
  }));

  useEffect(() => {
    if (showBar) {
      apiBarStyles({
        to: {
          width: "0%",
        },
      });
    } else {
      apiBarStyles({
        to: {
          width: "100%",
        },
      });
    }
  }, [apiBarStyles, showBar]);

  const transRef = useSpringRef();
  const transitions = useTransition(image, {
    ref: transRef,
    keys: null,
    from: { opacity: 0, transform: "translateX(100%)", left: "50%" },
    enter: { opacity: 1, transform: "translateX(-50%)", left: "50%" },
    leave: { opacity: 0, transform: "translateX(-100%)", left: "50%" },
  });

  useEffect(() => {
    transRef.start();
  }, [image, transRef]);

  return (
    <div className="h-full flex-col flex items-center justify-center w-3/4">
      <div className="w-[80%]">
        <div className="bg-violet-200 h-52 relative overflow-hidden rounded-xl">
          {
            <div
              className="w-3 h-full absolute bg-red-700 z-50 border-2"
              style={{
                left: `${selectorPosition}%`,
              }}
            />
          }
          <animated.div
            className="h-full absolute bg-violet-500 z-40"
            style={barStyles}
          />
          <animated.div className="absolute flex h-full" style={pointsStyles}>
            <div className="w-7 bg-yellow-400 text-center">2</div>
            <div className="w-7 bg-pink-700 text-center">3</div>
            <div className="w-7 bg-sky-600 text-center">4</div>
            <div className="w-7 bg-pink-700 text-center">3</div>
            <div className="w-7 bg-yellow-400 text-center">2</div>
          </animated.div>
        </div>
        <div className="w-full">
          <Slider
            min={1}
            max={100}
            onChange={setSelectorPosition}
            value={typeof selectorPosition === "number" ? selectorPosition : 0}
          />
        </div>
      </div>
      <div className="flex justify-center items-centers gap-4">
        <Button onClick={() => setShowBar(!showBar)}>
          {showBar ? "Ocultar medidor" : "Mostrar medidor"}
        </Button>
        <Button onClick={() => setImage(generateImageUrl())}>
          Nueva carta
        </Button>
        <Button
          onClick={() =>
            apiPointsStyles({
              to: {
                left: `${getRandomArbitrary(0, 100)}%`,
              },
            })
          }
        >
          Nueva position
        </Button>
      </div>
      <div className="h-44 mt-6 relative w-full">
        {transitions((style, i) => (
          <animated.div style={style} className={"h-full absolute"}>
            <img className="h-full" src={i} />
          </animated.div>
        ))}
      </div>
    </div>
  );
}

export default App;
