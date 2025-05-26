// Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import Login from "../assets/login.svg";
import ChangePasswordModal from "./user/ChangePasswordModal";
import ProfileDetailsModal from "./user/ProfileDetailsModal";
import LogoutModal from "./admin/LogoutModal";

const Navbar = ({
  onScrollToHome,
  onScrollToReviews,
  onScrollToFaq,
  onScrollToContact,
  activeSection,
  setActiveSection,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);
  const [isProfileDetailsModalOpen, setIsProfileDetailsModalOpen] =
    useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const dropdownRef = useRef(null);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const isLoggedIn = true;
  const user = {
    name: "Sumon Kumar",
    image:
      "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0=",
  };

  // Close mobile menu and update active section after clicking a link
  const handleLinkClick = (scrollFunction, section) => {
    scrollFunction();
    setActiveSection(section); // Update the active section
    setIsOpen(false); // Close the mobile menu
  };

  return (
    <nav className="shadow-md border-b z-50 fixed top-0 left-0 w-full bg-white">
      <div className="flex flex-wrap items-center justify-between mx-auto p-4">
        <a className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="self-center text-[#012939] text-2xl font-semibold whitespace-nowrap">
            Digital logo
          </span>
        </a>
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse relative">
          {isLoggedIn ? (
            <div className="flex items-center space-x-2">
              <button onClick={toggleDropdown} className="focus:outline-none">
                <img
                  src={user.image}
                  alt="User Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
              </button>
              <span className="text-gray-700">{user.name}</span>
              {isDropdownOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute top-12 right-0 w-[11vw] bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                >
                  <ul className="py-2">
                    <li>
                      <button
                        onClick={() => {
                          setIsChangePasswordModalOpen(true);
                          setIsDropdownOpen(false);
                          setIsLogoutModalOpen(false);
                          setIsProfileDetailsModalOpen(false);
                        }}
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                        Change Password
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setIsChangePasswordModalOpen(false);
                          setIsDropdownOpen(false);
                          setIsLogoutModalOpen(false);
                          setIsProfileDetailsModalOpen(true);
                        }}
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        Profile
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setIsChangePasswordModalOpen(false);
                          setIsDropdownOpen(false);
                          setIsLogoutModalOpen(true);
                          setIsProfileDetailsModalOpen(false);
                        }}
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Log out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <button type="button" className="text-white">
              <img src={Login} alt="Login" />
            </button>
          )}
          <button
            type="button"
            onClick={toggleNavbar}
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-cta"
            aria-expanded={isOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
        <div
          className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${
            isOpen ? "block" : "hidden"
          }`}
          id="navbar-cta"
        >
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
            <li>
              <button
                onClick={() => handleLinkClick(onScrollToHome, "home")}
                className={`block py-2 px-3 md:p-0 rounded-sm ${
                  activeSection === "home"
                    ? "text-white bg-blue-700 md:bg-transparent md:text-blue-700 md:dark:text-blue-500"
                    : "text-black hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500"
                }`}
                aria-current={activeSection === "home" ? "page" : undefined}
              >
                Home
              </button>
            </li>
            <li>
              <button
                onClick={() => handleLinkClick(onScrollToReviews, "reviews")}
                className={`block py-2 px-3 md:p-0 rounded-sm ${
                  activeSection === "reviews"
                    ? "text-white bg-blue-700 md:bg-transparent md:text-blue-700 md:dark:text-blue-500"
                    : "text-black hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500"
                }`}
              >
                Reviews
              </button>
            </li>
            <li>
              <button
                onClick={() => handleLinkClick(onScrollToFaq, "faq")}
                className={`block py-2 px-3 md:p-0 rounded-sm ${
                  activeSection === "faq"
                    ? "text-white bg-blue-700 md:bg-transparent md:text-blue-700 md:dark:text-blue-500"
                    : "text-black hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500"
                }`}
              >
                FAQ
              </button>
            </li>
            <li>
              <button
                onClick={() => handleLinkClick(onScrollToContact, "contact")}
                className={`block py-2 px-3 md:p-0 rounded-sm ${
                  activeSection === "contact"
                    ? "text-white bg-blue-700 md:bg-transparent md:text-blue-700 md:dark:text-blue-500"
                    : "text-black hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500"
                }`}
              >
                Contact
              </button>
            </li>
          </ul>
        </div>
      </div>
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
      />
      <ProfileDetailsModal
        isOpen={isProfileDetailsModalOpen}
        onClose={() => setIsProfileDetailsModalOpen(false)}
      />
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      />
    </nav>
  );
};

export default Navbar;
