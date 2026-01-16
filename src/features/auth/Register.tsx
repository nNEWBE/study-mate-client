import { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../../components/ui/Button";
import { FiEyeOff, FiEye } from "react-icons/fi";
import PropTypes from "prop-types";
import { MdError } from "react-icons/md";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { useToggle } from "../../context/ToggleProvider";
import { useRegisterMutation, useLoginMutation } from "../../redux/features/auth/authApi";
import { useAppDispatch } from "../../redux/store";
import { setUser } from "../../redux/features/auth/authSlice";
import { getRandomAvatar } from "../../utils/avatars";
import { getErrorMessage } from "../../utils/errorHandler";

interface RegisterInputs {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterProps {
  registerFormRef: React.RefObject<HTMLFormElement>;
}

const Register = ({ registerFormRef }: RegisterProps) => {
  const [see, setSee] = useState(false);
  const [seeConfirm, setSeeConfirm] = useState(false);
  const { theme } = useToggle();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const [registerUser, { isLoading: isRegisterLoading }] = useRegisterMutation();
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();

  const isLoading = isRegisterLoading || isLoginLoading;

  const {
    register,
    reset,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterInputs>();

  const password = watch("password");

  const onSubmit = async (data: RegisterInputs) => {
    const loadingToast = toast.loading("Creating your account...");

    try {
      // Get a random avatar for the new user
      const randomAvatar = getRandomAvatar();

      const registerData = {
        name: data.name,
        email: data.email,
        password: data.password,
        profileImageUrl: randomAvatar,
        provider: "password" as const,
      };

      // 1. Register the user
      const registerResult = await registerUser(registerData).unwrap();

      if (registerResult.success) {
        // 2. Immediately login to set cookies
        toast.loading("Logging you in...", { id: loadingToast });

        const loginResult = await login({
          email: data.email,
          password: data.password,
        }).unwrap();

        toast.dismiss(loadingToast);

        if (loginResult.success && loginResult.data) {
          // Update Redux state with user info
          dispatch(setUser({
            user: {
              email: loginResult.data.user?.email || data.email,
              uid: loginResult.data.user?._id || null,
              displayName: loginResult.data.user?.name || data.name,
              photoURL: loginResult.data.user?.profileImage || randomAvatar,
              role: (loginResult.data.user?.role as 'student' | 'teacher' | 'admin') || "student",
            },
            token: loginResult.data.accessToken,
          }));

          // Show welcome toast
          toast.success(`Welcome, ${loginResult.data.user?.name || data.name}!`);

          // Dispatch welcome modal event
          window.dispatchEvent(new CustomEvent('showWelcomeModal', {
            detail: {
              name: loginResult.data.user?.name || data.name,
              isRegistration: true
            }
          }));

          navigate(location?.state ? location.state : "/");
          reset();
        }
      }
    } catch (error: any) {
      toast.dismiss(loadingToast);
      const message = getErrorMessage(error, "Registration failed. Please try again.");
      toast.error(message);
    }
  };

  const handleSee = () => {
    setSee(!see);
  };

  const handleSeeConfirm = () => {
    setSeeConfirm(!seeConfirm);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      ref={registerFormRef}
      className="hidden w-full translate-x-[100%] font-poppins"
    >
      <p className="my-5 text-center font-poppins text-4xl font-bold text-secondary dark:text-white">
        Sign
        <span className="ml-2 rounded-xl border-2 border-[#111827] bg-primary px-2 font-dosis tracking-wider text-[#111827] shadow-[0_0_5px_2px] shadow-primary">
          Up
        </span>
      </p>

      {/* Username Field */}
      <div className="relative">
        <input
          {...register("name", {
            required: {
              value: true,
              message: "Enter your username",
            },
            minLength: {
              value: 3,
              message: "Username must be at least 3 characters",
            },
          })}
          type="text"
          placeholder="Username"
          disabled={isLoading}
          className="w-full rounded-xl border-2 border-primary bg-primary bg-opacity-25 px-4 py-3 pr-12 font-semibold text-secondary placeholder-secondary outline-none disabled:opacity-60 dark:border-white dark:border-opacity-[0.3] dark:bg-[rgba(255,255,255,.2)] dark:text-white dark:placeholder-white"
        />
        {errors.name ? (
          <div
            role="alert"
            className="flex h-[1.3rem] items-center gap-[2px] text-[10px] text-red-500 sm:gap-1 sm:text-xs"
          >
            <MdError />
            <span>{errors.name?.message}</span>
          </div>
        ) : (
          <div className="h-[1.3rem]"></div>
        )}
        <div className="absolute right-4 top-3">
          <box-icon
            name="user"
            color={`${theme ? "white" : "black"}`}
          ></box-icon>
        </div>
      </div>

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
          disabled={isLoading}
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
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])/,
              message: "Must contain uppercase and lowercase",
            },
          })}
          type={see ? "text" : "password"}
          placeholder="Password"
          disabled={isLoading}
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

      {/* Confirm Password Field */}
      <div className="relative">
        <input
          {...register("confirmPassword", {
            required: {
              value: true,
              message: "Please confirm your password",
            },
            validate: (value) =>
              value === password || "Passwords do not match",
          })}
          type={seeConfirm ? "text" : "password"}
          placeholder="Confirm Password"
          disabled={isLoading}
          className="w-full rounded-xl border-2 border-primary bg-primary bg-opacity-25 px-4 py-3 pr-12 font-semibold text-secondary placeholder-secondary outline-none disabled:opacity-60 dark:border-white dark:border-opacity-[0.3] dark:bg-[rgba(255,255,255,.2)] dark:text-white dark:placeholder-white"
        />
        {errors.confirmPassword ? (
          <div
            role="alert"
            className="flex h-[1.3rem] items-center gap-[2px] text-[10px] text-red-500 sm:gap-1 sm:text-xs"
          >
            <MdError />
            <span>{errors.confirmPassword?.message}</span>
          </div>
        ) : (
          <div className="h-[1.3rem]"></div>
        )}
        <div
          onClick={handleSeeConfirm}
          className="absolute right-4 top-3 cursor-pointer text-2xl text-secondary dark:text-white"
        >
          {seeConfirm ? <FiEyeOff /> : <FiEye />}
        </div>
      </div>

      <div className="mx-auto mt-2 w-full">
        <Button
          str={isLoading ? "Please Wait..." : "Sign Up"}
          shadow={true}
          disabled={isLoading}
        />
      </div>
    </form>
  );
};

export default Register;

Register.propTypes = {
  registerFormRef: PropTypes.object,
};
