import "../styles/style.css";

interface TextRevealProps {
  children: string;
}

const TextReveal = ({ children: text }: TextRevealProps): JSX.Element => {
  return (
    <div className="font-edu sm:text-xl text-lg font-semibold">
      <div className="text-reveal relative z-[2] h-[5.5rem] text-center">
        <span>{text}</span>
      </div>
      <div className="absolute top-0 z-[1] h-[5.5rem] text-center">
        <span className="font-edu text-secondary dark:text-white">{text}</span>
      </div>
    </div>
  );
};

export default TextReveal;
