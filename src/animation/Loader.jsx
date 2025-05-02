import LottieFiles from "./LottieFiles";
import loader from "../../public/loader4.json"

const Loader = () => {
    return (
      <div className="h-screen flex justify-center items-center">
        <LottieFiles
          animation={loader}
          className="w-[10rem] sm:w-[15rem]"
        />
      </div>
    );
};

export default Loader;