
import "boxicons";
import Divider from "../../components/ui/Divider";
import Button from "../../components/ui/Button";
import { useState, useEffect } from "react";
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
import { useLoginMutation, useRegisterMutation } from "../../redux/features/auth/authApi";
import { useAppDispatch } from "../../redux/store";
import { setUser as setReduxUser } from "../../redux/features/auth/authSlice";
import GooglePasswordModal from "../../components/ui/GooglePasswordModal";
import { useModal } from "../../components/ui/Modal";
import { getErrorMessage } from "../../utils/errorHandler";
import { User } from "../../types"; // Import custom User type

interface LoginInputs {
  email: string;
  password: string;
}

interface LoginProps {
  loginFormRef: React.RefObject<HTMLFormElement>;
}

interface GoogleUserInfo {
  name: string;
  email: string | null;
  photoURL: string;
  uid: string;
  provider: 'google' | 'github';
}

const Login = ({ loginFormRef }: LoginProps) => {
  const [see, setSee] = useState(false);
  const [checked, setChecked] = useState(true);
  const { showModal } = useModal();
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [googleUserInfo, setGoogleUserInfo] = useState<GoogleUserInfo | null>(null);
  const [isSocialLoading, setIsSocialLoading] = useState(false);
  const { theme } = useToggle();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [registerUser, { isLoading: isRegisterLoading }] = useRegisterMutation();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
  };

  // Destructure user from useAuth
  const { signInWithGoogle, signInWithGithub, logoutUser, setUser, user } = useAuth();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>();

  // Monitor Supabase User State for Social Login completion
  useEffect(() => {
    // Check if there's a pending social user from redirect (set by AuthProvider)
    const pendingUserData = sessionStorage.getItem("pendingSocialUser");
    if (pendingUserData) {
      try {
        const userInfo = JSON.parse(pendingUserData) as GoogleUserInfo;
        setGoogleUserInfo(userInfo);
        setIsGoogleModalOpen(true);
        sessionStorage.removeItem("pendingSocialUser");
        return; // Don't run the rest of the effect
      } catch (e) {
        console.error("Failed to parse pending social user:", e);
        sessionStorage.removeItem("pendingSocialUser");
      }
    }

    const handleSocialRedirect = async () => {
      // If we have a user (Supabase) but not backend authenticated
      if (!user || localStorage.getItem("isAuthenticated") || isSocialLoading) {
        return;
      }

      const socialProvider = user.providerData?.[0];
      const isSocial = socialProvider?.providerId === 'google' || socialProvider?.providerId === 'github';

      if (isSocial && socialProvider) {
        setIsSocialLoading(true);
        const loadingToast = toast.loading("Finalizing login...");

        try {
          // Try to login to backend with just email (no password for social login)
          const loginResult = await login({
            email: user.email || ""
          }).unwrap();

          if (loginResult.success && loginResult.data) {
            dispatch(setReduxUser({
              user: {
                email: loginResult.data.user?.email || user.email,
                uid: loginResult.data.user?._id || null,
                displayName: loginResult.data.user?.name || user.displayName,
                photoURL: loginResult.data.user?.profileImage || user.photoURL,
                role: (loginResult.data.user?.role as 'student' | 'teacher' | 'admin') || "student",
              },
              token: loginResult.data.accessToken,
            }));
            localStorage.setItem("isAuthenticated", "true");

            toast.dismiss(loadingToast);
            toast.success(`Welcome back, ${loginResult.data.user?.name || user.displayName || "User"}!`);
            navigate(location?.state ? location.state : "/");

            // Show success modal for returning users
            setTimeout(() => {
              showModal({
                type: "success",
                title: "Welcome Back!",
                message: "You have been logged in successfully.",
                confirmText: "Continue",
              });
            }, 100);
          }
        } catch (error) {
          toast.dismiss(loadingToast);
          // User not found in backend -> Proceed to Registration (Password Modal)
          setGoogleUserInfo({
            name: user.displayName || "User",
            email: user.email || null,
            photoURL: user.photoURL || "",
            uid: user.uid,
            provider: socialProvider.providerId as 'google' | 'github'
          });
          setIsGoogleModalOpen(true);
        } finally {
          setIsSocialLoading(false);
        }
      }
    };

    handleSocialRedirect();
  }, [user, navigate, location, login, dispatch, isSocialLoading, showModal]);

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
        localStorage.setItem("isAuthenticated", "true");

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

  const handleGooglePasswordSubmit = async (password: string, email?: string) => {
    if (!googleUserInfo) return;

    const userEmail = googleUserInfo.email || email;

    if (!userEmail) {
      toast.error("Email is required for registration");
      return;
    }

    const loadingToast = toast.loading("Creating account...");

    try {
      // 1. Register the user
      const registerData = {
        name: googleUserInfo.name,
        email: userEmail,
        password: password,
        profileImageUrl: googleUserInfo.photoURL || undefined,
        provider: googleUserInfo.provider,
      };

      const registrationResult = await registerUser(registerData).unwrap();

      if (registrationResult.success) {
        // 2. Login to get token
        const result = await login({
          email: userEmail,
          password: password,
        }).unwrap();

        toast.dismiss(loadingToast);

        if (result.success && result.data) {
          dispatch(setReduxUser({
            user: {
              email: result.data.user?.email || userEmail,
              uid: result.data.user?._id || null,
              displayName: result.data.user?.name || googleUserInfo.name,
              photoURL: result.data.user?.profileImage || googleUserInfo.photoURL,
              role: (result.data.user?.role as 'student' | 'teacher' | 'admin') || "student",
            },
            token: result.data.accessToken,
          }));
          localStorage.setItem("isAuthenticated", "true");

          setIsGoogleModalOpen(false);
          setGoogleUserInfo(null);
          navigate(location?.state ? location.state : "/");

          toast.success(`Welcome to StudyMate!`);

          setTimeout(() => {
            showModal({
              type: "success",
              title: "Account Created!",
              message: "Welcome to StudyMate!",
              confirmText: "Let's Go!",
            });
          }, 100);
        }
      }
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(getErrorMessage(error, "Registration failed."));
    }
  };

  const handleSee = () => {
    setSee(!see);
  };

  const isFormDisabled = isLoading || isSocialLoading;

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        ref={loginFormRef}
        className="animate__animated animate__fadeInRight w-full font-poppins"
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
            disabled={isFormDisabled}
            className="w-full rounded-xl border-2 border-primary bg-primary bg-opacity-25 px-4 py-3 pr-12 font-semibold text-secondary placeholder-secondary outline-none disabled:opacity-60 dark:border-white dark:border-opacity-[0.3] dark:bg-[rgba(255,255,255,.2)] dark:text-white dark:placeholder-white"
          />
          {errors.email ? (
            <div
              role="alert"
              className="flex h-[1.5rem] items-center gap-[2px] text-[10px] text-red-500 sm:gap-1 sm:text-xs"
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
            })}
            type={see ? "text" : "password"}
            placeholder="Password"
            disabled={isFormDisabled}
            className="w-full rounded-xl border-2 border-primary bg-primary bg-opacity-25 px-4 py-3 pr-12 font-semibold text-secondary placeholder-secondary outline-none disabled:opacity-60 dark:border-white dark:border-opacity-[0.3] dark:bg-[rgba(255,255,255,.2)] dark:text-white dark:placeholder-white"
          />
          {errors.password ? (
            <div
              role="alert"
              className="flex h-[1.5rem] items-center gap-[2px] text-[10px] text-red-500 sm:gap-1 sm:text-xs"
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

        <div className="mt-5 flex justify-center gap-3">
          <div
            onClick={!isSocialLoading ? handleGoogleLogin : undefined}
            className={`cursor-pointer rounded-[50%] border-2 border-primary bg-primary bg-opacity-25 px-[10px] py-2 pt-2.5 transition-all duration-300 hover:scale-110 dark:border-white dark:border-opacity-[0.3] dark:bg-[rgba(255,255,255,.2)] ${isSocialLoading ? "cursor-not-allowed opacity-60" : ""}`}
          >
            <FaGoogle className="text-xl text-secondary dark:text-white" />
          </div>
          <div
            onClick={!isSocialLoading ? handleGithubLogin : undefined}
            className={`cursor-pointer rounded-[50%] border-2 border-primary bg-primary bg-opacity-25 px-2.5 py-1 pt-2 transition-all duration-300 hover:scale-110 dark:border-white dark:border-opacity-[0.3] dark:bg-[rgba(255,255,255,.2)] ${isSocialLoading ? "cursor-not-allowed opacity-60" : ""}`}
          >
            <FaGithub className="text-xl text-secondary dark:text-white" />
          </div>
        </div>
      </form>

      <GooglePasswordModal
        isOpen={isGoogleModalOpen}
        onClose={() => {
          setIsGoogleModalOpen(false);
          setGoogleUserInfo(null);
          logoutUser();
        }}
        onSubmit={handleGooglePasswordSubmit}
        isLoading={isRegisterLoading}
        userInfo={googleUserInfo}
      />
    </>
  );
};

export default Login;
Login.propTypes = {
  loginFormRef: PropTypes.object,
};
