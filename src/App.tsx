import { animated, useTransition, useSpringRef } from "react-spring";
import { FloatButton } from "antd";
import { useEffect, useRef, useState } from "react";
import { Wheel } from "./components/Wheel";
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  FastForwardOutlined,
  RadarChartOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import cards from "./utils/cards.json";
import { PointsTracker } from "./components/PointsTracker";
import { DirectionMarker } from "./components/DirectionMarker";

const getRandomCard = () => {
  return cards[Math.floor(Math.random() * cards.length)];
};

function App() {
  const [hide, setHide] = useState(false);
  const [card, setCard] = useState<{
    left: string;
    right: string;
  }>();
  const changePointsRef = useRef(() => {});
  const resetPostionsRef = useRef(() => {});

  const transRef = useSpringRef();
  const transitions = useTransition(card, {
    ref: transRef,
    keys: null,
    from: { opacity: 0, transform: "translateX(100%)", left: "50%" },
    enter: { opacity: 1, transform: "translateX(-50%)", left: "50%" },
    leave: { opacity: 0, transform: "translateX(-100%)", left: "50%" },
  });

  useEffect(() => {
    transRef.start();
  }, [card, transRef]);

  return (
    <div className="h-full flex items-center justify-center w-full gap-[68px]">
      <FloatButton.Group shape="circle" style={{ right: 24 }}>
        <FloatButton
          onClick={() => setHide(!hide)}
          icon={!hide ? <EyeInvisibleOutlined /> : <EyeOutlined />}
        />
        <FloatButton
          onClick={() => {
            setCard(getRandomCard());
            resetPostionsRef.current();
            setHide(false);
          }}
          icon={<FastForwardOutlined />}
        />
        <FloatButton
          onClick={() => changePointsRef.current()}
          icon={<RadarChartOutlined />}
        />
        <FloatButton
          icon={<QuestionCircleOutlined />}
          type="primary"
          style={{ right: 94 }}
        />
      </FloatButton.Group>
      <div className="h-3/4">
        <PointsTracker markerFill="fill-orange-500" />
      </div>
      <div className="h-full flex-col flex items-center justify-center">
        <div className="mb-4">
          <Wheel
            width={650}
            height={650}
            changePointsRef={changePointsRef}
            resetPostionsRef={resetPostionsRef}
            hide={hide}
          />
        </div>
        <div className="h-44 mt-6 relative w-full flex justify-center items-start">
          <div className="w-[38rem] mt-4">
            <DirectionMarker />
          </div>
          {transitions((style, i) => (
            <animated.div
              style={{
                ...style,
                zIndex: 1000
              }}
              className="card rounded-2xl items-center drop-shadow-xl flex p-12 h-full w-96 absolute"
            >
              <div className="w-1/2 text-center pr-8">
                <h3>{i?.left}</h3>
              </div>
              <div className="w-1/2 text-center text-white pl-8">
                <h3>{i?.right}</h3>
              </div>
            </animated.div>
          ))}
        </div>
      </div>
      <div className="h-3/4">
        <PointsTracker markerFill="fill-yellow-500" labelDirection="rigth" />
      </div>
    </div>
  );
}

export default App;
