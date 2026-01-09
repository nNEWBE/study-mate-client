import LottieFiles from "../components/ui/LottieFiles";
import error from "../../public/Error.json";
import Button from "../components/ui/Button";
import { Link, useNavigate } from "react-router-dom";

const Error = (): JSX.Element => {
  const navigate = useNavigate();

  const handleBack = (): void => {
    navigate(-1);
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-0 bg-white dark:bg-secondary">
      <LottieFiles
        animation={error}
        className="relative bottom-16 sm:bottom-10 sm:w-[40rem]"
      />
      <div className="flex items-center gap-7">
        <div onClick={handleBack} className="relative bottom-24">
          <Button str={"Back"} shadow={true} />
        </div>
        <div className="relative bottom-24">
          <Link to={"/"}>
            <Button str={"Home"} shadow={true} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Error;
