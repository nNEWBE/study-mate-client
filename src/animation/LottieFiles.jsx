import Lottie from "lottie-react";
import PropTypes from "prop-types";


const LottieFiles = ({animation,className}) => {
    return (
      <Lottie
        animationData={animation}
        loop={true}
        className={className}
      />
    );
};

export default LottieFiles;

LottieFiles.propTypes = {
  animation: PropTypes.object.isRequired,
  className: PropTypes.string,
};
