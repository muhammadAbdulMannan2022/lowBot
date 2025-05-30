import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import Navbar from "../../component/user/Navbar";

import { useState, useEffect } from "react";
import axiosInstance from "../../component/axiosInstance";
import Sidebar from "../../component/admin/Sidebar";

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/auth/profile/");
        setProfile(response.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-[#f0f7ff] dark:bg-gray-900">
        <Navbar />
        <div className="flex flex-1 overflow-hidden mt-16">
          <Sidebar />
          <div className="flex-1 flex items-center justify-center">
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-screen bg-[#f0f7ff] dark:bg-gray-900">
        <Navbar />
        <div className="flex flex-1 overflow-hidden mt-16">
          <Sidebar />
          <div className="flex-1 flex items-center justify-center">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#f0f7ff] dark:bg-gray-900">
      <div className="flex flex-1 overflow-hidden md:mt-16 mt-32">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 md:pl-7">
          {/* Profile Header */}
          <Card className="mb-6 border-blue-500 border bg-white dark:bg-gray-800">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                <div className="flex-shrink-0 mx-auto md:mx-0">
                  <img
                    src={
                      profile.profile_picture
                        ? `https://192.168.10.124:3100${profile.profile_picture}`
                        : "https://media.istockphoto.com/id/1289220545/photo/beautiful-woman-smiling-with-crossed-arms.jpg?s=612x612&w=0&k=20&c=qmOTkGstKj1qN0zPVWj-n28oRA6_BHQN8uVLIXg0TF8="
                    }
                    alt="Profile picture"
                    className="rounded-full object-cover w-[120px] h-[120px] md:w-[150px] md:h-[150px]"
                  />
                </div>
                <div className="flex flex-col flex-1 gap-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                      <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-gray-100">
                        {profile.first_name && profile.last_name
                          ? `${profile.first_name} ${profile.last_name}`
                          : "User"}
                      </h1>
                      <p className="text-slate-600 dark:text-gray-400 text-sm md:text-base">
                        {profile.profession || "N/A"}
                      </p>
                      <p className="text-slate-500 dark:text-gray-500 text-sm">
                        {profile.city ? `${profile.city}` : "N/A"}
                      </p>
                    </div>
                    <Button
                      onClick={() => navigate("/edit-profile")}
                      variant="outline"
                      className="w-full md:w-auto flex items-center gap-1 hover:bg-blue-500 hover:text-white dark:bg-gray-900 dark:hover:bg-gray-700 dark:hover:text-white text-blue-600 dark:text-blue-400 border-blue-500 dark:border-gray-600"
                      aria-label="Edit profile"
                    >
                      Edit <Pencil className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </div>
                  <div>
                    <h2 className="font-medium mb-1 text-sm md:text-base text-gray-800 dark:text-gray-100">
                      About me
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-gray-400">
                      {profile.about || "No description provided."}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card className="mb-6 bg-white dark:bg-gray-800">
            <CardHeader>
              <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-gray-100">
                Personal Information
              </h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                <div>
                  <p className="text-sm text-slate-500 dark:text-gray-400 mb-1">
                    First Name
                  </p>
                  <p className="font-medium text-sm md:text-base text-gray-800 dark:text-gray-100">
                    {profile.first_name || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-gray-400 mb-1">
                    Last Name
                  </p>
                  <p className="font-medium text-sm md:text-base text-gray-800 dark:text-gray-100">
                    {profile.last_name || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-gray-400 mb-1">
                    Age
                  </p>
                  <p className="font-medium text-sm md:text-base text-gray-800 dark:text-gray-100">
                    {profile.age ? `${profile.age} years` : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-gray-400 mb-1">
                    Gender
                  </p>
                  <p className="font-medium text-sm md:text-base text-gray-800 dark:text-gray-100">
                    {profile.gender || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-gray-400 mb-1">
                    Educational qualification
                  </p>
                  <p className="font-medium text-sm md:text-base text-gray-800 dark:text-gray-100">
                    {profile.education || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-gray-400 mb-1">
                    Language
                  </p>
                  <p className="font-medium text-sm md:text-base text-gray-800 dark:text-gray-100">
                    {profile.languages || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-gray-400 mb-1">
                    Phone (Personal)
                  </p>
                  <p className="font-medium text-sm md:text-base text-gray-800 dark:text-gray-100">
                    {profile.phone_number || "N/A"}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-sm text-slate-500 dark:text-gray-400 mb-1">
                    Email Address (Business)
                  </p>
                  <p className="font-medium text-sm md:text-base text-gray-800 dark:text-gray-100">
                    {profile.business_email || "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address */}
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-gray-100">
                Address
              </h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                <div>
                  <p className="text-sm text-slate-500 dark:text-gray-400 mb-1">
                    House No.
                  </p>
                  <p className="font-medium text-sm md:text-base text-gray-800 dark:text-gray-100">
                    {profile.house_no || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-gray-400 mb-1">
                    Road No.
                  </p>
                  <p className="font-medium text-sm md:text-base text-gray-800 dark:text-gray-100">
                    {profile.road_no || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-gray-400 mb-1">
                    City/State
                  </p>
                  <p className="font-medium text-sm md:text-base text-gray-800 dark:text-gray-100">
                    {profile.city || profile.state
                      ? `${profile.city} ${profile.state || ""}`
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-gray-400 mb-1">
                    Postal Code
                  </p>
                  <p className="font-medium text-sm md:text-base text-gray-800 dark:text-gray-100">
                    {profile.postcode || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-gray-400 mb-1">
                    Phone number (Home)
                  </p>
                  <p className="font-medium text-sm md:text-base text-gray-800 dark:text-gray-100">
                    {profile.phone_number_home || "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
