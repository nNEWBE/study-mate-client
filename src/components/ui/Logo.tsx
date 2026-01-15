import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import logo1 from "../../../public/Logo_01.json";
import logo2 from "../../../public/Logo_02.json";

interface LogoProps {
    className?: string;
    onClick?: () => void;
}

const Logo = ({ className, onClick }: LogoProps) => {
    return (
        <Link
            to="/"
            onClick={onClick}
            className={
                className ||
                "flex w-[190px] cursor-pointer items-center rounded-xl border-2 border-secondary bg-white font-dosis text-2xl font-medium shadow-[0_0_5px_2px] shadow-primary"
            }
        >
            <Lottie
                animationData={logo1}
                loop={true}
                className="w-16 rounded-xl border-[5px] border-white"
            />
            <p className="relative right-3">tudy</p>
            <Lottie
                animationData={logo2}
                loop={true}
                className="relative right-3 w-16 rounded-xl border-[5px] border-white"
            />
            <p className="relative right-6">ate</p>
        </Link>
    );
};

export default Logo;
