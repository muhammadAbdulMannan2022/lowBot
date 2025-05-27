import { useEffect, useState } from "react";
import { FiArrowLeft, FiX } from "react-icons/fi";

const UserDetailsModal = ({ isOpen, onClose, user }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    profession: "",
    email: "",
    profile_picture: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name:
          (user?.first_name || "") +
          (user?.last_name ? " " + user.last_name : ""),
        phone: user?.phone_number || "",
        profession: user?.profession || "",
        email: user.email || "",
        profile_picture: user?.profile_picture || "",
      });
    }
    console.log(formData, user);
  }, [user]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
        >
          <FiX size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onClose}
            className="text-blue-600 hover:text-blue-700 flex items-center"
          >
            <FiArrowLeft className="mr-2" />
            Back
          </button>
          <h2 className="text-xl font-semibold text-gray-800 ">User details</h2>
          <div></div>
        </div>

        <div className="w-full flex items-center justify-center">
          <img
            src={
              formData.profile_picture
                ? formData.profile_picture
                : "https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg"
            }
            alt=""
            className="h-20 w-20 object-cover border rounded-full"
          />
        </div>
        {/* Form */}
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Name of the user
            </label>
            <input
              type="text"
              name="name"
              readOnly
              value={formData.name}
              className="w-full p-3 border border-gray-300 rounded-lg outline-none"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Phone number
            </label>
            <input
              type="text"
              name="phone"
              readOnly
              value={formData.phone}
              className="w-full p-3 border border-gray-300 rounded-lg outline-none"
            />
          </div>

          {/* Profession */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Profession
            </label>
            <input
              type="text"
              name="profession"
              readOnly
              value={formData.profession}
              className="w-full p-3 border border-gray-300 rounded-lg outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              readOnly
              name="email"
              value={formData.email}
              className="w-full p-3 border border-gray-300 rounded-lg outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={onClose}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
