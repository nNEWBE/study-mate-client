import AnimatedCursor from "react-animated-cursor";

const Cursor = (): JSX.Element => {
  return (
    <div className="lg:block hidden bg-white">
      <AnimatedCursor
        innerSize={15}
        outerSize={25}
        color="255,255,255"
        outerAlpha={1}
        innerScale={1}
        outerScale={2}
        innerStyle={{
          mixBlendMode: "exclusion",
          border: "5px solid #00ffa5",
          zIndex: 100,
        }}
        outerStyle={{
          mixBlendMode: "exclusion",
          zIndex: 100,
        }}
        showSystemCursor={true}
        trailingSpeed={2}
        clickables={[
          "h1",
          "select",
          "textarea",
          ".link",
          {
            target: ".custom",
            options: {
              innerSize: 12,
              outerSize: 12,
              color: "255, 255, 255",
              outerAlpha: 0.3,
              innerScale: 0.7,
              outerScale: 5,
            },
          },
        ]}
      />
    </div>
  );
};

export default Cursor;
