import { useState } from "react";
import { Mail, Phone, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaLinkedin } from "react-icons/fa";
import Register from "../assets/register.svg";
import axiosInstance from "../component/axiosInstance";
import { useAuth } from "../component/AuthContext";
import { signInWithGoogle } from "./firebaseAuth";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth(); // Assuming you have a login function in your auth context

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const response = await axiosInstance.post("/auth/login/", {
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 200) {
        login(
          response.data.access_token,
          formData.email,
          response.data.refresh_token,
          response.data.user_id
        ); // Assuming your login function takes a token

        if (response.data.profile.user.role === "user") {
          navigate("/chat");
        } else {
          navigate("/supportchat");
        }
      } else {
        setError("Invalid username or password");
      }
    } catch (error) {
      if (error.response) {
        console.log("Error response:", error.response);
        // If the server returned a response (e.g., 400 status)
        const serverErrors = error.response.data.non_field_errors[0]; // Adjust based on your API structure
        const formErrors = {
          email: "",
          password: "",
        };
        setFormData(formErrors);
        setError(serverErrors);
      } else {
        // Handle other types of errors (e.g., network issues)
        console.log("Error without response:", error.message);

        setError("Network error. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center md:justify-between justify-center min-h-screen  md:px-5">
      <div className="w-1/2 h-[95vh] md:block hidden relative rounded-md overflow-hidden">
        <img
          src={Register}
          alt="AI robot reading a book"
          className="w-full h-full object-cover rounded-md"
        />
      </div>

      {/* Right side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <p className="text-gray-600 mb-2">Logo here</p>
            <h1 className="text-3xl font-bold text-blue-950">
              Welcome to Digital
            </h1>
          </div>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="user@mail.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    className="pl-10"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex justify-end items-end">
                  <Link
                    to={"/forget-password"}
                    type="button"
                    className="text-sm text-blue-500 hover:text-blue-700 font-medium mt-2 "
                  >
                    Forget Password?
                  </Link>
                </div>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
              >
                {isLoading ? (
                  <span className="loader"></span>
                ) : (
                  <span>Login</span>
                )}
              </Button>
            </div>
          </form>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Don’t have account?
              <Link
                to="/signup"
                className="text-blue-500 hover:text-blue-700 font-medium"
              >
                Sign Up
              </Link>
            </p>
          </div>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  Or Login with...
                </span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                type="button"
                onClick={() => signInWithGoogle(login, navigate, setError)}
                variant="outline"
                className="flex-1 border-gray-300 hover:bg-indigo-500 hover:text-white"
                aria-label="Sign up with Google"
              >
                <FcGoogle size={20} />
                Google
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-gray-300 hover:bg-indigo-500 hover:text-white"
                aria-label="Sign up with LinkedIn"
              >
                <FaLinkedin size={20} color="#0077B7" />
                LinkedIn
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
