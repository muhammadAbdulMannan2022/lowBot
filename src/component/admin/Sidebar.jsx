import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
// import LogoutModal from './LogoutModal';
import { IoNotificationsOutline } from 'react-icons/io5';
import { FaRegUser } from 'react-icons/fa';

import { MdLogout, MdPrivacyTip } from 'react-icons/md';
import { FaUsers } from 'react-icons/fa6';
import { HiChatBubbleLeftRight } from 'react-icons/hi2';
import { IoMdContacts } from 'react-icons/io';
import Logo from '../../assets/logo.svg';
// import EditProfileModal from './EditProfileModal';
import { useAuth } from '../AuthContext';
import ProfileModal from './ProfileModal';
import LogoutModal from './LogoutModal';

const Sidebar = ({
	children,
	title,
	userName = 'Cameron Malek',
	userType = 'Freebie User',
}) => {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isNotification, setIsNotification] = useState(false);
	const [isVisible, setIsVisble] = useState(false);
	const dropdownRef = useRef(null);
	const buttonRef = useRef(null);
	const notifiactionRef = useRef(null);
	const notifiactionbuttonRef = useRef(null);
	const location = useLocation();
	const [isOpen, setIsOpen] = useState(false);
	const [sideBarDropDown, setSideBarDropDown] = useState(false);
	const role = localStorage.getItem('role');
	const [profileVisible, setProfileVisible] = useState(false);

	const { logout } = useAuth();
	const navigate = useNavigate();
	const handleprofile = () => {
		setIsOpen(!isOpen);
		setIsDropdownOpen(!isDropdownOpen);
		setProfileVisible(!profileVisible);
	};

	useEffect(() => {
		function handleClickOutside(event) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target) &&
				buttonRef.current &&
				!buttonRef.current.contains(event.target)
			) {
				setIsDropdownOpen(false);
				setIsNotification(false);
			}
		}
		// Attach the event listener to the document
		document.addEventListener('click', handleClickOutside);
		// Cleanup: Remove the event listener on component unmount
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, []);

	useEffect(() => {
		function handleClickOutside(event) {
			if (
				notifiactionRef.current &&
				!notifiactionRef.current.contains(event.target) &&
				notifiactionbuttonRef.current &&
				!notifiactionbuttonRef.current.contains(event.target)
			) {
				setIsDropdownOpen(false);
				setIsNotification(false);
			}
		}
		// Attach the event listener to the document
		document.addEventListener('click', handleClickOutside);
		// Cleanup: Remove the event listener on component unmount
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, []);

	const name = localStorage.getItem('username');
	const email = localStorage.getItem('email');

	const onClose = () => {
		setIsVisble(false);
	};

	return (
		<div className="flex flex-col min-h-screen">
			<nav className=" border-t-[20px] border-[#C3DAEF] fixed top-0 z-50 w-full bg-white shadow">
				<div className=" relative px-3 py-3 lg:px-5 lg:pl-3">
					<div className="flex items-center justify-between">
						<div className="flex items-center">
							<button
								onClick={() => setIsSidebarOpen(!isSidebarOpen)}
								aria-controls="logo-sidebar"
								type="button"
								className="inline-flex items-center p-2 text-sm  rounded-lg md:hidden focus:text-white  hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-[rgba(201, 160, 56, 0.3)] 0  ">
								<span className="sr-only">Open sidebar</span>
								<svg
									className="w-6 h-6"
									aria-hidden="true"
									fill="currentColor"
									viewBox="0 0 20 20"
									xmlns="http://www.w3.org/2000/svg">
									<path
										clipRule="evenodd"
										fillRule="evenodd"
										d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
									/>
								</svg>
							</button>
							{/* <Link to="/" className="flex ms-2 md:me-24">
								<img
									className="h-[80px] w-[80px] object-cover cursor-pointer"
									src={
										'https://cdn.pixabay.com/photo/2022/08/22/02/05/logo-7402513_640.png'
									}
									style={{
										width: '50px',
										minWidth: '50px',
										height: '50px',
										minHeight: '50px',
									}}
									alt="Logo"
								/>
							</Link> */}
						</div>
						<div className="text-xl">{title}</div>
						<div className="flex items-center">
							<div className="flex items-center ms-3 gap-2">
								<div className="relative">
									<div className="flex items-center gap-1">
										<button
											ref={buttonRef}
											type="button"
											className="flex cursor-pointer text-sm  rounded-full  "
											aria-expanded={isDropdownOpen}
											onClick={() => {
												setProfileVisible(!profileVisible);
											}}>
											<div className="rounded-full w-8 h-8 aspect-square object-cover  border flex items-center justify-center text-xl uppercase  ">
												<FaUserCircle size={28} color="black" />
											</div>
										</button>
										<h3>Ibrahim Khalil</h3>
									</div>
									{isDropdownOpen && (
										<div
											ref={dropdownRef}
											className="w-[calc(100vw-48px)] sm:!w-[343px] fixed sm:!absolute bg-white top-[55px] right-0 smx:-right-4 left-4 sm:left-[-308px] rounded-lg overflow-hidden z-[15] shadow-[rgba(50,50,93,0.25)_0px_13px_27px_-5px,rgba(0,0,0,0.3)0px_8px_16px_-8px]">
											<div className="w-full p-2 flex flex-col justify-center items-center gap-2">
												<div className="p-2 flex items-center gap-2 self-stretch rounded-lg  shadow-[0px_1px_1px_0px_rgba(0,0,0,0.12)]">
													<div className="rounded-full w-12 h-12 relative overflow-hidden">
														<div className="rounded-full aspect-square object-cover w-full border flex items-center justify-center text-xl uppercase text-white bg-blue-600">
															M
														</div>
													</div>
													<div className="flex flex-col justify-center items-start gap-0.5 flex-1">
														<div className="flex gap-1 items-center">
															<p className="text-subtitle-s1 text-t_color">
																Md Ibrahim Khalil
															</p>
														</div>
														<p className="text-body-b2 text-t_color">
															mdibrahimkhalil516@gmail.com
														</p>
													</div>
												</div>

												<div className="flex items-center justify-center gap-2 self-stretch">
													<button
														type="button"
														className="btn uppercase font-semibold text-[#101828] bg-[#EAECF0] hover:bg-[#D0D5DD] active:bg-[#98A2B3]"
														style={{
															borderRadius: '5px',
															color: 'inherit',
															height: '40px',
															padding: '8px 24px',
															fontSize: '14px',
														}}
														onClick={handleprofile}>
														<div className="flex justify-center items-center gap-2">
															<div className="flex justify-center items-center">
																<img
																	src="https://cdn.ostad.app/public/icons/account-circle-line.svg"
																	style={{
																		width: '19px',
																		minWidth: '19px',
																		height: '19px',
																		minHeight: '19px',
																	}}
																	alt="Profile"
																/>
															</div>
															<p className="whitespace-nowrap ">profile</p>
														</div>
													</button>
													<button
														type="button"
														onClick={() => setIsVisble(!isVisible)}
														className="btn uppercase font-semibold text-[#101828] bg-[#EAECF0] hover:bg-[#D0D5DD] active:bg-[#98A2B3]"
														style={{
															borderRadius: '5px',
															color: 'inherit',
															height: '40px',
															padding: '8px 24px',
															fontSize: '14px',
														}}>
														<div className="flex justify-center items-center gap-2">
															<p className="whitespace-nowrap">Logout</p>
															<div className="flex justify-center items-center">
																<img
																	src="https://cdn.ostad.app/public/icons/logout-box-r-line.svg"
																	style={{
																		width: '19px',
																		minWidth: '19px',
																		height: '19px',
																		minHeight: '19px',
																	}}
																	alt="Logout"
																/>
															</div>
														</div>
													</button>
												</div>
											</div>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
					<LogoutModal isOpen={isVisible} onClose={() => setIsVisble(false)} />
				</div>
			</nav>

			<aside
				id="logo-sidebar"
				className={`fixed shadow-md top-0 left-0 z-40 w-[246px] h-full pt-16 transition-transform ${
					isSidebarOpen ? '' : '-translate-x-full'
				}   sm:translate-x-0 bg-gradient-to-b from-white to-[#DCEBF9]`}
				aria-label="Sidebar">
				<div className="h-full px-3 mt-4 pb-4 overflow-y-auto  bg-gradient-to-b from-white to-[#DCEBF9]">
					<div className="p-4 border-b">
						<div className="flex justify-center mb-4">
							<img
								src={Logo}
								alt="Logo"
								width={120}
								height={40}
								className="h-10 w-auto"
							/>
						</div>
						<div className="text-center">
							<h2 className="font-medium text-lg">
								{userName}{' '}
								<span
									className="text-gray-400 text-xs cursor-pointer hover:underline"
									onClick={() => navigate('/profile')}>
									Edit
								</span>
							</h2>
							<p className="text-sm text-gray-500">{userType}</p>
						</div>
					</div>
					<ul className="space-y-2 font-medium mt-10">
						<li>
							<Link
								to="/supportchat"
								className={`flex items-center p-2 rounded-lg group ${
									location.pathname === '/supportchat'
										? 'bg-[#163B76] text-white'
										: 'text-t_color hover:bg-blue-900 hover:text-white'
								}`}>
								<HiChatBubbleLeftRight
									size={25}
									className="transition duration-75 group-hover:text-t_color"
								/>
								<span className="ms-3 text-t_color">Chats</span>
							</Link>
						</li>

						<li>
							<Link
								to="/dashboard"
								className={`flex items-center p-2 rounded-lg group ${
									location.pathname === '/dashboard'
										? 'bg-[#163B76] text-white'
										: 'text-t_color hover:bg-blue-900 hover:text-white'
								}`}>
								<FaUsers
									size={25}
									className="transition duration-75 group-hover:text-t_color"
								/>
								<span className="ms-3 text-t_color">User Management</span>
							</Link>
						</li>

						<li>
							<Link
								to="/notification"
								className={`flex items-center p-2 rounded-lg group ${
									location.pathname === '/notification'
										? 'bg-[#163B76] text-white'
										: ' hover:bg-blue-900 hover:text-white'
								}`}>
								<IoNotificationsOutline
									size={25}
									className="transition duration-75 group-hover:text-t_color"
								/>
								<span className="ms-3 text-t_color">Notifications</span>
							</Link>
						</li>
						<li>
							<Link
								to="/mettings"
								className={`flex items-center p-2 rounded-lg group ${
									location.pathname === '/mettings'
										? 'bg-[#163B76] text-white'
										: 'text-t_color hover:bg-blue-900 hover:text-white'
								}`}>
								<IoMdContacts
									size={25}
									className="transition duration-75 group-hover:text-t_color"
								/>
								<span className="ms-3 text-t_color">Mettings</span>
							</Link>
						</li>
						<li>
							<Link
								to="/profile"
								className={`flex items-center p-2 rounded-lg group ${
									location.pathname === '/profile'
										? 'bg-[#163B76] text-white'
										: 'text-t_color hover:bg-blue-900 hover:text-white'
								}`}>
								<FaRegUser
									size={20}
									className="transition duration-75 group-hover:text-t_color"
								/>
								<span className="ms-3 text-t_color">Profile</span>
							</Link>
						</li>

						<li className="absolute bottom-10 w-[85%]">
							<button
								onClick={() => setIsVisble(!isVisible)}
								className="w-full justify-start flex items-center gap-2 py-2 px-2 bg-[#C3DAEF] text-gray-700 hover:bg-blue-100">
								<MdLogout
									size={25}
									className="transition duration-75 group-hover:text-t_color"
								/>
								<span className="ms-3 text-t_color">Logout</span>
							</button>
						</li>
					</ul>
				</div>
			</aside>

			<div className="flex-1 min-h-[90vh]  h-auto sm:ml-60 mt-5 overflow-auto   ">
				{children}
			</div>

			<ProfileModal
				isOpen={profileVisible}
				onClose={() => setProfileVisible(false)}
			/>
		</div>
	);
};

export default Sidebar;
