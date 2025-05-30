import axiosInstance from "../component/axiosInstance";

// Use Vite environment variables
const LINKEDIN_AUTH_URL = "https://www.linkedin.com/oauth/v2/authorization";
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
const SCOPE = "profile email openid"; // Updated scopes for LinkedIn SIWL

export const signUpWithLinkedIn = async (navigate, setError, role = "user") => {
  try {
    // Generate a unique state parameter for CSRF protection
    const state = Math.random().toString(36).substring(2, 15);

    // Open LinkedIn OAuth in a new window
    const authWindow = window.open(
      `${LINKEDIN_AUTH_URL}?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
        REDIRECT_URI
      )}&scope=${encodeURIComponent(SCOPE)}&state=${state}`,
      "_blank",
      "width=600,height=600"
    );

    if (!authWindow) {
      setError("Failed to open LinkedIn authentication window.");
      return;
    }

    // Poll to detect if the popup is closed
    const popupPoll = setInterval(() => {
      if (authWindow.closed) {
        clearInterval(popupPoll);
        window.removeEventListener("message", handleMessage);
        setError("LinkedIn authentication was canceled.");
      }
    }, 500);

    // Handle message from the popup
    const handleMessage = async (event) => {
      if (event.origin !== window.location.origin) return;

      const { code, state: returnedState } = event.data;

      // Verify state parameter to prevent CSRF
      if (!code || returnedState !== state) {
        setError("Invalid LinkedIn authentication response.");
        return;
      }

      try {
        const response = await axiosInstance.post("/auth/linkedin/", {
          code,
          redirect_uri: REDIRECT_URI,
          role,
        });

        if (response.status === 200 || response.status === 201) {
          navigate("/");
        } else {
          setError("LinkedIn sign-up failed. Please try again.");
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "LinkedIn sign-up failed. Please try again."
        );
      } finally {
        // Cleanup
        clearInterval(popupPoll);
        window.removeEventListener("message", handleMessage);
        authWindow.close();
      }
    };

    window.addEventListener("message", handleMessage);
  } catch (error) {
    setError("An error occurred during LinkedIn authentication.");
    console.error("LinkedIn Auth Error:", error);
  }
};
