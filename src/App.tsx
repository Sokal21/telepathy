import { animated, useTransition, useSpringRef } from "react-spring";
import { Button } from "antd";
import { useEffect, useRef, useState } from "react";
import { Wheel } from "./components/Wheel";
import { getRandomArbitrary } from "./utils";

const generateImageUrl = (): string => {
  const folder = getRandomArbitrary(1, 14);
  const image = getRandomArbitrary(1, 14);

  return `/cards/${folder}/image_part_0${image < 10 ? `0${image}` : image}.jpg`;
};

function App() {
  const [hide, setHide] = useState(false);
  const [image, setImage] = useState<string>();
  const changePointsRef = useRef(() => {});

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
      <div className="mb-4">
        <Wheel
          width={650}
          height={650}
          changePointsRef={changePointsRef}
          hide={hide}
        />
      </div>
      <div className="flex justify-center items-centers gap-4">
        <Button onClick={() => setHide(!hide)}>
          {!hide ? "Ocultar medidor" : "Mostrar medidor"}
        </Button>
        <Button onClick={() => setImage(generateImageUrl())}>
          Nueva carta
        </Button>
        <Button onClick={() => changePointsRef.current()}>
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
