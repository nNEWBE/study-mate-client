import "boxicons";
import Button from "../animation/Button";
import { useContext, useState } from "react";
import { FiEyeOff } from "react-icons/fi";
import { FiEye } from "react-icons/fi";
import PropTypes from "prop-types";
import { FaGoogle } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { MdError } from "react-icons/md";
import useAuth from "../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "animate.css";
import toast from "react-hot-toast";
import { useToggle } from "../context/ToggleProvider";

interface LoginInputs {
  email: string;
  password: string;
}

interface LoginProps {
  loginFormRef: React.RefObject<HTMLFormElement>;
}

const Login = ({ loginFormRef }: LoginProps) => {
  const [see, setSee] = useState(false);
  const [checked, setChecked] = useState(true);
  const { theme } = useToggle();
  const location = useLocation();
  const navigate = useNavigate();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("checked = ", e.target.checked);
    setChecked(e.target.checked);
  };
  const { signInWithGoogle, signInWithGithub, signInUser } = useAuth();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>();

  const onSubmit = async (data: LoginInputs) => {
    const email = data.email;
    const password = data.password;

    try {
      await signInUser(email, password);
      navigate(location?.state ? location.state : "/");
      reset();
      Swal.fire({
        title: "SignIn Successful",
        icon: "success",
        confirmButtonText: "Save",
        iconColor: "#00ffa5",
        background: "#111827",
        buttonsStyling: false,
        color: "#FFFFFF",
        customClass: {
          confirmButton:
            "btn animate__animated animate__rubberBand outline-none bg-[#111827] hover:bg-[#111827] hover:border-[#00ffa5] hover:text-[#00ffa5] border-[4.5px] border-[#00ffa5] text-[#00ffa5] text-2xl font-bold font-edu px-5",
          title: "font-poppins",
        },
      });
    } catch (error: any) {
      const e = error.message.slice(9, error.message.length);
      toast.error(`${e}`);
    }
  };

  const handleSocialLogin = async (socialProvider: () => Promise<any>) => {
    try {
      await socialProvider();
      navigate(location?.state ? location.state : "/");
      Swal.fire({
        title: "SignIn Successful",
        icon: "success",
        confirmButtonText: "Save",
        iconColor: "#00ffa5",
        background: "#111827",
        buttonsStyling: false,
        color: "#FFFFFF",
        customClass: {
          confirmButton:
            "btn animate__animated animate__rubberBand outline-none bg-[#111827] hover:bg-[#111827] hover:border-[#00ffa5] hover:text-[#00ffa5] border-[4.5px] border-[#00ffa5] text-[#00ffa5] text-2xl font-bold font-edu px-5",
          title: "font-poppins",
        },
      });
    } catch (error: any) {
      const e = error.message.slice(9, error.message.length);
      toast.error(`${e}`);
    }
  };

  const handleSee = () => {
    setSee(!see);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      ref={loginFormRef}
      className="animate__animated animate__fadeInRight font-poppins"
    >
      <p className="my-7 text-center font-poppins text-4xl font-bold text-secondary dark:text-white">
        Sign
        <span className="ml-2 rounded-xl border-2 border-[#111827] bg-primary px-2 font-dosis tracking-wider text-[#111827] shadow-[0_0_5px_2px] shadow-primary">
          In
        </span>
      </p>

      <div className="relative">
        <input
          {...register("email", {
            required: {
              value: true,
              message: "Enter your email address",
            },
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Enter a valid email address",
            },
          })}
          type="email"
          placeholder="Email"
          className="mx-auto w-[16.6rem] rounded-xl border-2 border-primary bg-primary bg-opacity-25 px-4 py-3 pr-12 font-semibold text-secondary placeholder-secondary outline-none dark:border-white dark:border-opacity-[0.3] dark:bg-[rgba(255,255,255,.2)] dark:text-white dark:placeholder-white sm:w-[20rem]"
        />
        {errors.email ? (
          <div
            role="alert"
            className="flex h-[1.5rem] items-center gap-1 text-sm text-red-500"
          >
            <MdError />
            <span>{errors.email?.message}</span>
          </div>
        ) : (
          <div className="h-[1.5rem]"></div>
        )}
        <div className="absolute right-4 top-3">
          <box-icon
            name="envelope"
            color={`${theme ? "white" : "black"}`}
          ></box-icon>
        </div>
      </div>

      <div className="relative">
        <input
          {...register("password", {
            required: {
              value: true,
              message: "Enter your password",
            },
            minLength: {
              value: 6,
              message: "Enter at least 6 characters",
            },
            pattern: {
              value: /[A-Z]/,
              message: "Enter an uppercase letter",
            },
            validate: (value) => {
              if (/[a-z]/.test(value)) {
                return true;
              }
              return "Enter an lowercase letter";
            },
          })}
          type={see ? "text" : "password"}
          placeholder="Password"
          className="mx-auto w-[16.6rem] rounded-xl border-2 border-primary bg-primary bg-opacity-25 px-4 py-3 pr-12 font-semibold text-secondary placeholder-secondary outline-none dark:border-white dark:border-opacity-[0.3] dark:bg-[rgba(255,255,255,.2)] dark:text-white dark:placeholder-white sm:w-[20rem]"
        />
        {errors.password ? (
          <div
            role="alert"
            className="flex h-[1.5rem] items-center gap-1 text-sm text-red-500"
          >
            <MdError />
            <span>{errors.password?.message}</span>
          </div>
        ) : (
          <div className="h-[1.5rem]"></div>
        )}
        <div
          onClick={handleSee}
          className="absolute right-4 top-3 cursor-pointer text-2xl text-secondary dark:text-white"
        >
          {see ? <FiEyeOff /> : <FiEye />}
        </div>
      </div>

      <div className="checkbox-wrapper">
        <input
          onChange={onChange}
          checked={checked}
          type="checkbox"
          id="input"
          className="check-input"
        />
        <label htmlFor="input" className="checkbox">
          <svg viewBox="0 0 22 16" fill="none">
            <path d="M1 6.85L8.09677 14L21 1" />
          </svg>
        </label>
        <label
          htmlFor="input"
          className="ml-4 cursor-pointer text-base font-semibold text-secondary dark:text-white"
        >
          Remember Me
        </label>
      </div>

      <div className="mx-auto mt-3 sm:w-full">
        <Button str={"Sign In"} shadow={true}></Button>
      </div>

      <div className="mt-5 flex items-center justify-center">
        <div className="flex-grow border-[1px] border-t border-secondary shadow-[0_0_5px_2px] shadow-primary dark:border-secondary"></div>
        <span
          style={{ textShadow: "1.5px 1px 3px #00ffa5" }}
          className="mx-4 text-center font-semibold text-secondary dark:text-secondary"
        >
          Or
        </span>
        <div className="flex-grow border-[1px] border-t border-secondary shadow-[0_0_5px_2px] shadow-primary dark:border-secondary"></div>
      </div>

      <div className="mt-5 flex justify-center gap-3">
        <div
          onClick={() => handleSocialLogin(signInWithGoogle)}
          className="cursor-pointer rounded-[50%] border-2 border-primary bg-primary bg-opacity-25 px-[10px] py-2 pt-2.5 dark:border-white dark:border-opacity-[0.3] dark:bg-[rgba(255,255,255,.2)]"
        >
          <FaGoogle className="text-xl text-secondary dark:text-white" />
        </div>
        <div
          onClick={() => handleSocialLogin(signInWithGithub)}
          className="cursor-pointer rounded-[50%] border-2 border-primary bg-primary bg-opacity-25 px-2.5 py-1 pt-2 dark:border-white dark:border-opacity-[0.3] dark:bg-[rgba(255,255,255,.2)]"
        >
          <FaGithub className="text-xl text-secondary dark:text-white" />
        </div>
      </div>
    </form>
  );
};

export default Login;

Login.propTypes = {
  loginFormRef: PropTypes.object,
};
