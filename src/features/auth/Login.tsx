
import "boxicons";
import Divider from "../../components/ui/Divider";
import Button from "../../components/ui/Button";
import { useState } from "react";
import { FiEyeOff, FiEye } from "react-icons/fi";
import PropTypes from "prop-types";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { MdError } from "react-icons/md";
import useAuth from "../../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import "animate.css";
import toast from "react-hot-toast";
import { useToggle } from "../../context/ToggleProvider";
import { useLoginMutation } from "../../redux/features/auth/authApi";
import { useAppDispatch } from "../../redux/store";
import { setUser as setReduxUser } from "../../redux/features/auth/authSlice";
import { useModal } from "../../components/ui/Modal";
import { getErrorMessage } from "../../utils/errorHandler";
import { User } from "../../types";

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
  const { showModal } = useModal();
  const { theme } = useToggle();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
  };

  // Destructure user from useAuth
  const { signInWithGoogle, signInWithGithub } = useAuth();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>();


  const onSubmit = async (data: LoginInputs) => {
    const loadingToast = toast.loading(
      <div className="flex items-center gap-2">
        <span className="font-semibold">Signing in...</span>
      </div>
    );

    try {
      const result = await login({
        email: data.email,
        password: data.password,
      }).unwrap();

      toast.dismiss(loadingToast);

      if (result.success && result.data) {
        dispatch(setReduxUser({
          user: {
            email: result.data.user?.email || data.email,
            uid: result.data.user?._id || null,
            displayName: result.data.user?.name || null,
            photoURL: result.data.user?.profileImage || null,
            role: (result.data.user?.role as 'student' | 'teacher' | 'admin') || "student",
          },
          token: result.data.accessToken,
        }));

        navigate(location?.state ? location.state : "/");
        reset();

        toast.success(`Welcome back, ${result.data.user?.name || "User"}!`);

        setTimeout(() => {
          showModal({
            type: "success",
            title: "SignIn Successful",
            message: "Welcome back to StudyMate!",
            confirmText: "Continue",
          });
        }, 100);
      }
    } catch (error: any) {
      toast.dismiss(loadingToast);
      const message = getErrorMessage(error, "Login failed. Please try again.");
      toast.error(message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      // Redirect happens automatically
    } catch (error: any) {
      const message = getErrorMessage(error, "Google login failed.");
      toast.error(message);
    }
  };

  const handleGithubLogin = async () => {
    try {
      await signInWithGithub();
      // Redirect happens automatically
    } catch (error: any) {
      const message = getErrorMessage(error, "Github login failed.");
      toast.error(message);
    }
  };

  const handleSee = () => {
    setSee(!see);
  };

  const isFormDisabled = isLoading;

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        ref={loginFormRef}
        className="animate__animated animate__fadeInRight w-full font-poppins"
      >
        <p className="my-5 text-center font-poppins text-4xl font-bold text-secondary dark:text-white">
          Sign
          <span className="ml-2 rounded-xl border-2 border-[#111827] bg-primary px-2 font-dosis tracking-wider text-[#111827] shadow-[0_0_5px_2px] shadow-primary">
            In
          </span>
        </p>

        {/* Email Field */}
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
            disabled={isFormDisabled}
            className="w-full rounded-xl border-2 border-primary bg-primary bg-opacity-25 px-4 py-3 pr-12 font-semibold text-secondary placeholder-secondary outline-none disabled:opacity-60 dark:border-white dark:border-opacity-[0.3] dark:bg-[rgba(255,255,255,.2)] dark:text-white dark:placeholder-white"
          />
          {errors.email ? (
            <div
              role="alert"
              className="flex h-[1.3rem] items-center gap-[2px] text-[10px] text-red-500 sm:gap-1 sm:text-xs"
            >
              <MdError />
              <span>{errors.email?.message}</span>
            </div>
          ) : (
            <div className="h-[1.3rem]"></div>
          )}
          <div className="absolute right-4 top-3">
            <box-icon
              name="envelope"
              color={`${theme ? "white" : "black"}`}
            ></box-icon>
          </div>
        </div>

        {/* Password Field */}
        <div className="relative">
          <input
            {...register("password", {
              required: {
                value: true,
                message: "Enter your password",
              },
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            type={see ? "text" : "password"}
            placeholder="Password"
            disabled={isFormDisabled}
            className="w-full rounded-xl border-2 border-primary bg-primary bg-opacity-25 px-4 py-3 pr-12 font-semibold text-secondary placeholder-secondary outline-none disabled:opacity-60 dark:border-white dark:border-opacity-[0.3] dark:bg-[rgba(255,255,255,.2)] dark:text-white dark:placeholder-white"
          />
          {errors.password ? (
            <div
              role="alert"
              className="flex h-[1.3rem] items-center gap-[2px] text-[10px] text-red-500 sm:gap-1 sm:text-xs"
            >
              <MdError />
              <span>{errors.password?.message}</span>
            </div>
          ) : (
            <div className="h-[1.3rem]"></div>
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
            disabled={isFormDisabled}
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

        <div className="mx-auto mt-3 w-full">
          <Button
            str={isLoading ? "Signing In..." : "Sign In"}
            shadow={true}
            disabled={isFormDisabled}
          />
        </div>

        <Divider str="Or Sign In with" />

        {/* Social Login Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handleGoogleLogin}
            type="button"
            disabled={isFormDisabled}
            className="flex items-center gap-2 rounded-xl border-2 border-primary bg-primary bg-opacity-10 px-6 py-2 pb-3 pt-3 font-semibold text-secondary transition-all dark:bg-[rgba(255,255,255,.2)] dark:border-white dark:border-opacity-[0.3] dark:text-white disabled:opacity-50"
          >
            <FaGoogle className="text-xl" />
            <span>Google</span>
          </button>
          <button
            onClick={handleGithubLogin}
            type="button"
            disabled={isFormDisabled}
            className="flex items-center gap-2 rounded-xl border-2 border-primary bg-primary bg-opacity-10 px-6 py-2 pb-3 pt-3 font-semibold text-secondary transition-all dark:bg-[rgba(255,255,255,.2)] dark:border-white dark:border-opacity-[0.3] dark:text-white disabled:opacity-50"
          >
            <FaGithub className="text-xl" />
            <span>GitHub</span>
          </button>
        </div>
      </form>
    </>
  );
};

export default Login;
Login.propTypes = {
  loginFormRef: PropTypes.object,
};
