import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import app from "./firebase";
import axiosInstance from "../component/axiosInstance"; // Adjust path as needed
import { useNavigate } from "react-router-dom";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const signInWithGoogle = async (login, navigate, setError) => {
  try {
    const result = await signInWithPopup(auth, provider);

    const user = result.user;

    const response = await axiosInstance.post("/auth/register/social/", {
      email: user.email,
      role: "user", // Default role for Google login
      auth_provider: "google",
      password: user.uid, // Use Firebase UID as a password placeholder (or handle in backend)
      is_google: true, // Let backend know it's Google login
    });

    if (response.status === 200 || response.status === 201) {
      login(
        response.data.access_token,
        user.email,
        response.data.refresh_token,
        response.data.user_id
      );
      if (response.data.user_data.role === "user") {
        navigate("/chat");
      } else {
        navigate("/supportchat");
      }
    } else {
      setError("Invalid username or password");
    }
  } catch (error) {
    console.error(error);
    setError("Google sign-in failed");
  }
};

export const signUpWithGoogle = async (
  login,
  navigate,
  setError,
  role = "user"
) => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Send registration data to your backend
    const response = await axiosInstance.post("/auth/register/social/", {
      email: user.email,
      role: "user",
      password: user.uid,
      auth_provider: "google",
      is_google: true,
    });

    if (response.status === 201 || response.status === 200) {
      login(
        response.data.access_token,
        user.email,
        response.data.refresh_token,
        response.data.user_id
      );
      navigate("/dashboard");
    } else {
      setError("Registration failed. Please try again.");
    }
  } catch (error) {
    setError("Google sign up failed");
    console.error(error);
  }
};
