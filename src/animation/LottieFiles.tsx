import Lottie from "lottie-react";

interface LottieFilesProps {
  animation: object;
  className?: string;
}

const LottieFiles = ({ animation, className }: LottieFilesProps): JSX.Element => {
  return (
    <Lottie
      animationData={animation}
      loop={true}
      className={className}
    />
  );
};

export default LottieFiles;
