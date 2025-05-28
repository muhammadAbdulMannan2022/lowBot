// import { useState, useRef, useEffect } from 'react';
// import axios from 'axios';
// import { Paperclip, Plus, Video, Send, Minus, X } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { cn } from '@/lib/utils';
// import { FiMic } from 'react-icons/fi';
// import Navbar from '../../component/user/Navbar';
// import Sidebar from '../../component/user/UserSidebar';
// import VoiceInput from '../../component/user/VoiceModal';
// import OnlineVideoModal from '../../component/user/OnlineVideoModal';
// import ChatSideBaIcon from '../../assets/chatbar.svg';
// import videoMic from '../../assets/video.svg';
// import voice from '../../assets/voice.svg';
// import { Link, useNavigate, useParams } from 'react-router-dom';
// import axiosInstance from '../../component/axiosInstance';
// import SupportOptions from '../../components/support-options';
// import MettingOptions from '../../components/support-options-metting';

// export default function ChatInterface() {
// 	const [activeTab, setActiveTab] = useState('solved');
// 	const [voiceActive, setVoiceActive] = useState(false);
// 	const [videoActive, setVideoActive] = useState(false);
// 	const [sidebarData, setSideBarData] = useState([]);
// 	const [message, setMessage] = useState('');
// 	const [messages, setMessages] = useState([]);
// 	const [showBotReply, setShowBotReply] = useState(false);
// 	const [timeMettingShow, setTimeMettingShow] = useState(false);
// 	const [isChatHistoryOpen, setIsChatHistoryOpen] = useState(false);
// 	const [chatId, setChatId] = useState(null);
// 	const [isLoading, setIsLoading] = useState(false);
// 	const inputRef = useRef(null);
// 	const navigation = useNavigate();
// 	const route = useParams();

// 	const messagesEndRef = useRef(null);

// 	useEffect(() => {
// 		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
// 	}, [messages]);

// 	// Create axios instance

// 	// Check for chatId in route params on mount
// 	useEffect(() => {
// 		const id = route.id;
// 		console.log(id, '8666'); // Access the id parameter from the route object
// 		if (id) {
// 			setChatId(id);
// 			setShowBotReply(true);
// 			fetchChatHistory(id);
// 		}
// 	}, [route.id]); // Dependency is route.id, not route.params

// 	// Auto-focus the input on mount
// 	useEffect(() => {
// 		if (inputRef.current) {
// 			inputRef.current.focus();
// 		}
// 		fetchChat();
// 	}, []);

// 	const fetchChat = async () => {
// 		try {
// 			const response = await axiosInstance.get(`/chats/`);
// 			const chats = response.data;

// 			// Categorize chats by status and add timestamp logic
// 			const now = new Date();
// 			const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
// 			const yesterday = new Date(today);
// 			yesterday.setDate(yesterday.getDate() - 1);

// 			const categorizedChats = {
// 				today: { solved: [], unsolved: [] },
// 				yesterday: { solved: [], unsolved: [] },
// 			};

// 			chats.forEach((chat) => {
// 				const chatDate = new Date(chat.created_at);
// 				const isToday = chatDate >= today;
// 				const isYesterday = chatDate >= yesterday && chatDate < today;
// 				const category = chat.status === 'SOLVED' ? 'solved' : 'unsolved';

// 				if (isToday) {
// 					categorizedChats.today[category].push(chat);
// 				} else if (isYesterday) {
// 					categorizedChats.yesterday[category].push(chat);
// 				}
// 			});

// 			setSideBarData(categorizedChats);
// 			console.log('response', response.data);
// 		} catch (error) {
// 			console.error('Error fetching chat history:', error);
// 			alert('An error occurred while fetching chat history.');
// 		}
// 	};

// 	// Fetch chat history
// 	const fetchChatHistory = async (id) => {
// 		try {
// 			const response = await axiosInstance.get(`/chats/${id}/history/`);
// 			setMessages(response.data);

// 			console.log('response', response.data);
// 		} catch (error) {
// 			console.error('Error fetching chat history:', error);
// 			alert('An error occurred while fetching chat history.');
// 		}
// 	};

// 	// Handle sending the title and creating a new chat
// 	const handleSendMessage = async () => {
// 		if (!message.trim()) return;

// 		setIsLoading(true);
// 		try {
// 			// Step 1: Create a new chat with just the title
// 			// The backend will automatically set the user field using request.user
// 			let newChatId;
// 			if (!chatId) {
// 				const chatResponse = await axiosInstance.post('/chats/', {
// 					title: message,
// 				});

// 				console.log('chatResponse', chatResponse.data.chat_id);

// 				newChatId = chatResponse.data.chat_id;
// 				// Use chat_id as per your serializer

// 				await axiosInstance.post(`/chats/${newChatId}/history/`, {
// 					message: 'Please enter a title for this conversation?',
// 					sender_type: 'bot',
// 				});

// 				// Step 2: Navigate to the same screen with chatId as a param
// 				setChatId(newChatId);
// 				await axiosInstance.post(`/chats/${newChatId || chatId}/history/`, {
// 					message: message,
// 					sender_type: 'user',
// 				});

// 				navigation(`/chat/${newChatId}`);
// 			}
// 			console.log(newChatId);

// 			// Step 3: Save the title as the first message in chat history

// 			if (messages.length === 4) {
// 				await axiosInstance.post(`/chats/${newChatId || chatId}/history/`, {
// 					message: 'Please describe the topic you would like to discuss.',
// 					sender_type: 'bot',
// 				});
// 			}
// 			await axiosInstance.post(`/chats/${chatId}/history/`, {
// 				message: message,
// 				sender_type: 'user',
// 			});
// 			await fetchChatHistory(chatId);
// 			// Update local messages state

// 			setMessage('');
// 			setShowBotReply(true);
// 		} catch (error) {
// 			console.error('Error creating chat:', error);
// 			// alert('An error occurred while creating the chat.');
// 		} finally {
// 			setIsLoading(false);
// 		}
// 	};

// 	// Handle priority selection
// 	const handlePrioritySelect = async (priority) => {
// 		if (!chatId) return;

// 		setIsLoading(true);
// 		try {
// 			// Save the priority as a message in chat history
// 			await axiosInstance.post(`/chats/${chatId}/history/`, {
// 				message: 'Please choose the appropriate priority level.',
// 				sender_type: 'bot',
// 			});
// 			await axiosInstance.post(`/chats/${chatId}/history/`, {
// 				message: priority,
// 				sender_type: 'user',
// 			});
// 			await axiosInstance.put(`/chats/${chatId}/`, {
// 				problem_level: priority,
// 			});
// 			setMessages((prev) => [
// 				...prev,
// 				{
// 					sender_type: 'bot',
// 					message: 'Please choose the appropriate priority level.',
// 				},
// 			]);
// 			setMessages((prev) => [
// 				...prev,
// 				{ sender_type: 'user', message: priority },
// 			]);

// 			fetchChatHistory(chatId);
// 			// Update local messages state

// 			// Open the modal after priority selection
// 		} catch (error) {
// 			console.error('Error saving priority:', error);
// 			alert('An error occurred while saving the priority.');
// 		} finally {
// 			setIsLoading(false);
// 		}
// 	};

// 	// Handle Enter key press to send message
// 	const handleKeyDown = (e) => {
// 		if (e.key === 'Enter') {
// 			handleSendMessage();
// 		}
// 	};

// 	// Toggle chat history sidebar
// 	const toggleChatHistory = () => {
// 		setIsChatHistoryOpen((prev) => !prev);
// 	};

// 	// Modal Component
// 	const [isExpanded, setIsExpanded] = useState(false);

// 	console.log('mess', messages, chatId);

// 	const handleMark = async () => {
// 		await axiosInstance.put(`chats/${chatId}/mark-as-solved/`, {});
// 		fetchChat();
// 		fetchChatHistory(chatId);
// 	};

// 	return (
// 		<div className="flex flex-col h-screen bg-white">
// 			<Button
// 				variant="ghost"
// 				className="fixed top-20 -left-3 z-0 md:hidden"
// 				onClick={toggleChatHistory}
// 				aria-label="Toggle Chat History">
// 				<img src={ChatSideBaIcon} alt="" className="h-10 w-10" />
// 			</Button>
// 			<Navbar />
// 			<div className="flex flex-1 mt-16">
// 				{/* User Sidebar */}
// 				<Sidebar />

// 				{/* Overlay for Chat History on Mobile */}
// 				{isChatHistoryOpen && (
// 					<div
// 						className="fixed inset-0 bg-black/50 z-30 md:hidden"
// 						onClick={toggleChatHistory}
// 						aria-hidden="true"
// 					/>
// 				)}

// 				{/* Chat History Sidebar */}
// 				<div
// 					className={cn(
// 						'fixed inset-y-0 left-0 w-64 bg-white border-r md:z-0 z-40 transition-transform duration-300 ease-in-out md:static md:w-80 md:translate-x-0',
// 						isChatHistoryOpen ? 'translate-x-0' : '-translate-x-full'
// 					)}>
// 					<div className="p-4 border-b">
// 						<h2 className="text-md font-medium text-gray-700 mb-4">
// 							Chats History
// 						</h2>
// 						<Link
// 							to={'/chat'}
// 							onClick={() => {
// 								setChatId(null);
// 								setMessages([]);
// 							}}>
// 							<Button
// 								variant="outline"
// 								className="w-full flex items-center justify-center gap-2 hover:text-white">
// 								<Plus className="h-4 w-4" />
// 								New Chat
// 							</Button>
// 						</Link>
// 					</div>

// 					{/* Tabs */}
// 					<div className="flex border-b">
// 						<button
// 							className={cn(
// 								'flex-1 py-2 text-center text-sm font-medium',
// 								activeTab === 'solved'
// 									? 'bg-blue-500 text-white'
// 									: 'bg-gray-100 text-gray-600'
// 							)}
// 							onClick={() => setActiveTab('solved')}>
// 							Solved
// 						</button>
// 						<button
// 							className={cn(
// 								'flex-1 py-2 text-center text-sm font-medium',
// 								activeTab === 'unsolved'
// 									? 'bg-blue-500 text-white'
// 									: 'bg-gray-100 text-gray-600'
// 							)}
// 							onClick={() => setActiveTab('unsolved')}>
// 							Unsolved
// 						</button>
// 					</div>

// 					{/* Chat List */}
// 					<div className="overflow-y-auto h-[calc(100vh-300px)] px-2">
// 						<div className="p-2">
// 							{Object.entries(sidebarData).map(([date, categories]) => {
// 								const hasChats =
// 									categories.solved.length > 0 ||
// 									categories.unsolved.length > 0;
// 								if (!hasChats) return null;

// 								return (
// 									<div key={date}>
// 										<h3 className="px-2 py-1 text-sm font-medium text-gray-500">
// 											{date === 'today' ? 'Today' : 'Yesterday'}
// 										</h3>
// 										{activeTab === 'solved' && categories.solved.length > 0 && (
// 											<div>
// 												{categories.solved.map((chat) => {
// 													return (
// 														<div key={chat.chat_id}>
// 															<div
// 																className={`${
// 																	chatId == chat.chat_id ? 'bg-[#DCEBF9]' : ''
// 																} p-2 border shadow-md rounded-md mb-2 flex justify-between items-center cursor-pointer`}
// 																onClick={() =>
// 																	navigation(`/chat/${chat.chat_id}`)
// 																}>
// 																<span
// 																	className="text-sm text-gray-700 truncate"
// 																	onClick={(e) => {
// 																		e.stopPropagation();
// 																		navigation(`/chat/${chat.chat_id}`);
// 																		setIsExpanded(!isExpanded);
// 																	}}>
// 																	{chat.title}
// 																</span>
// 																{isExpanded == chat.chat_id ? (
// 																	<Minus
// 																		className="h-4 w-4 text-gray-500 cursor-pointer"
// 																		onClick={(e) => {
// 																			e.stopPropagation();
// 																			setIsExpanded(false);
// 																		}}
// 																	/>
// 																) : (
// 																	<Plus
// 																		className="h-4 w-4 text-gray-500 cursor-pointer"
// 																		onClick={(e) => {
// 																			e.stopPropagation();
// 																			setIsExpanded(chat.chat_id);
// 																		}}
// 																	/>
// 																)}
// 															</div>
// 															{isExpanded == chat.chat_id && (
// 																<div className="py-2 mb-1 flex items-center gap-2">
// 																	<div className="bg-[#DCEBF9] shadow-md w-[50%] p-1 rounded-md flex items-center px-4 py-2">
// 																		<svg
// 																			className="w-4 h-4 mr-1"
// 																			viewBox="0 0 24 24"
// 																			fill="none"
// 																			xmlns="http://www.w3.org/2000/svg">
// 																			<rect
// 																				width="18"
// 																				height="18"
// 																				x="3"
// 																				y="3"
// 																				rx="2"
// 																				stroke="currentColor"
// 																				strokeWidth="2"
// 																			/>
// 																			<path
// 																				d="M8 10h8M8 14h4"
// 																				stroke="currentColor"
// 																				strokeWidth="2"
// 																				strokeLinecap="round"
// 																			/>
// 																		</svg>
// 																		<span className="text-xs">Summary</span>
// 																	</div>
// 																	<div className="bg-[#DCEBF9] shadow-md w-[50%] p-1 rounded-md flex items-center px-4 py-2">
// 																		<Video className="w-4 h-4 mr-1" />
// 																		<span className="text-xs">Watch video</span>
// 																	</div>
// 																</div>
// 															)}
// 														</div>
// 													);
// 												})}
// 											</div>
// 										)}
// 										{activeTab === 'unsolved' &&
// 											categories.unsolved.length > 0 && (
// 												<div>
// 													{categories.unsolved.map((chat) => {
// 														return (
// 															<div key={chat.chat_id}>
// 																<div
// 																	className={`${
// 																		chatId == chat.chat_id ? 'bg-[#DCEBF9]' : ''
// 																	} p-2 border shadow-md rounded-md mb-2 flex justify-between items-center cursor-pointer`}
// 																	onClick={() =>
// 																		navigation(`/chat/${chat.chat_id}`)
// 																	}>
// 																	<span
// 																		className="text-sm text-gray-700 truncate"
// 																		onClick={(e) => {
// 																			e.stopPropagation();
// 																			navigation(`/chat/${chat.chat_id}`);
// 																			setIsExpanded(!isExpanded);
// 																		}}>
// 																		{chat.title}
// 																	</span>
// 																	{isExpanded == chat.chat_id ? (
// 																		<Minus
// 																			className="h-4 w-4 text-gray-500 cursor-pointer"
// 																			onClick={(e) => {
// 																				e.stopPropagation();
// 																				setIsExpanded(false);
// 																			}}
// 																		/>
// 																	) : (
// 																		<Plus
// 																			className="h-4 w-4 text-gray-500 cursor-pointer"
// 																			onClick={(e) => {
// 																				e.stopPropagation();
// 																				setIsExpanded(chat.chat_id);
// 																			}}
// 																		/>
// 																	)}
// 																</div>
// 																{isExpanded == chat.chat_id && (
// 																	<div className="py-2 mb-1 flex items-center gap-2">
// 																		<div className="bg-[#DCEBF9] shadow-md w-[50%] p-1 rounded-md flex items-center px-4 py-2">
// 																			<svg
// 																				className="w-4 h-4 mr-1"
// 																				viewBox="0 0 24 24"
// 																				fill="none"
// 																				xmlns="http://www.w3.org/2000/svg">
// 																				<rect
// 																					width="18"
// 																					height="18"
// 																					x="3"
// 																					y="3"
// 																					rx="2"
// 																					stroke="currentColor"
// 																					strokeWidth="2"
// 																				/>
// 																				<path
// 																					d="M8 10h8M8 14h4"
// 																					stroke="currentColor"
// 																					strokeWidth="2"
// 																					strokeLinecap="round"
// 																				/>
// 																			</svg>
// 																			<span className="text-xs">Summary</span>
// 																		</div>
// 																		<div className="bg-[#DCEBF9] shadow-md w-[50%] p-1 rounded-md flex items-center px-4 py-2">
// 																			<Video className="w-4 h-4 mr-1" />
// 																			<span className="text-xs">
// 																				Watch video
// 																			</span>
// 																		</div>
// 																	</div>
// 																)}
// 															</div>
// 														);
// 													})}
// 												</div>
// 											)}
// 									</div>
// 								);
// 							})}
// 						</div>
// 					</div>
// 				</div>
// 				{/* Chat Area */}
// 				<div className="flex-1 relative overflow-y-auto flex flex-col bg-white md:pl-[2rem]">
// 					{/* Chat Header */}

// 					{messages[0]?.chat?.status === 'UNSOLVED' && (
// 						<div className="p-3 absolute top-3 right-2 flex justify-end">
// 							<Button
// 								className="bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center gap-2"
// 								onClick={handleMark}>
// 								<svg
// 									className="w-5 h-5"
// 									viewBox="0 0 24 24"
// 									fill="none"
// 									xmlns="http://www.w3.org/2000/svg">
// 									<path
// 										d="M20 6L9 17L4 12"
// 										stroke="white"
// 										strokeWidth="2"
// 										strokeLinecap="round"
// 										strokeLinejoin="round"
// 									/>
// 								</svg>
// 								MARK AS SOLVED
// 							</Button>
// 						</div>
// 					)}

// 					{/* Chat Messages */}
// 					{!voiceActive && (
// 						<div
// 							className={`flex-1 overflow-y-auto  p-4 flex flex-col justify-end`}>
// 							{messages.length === 0 && (
// 								<div className="max-w-md mx-auto text-center">
// 									<h2 className="text-md font-medium">Hi, There!</h2>
// 									<p className="text-gray-600">
// 										Please enter a title for this conversation?
// 									</p>
// 								</div>
// 							)}
// 							{messages.length > 0 && (
// 								<div className="flex h-[80vh] justify-end overflow-y-auto flex-col gap-4 w-full px-2 max-w-6xl mx-auto">
// 									{messages.map((msg) => (
// 										<div
// 											key={msg.id} // Use msg.id instead of index for better performance
// 											className={`flex ${
// 												msg.sender_type === 'bot' ||
// 												msg.sender_type === 'mentor'
// 													? 'justify-start'
// 													: 'justify-end'
// 											}`}>
// 											{msg.sender_type === 'bot' ? (
// 												<div className="bg-blue-100 p-3 rounded-lg max-w-sm">
// 													<span className="text-sm text-gray-800">
// 														{msg.message}
// 													</span>
// 													<div className="text-xs text-gray-500 mt-1">Bot</div>
// 												</div>
// 											) : (
// 												<div className="bg-gray-100 p-3 rounded-lg max-w-sm">
// 													<span className="text-sm text-gray-800">
// 														{msg.message}
// 													</span>
// 													<div className="text-xs text-gray-500 mt-1">
// 														{msg.sender_type === 'user'
// 															? 'You'
// 															: msg.sender_type === 'mentor'
// 															? 'Mentor'
// 															: 'Bot'}
// 													</div>
// 												</div>
// 											)}
// 											<div ref={messagesEndRef} />
// 											{/* Reference to the end of the messages */}
// 										</div>
// 									))}

// 									{/* Bot Reply (Priority Selection) */}
// 									{messages.length === 2 && (
// 										<div className="flex flex-col gap-4">
// 											<div className="flex flex-col items-center justify-center">
// 												<p className="text-gray-700 mb-2">
// 													Please choose the appropriate priority level.
// 												</p>
// 												<div className="flex gap-2 flex-wrap justify-center">
// 													<Button
// 														size="sm"
// 														className="bg-blue-500 text-white hover:bg-blue-600"
// 														onClick={() => handlePrioritySelect('Critical')}>
// 														Critical
// 													</Button>
// 													<Button
// 														size="sm"
// 														className="bg-blue-500 text-white hover:bg-blue-600"
// 														onClick={() => handlePrioritySelect('Medium')}>
// 														Medium
// 													</Button>
// 													<Button
// 														size="sm"
// 														className="bg-blue-500 text-white hover:bg-blue-600"
// 														onClick={() => handlePrioritySelect('General')}>
// 														General
// 													</Button>
// 												</div>
// 											</div>
// 										</div>
// 									)}
// 									{messages.length === 4 && (
// 										<div className="flex flex-col gap-4">
// 											<div className="flex flex-col items-center justify-center">
// 												<p className="text-gray-700 mb-2">
// 													Please describe the topic you would like to discuss.
// 												</p>
// 											</div>
// 										</div>
// 									)}
// 									{messages[0]?.chat.is_finding && (
// 										<div className="flex flex-col items-center justify-center bg-slate-100 p-2 rounded-md">
// 											<p className="text-gray-700 mb-2 text-center ">
// 												Checking for available mentor's to support you. Please
// 												Wait for a moment or continue chating with your Ai
// 												Mentor. Mentor will message you soon.
// 											</p>
// 										</div>
// 									)}
// 									{messages.length === 7 &&
// 										!timeMettingShow &&
// 										messages[0].chat.is_finding === false &&
// 										messages[0].chat?.meetings.length === 0 && (
// 											<div className="flex flex-col gap-4">
// 												<SupportOptions
// 													fetchChatData={fetchChatHistory}
// 													chatId={chatId}
// 													setTimeMettingShow={setTimeMettingShow}
// 												/>
// 											</div>
// 										)}

// 									{timeMettingShow && (
// 										<div className="flex flex-col gap-4">
// 											<MettingOptions
// 												fetchChatData={fetchChatHistory}
// 												chatId={chatId}
// 											/>
// 										</div>
// 									)}
// 									{messages[0].chat?.meetings.length === 1 && (
// 										<div className="flex flex-col gap-4 bg-[#EAF3FB] py-2 px-2 rounded-md">
// 											<p className="text-gray-700 mb-2 text-center ">
// 												A meeting has been scheduled with our expert to discuss
// 												your concerns. Please be available on 16 July, 2025. at
// 												2:30AM via Zoom. Meeting link we be available in meeting
// 												section.
// 											</p>
// 										</div>
// 									)}
// 								</div>
// 							)}
// 						</div>
// 					)}

// 					{/* Voice Input Modal */}
// 					{voiceActive && <VoiceInput setActive={setVoiceActive} />}

// 					{/* Chat Input */}
// 					<div className="w-full flex items-center justify-center mb-4 gap-2 px-4">
// 						<img
// 							src={videoMic}
// 							alt="Video icon"
// 							onClick={() => setVideoActive(true)}
// 							className="cursor-pointer h-10 w-10"
// 						/>
// 						<div className="px-2 py-2 border-t bg-[#E9ECF3] w-full max-w-6xl rounded-3xl flex items-center gap-2">
// 							<Paperclip size={23} className="text-gray-500" />
// 							<div className="bg-white w-full rounded-3xl px-4 flex items-center justify-between">
// 								<input
// 									ref={inputRef}
// 									placeholder="Start chat"
// 									className="flex h-10 w-full border border-input bg-background px-3 py-2  file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground  disabled:cursor-not-allowed disabled:opacity-50 border-none outline-none rounded-3xl text-sm md:text-base"
// 									value={message}
// 									onChange={(e) => setMessage(e.target.value)}
// 									onKeyDown={handleKeyDown}
// 								/>
// 								<div className="flex items-center gap-2">
// 									<FiMic
// 										size={20}
// 										className="text-gray-500 cursor-pointer"
// 										onClick={() => setVoiceActive(!voiceActive)}
// 									/>
// 									<img src={voice} alt="Voice icon" className="h-5 w-5" />
// 								</div>
// 							</div>
// 							<button onClick={handleSendMessage} disabled={isLoading}>
// 								<Send size={20} className="text-gray-500" />
// 							</button>
// 						</div>
// 					</div>
// 				</div>
// 			</div>

// 			{/* Online Video Modal */}
// 			<OnlineVideoModal
// 				isOpen={videoActive}
// 				onClose={() => setVideoActive(false)}
// 			/>
// 		</div>
// 	);
// }

import { useState, useRef, useEffect } from "react";
import { Paperclip, Plus, Video, Send, Minus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FiCheck, FiMic } from "react-icons/fi";
import { CgNotes } from "react-icons/cg";
import Navbar from "../../component/user/Navbar";
import Sidebar from "../../component/user/UserSidebar";
import VoiceInput from "../../component/user/VoiceModal";
import OnlineVideoModal from "../../component/user/OnlineVideoModal";
import ChatSideBaIcon from "../../assets/chatbar.svg";
import videoMic from "../../assets/video.svg";
import voice from "../../assets/voice.svg";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../component/axiosInstance";
import SupportOptions from "../../components/support-options";
import MettingOptions from "../../components/support-options-metting";
import VoiceToVoiceChat from "../../component/user/VtoV";
import SummaryModal from "./Summary";

export default function ChatInterface() {
  const [activeTab, setActiveTab] = useState("solved");
  const [voiceActive, setVoiceActive] = useState(false);
  const [isVToVActive, setIsVToVActive] = useState(false);
  const [videoActive, setVideoActive] = useState(false);
  const [sidebarData, setSideBarData] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showBotReply, setShowBotReply] = useState(false);
  const [timeMettingShow, setTimeMettingShow] = useState(false);
  const [isChatHistoryOpen, setIsChatHistoryOpen] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const navigation = useNavigate();
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [summaryChatId, setSummaryChatId] = useState("");
  // mentros id
  const [mentorsId, setMentorsId] = useState([]);
  const route = useParams();
  const chatWs = useRef(null);
  // file input reference
  const [attachedImage, setAttachedImage] = useState(""); // base64 string
  const [attachedImagePreview, setAttachedImagePreview] = useState(null); // for preview

  const messagesEndRef = useRef(null);
  useEffect(() => {
    setChatId(route.id);
    console.log(route.id, "route id");
  }, [route]);

  //   socket
  const token = localStorage.getItem("token");
  useEffect(() => {
    console.log(token);
    chatWs.current = new WebSocket(
      `ws://192.168.10.124:3100/ws/api/v1/chat/?Authorization=Bearer ${token}`
    );
    chatWs.current.onopen = () => {
      console.log("chat WebSocket connected user chat page");
    };

    chatWs.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const receivedData = data.message;
      console.log(data.main_chat_id, chatId);
      if (data.main_chat_id === chatId) {
        console.log(data.message);
        const mess = {
          id: receivedData.id || null,
          message: receivedData.message,
          attachment_name: receivedData.attachment_name || null,
          attachment_data: receivedData.attachment_data || null,
          sender: receivedData.sender,
          receiver: receivedData.receiver,
          reply_to: receivedData.reply_to,
          timestamp: receivedData.timestamp,
          is_read: receivedData.is_read,
          is_deleted: receivedData.is_deleted,
          is_edited: receivedData.is_edited,
          is_reported: receivedData.is_reported,
          sender_type: receivedData.sender_type || "mentor",
        };
        setMessages((prev) => [...prev, mess]);
      }
    };

    chatWs.current.onerror = (err) => {
      console.error("chat WebSocket error:", err);
    };

    chatWs.current.onclose = () => {
      console.log("chat WebSocket closed");
      chatWs.current = new WebSocket(
        `ws://192.168.10.124:3100/ws/api/v1/chat/?Authorization=Bearer ${token}`
      );
      chatWs.current.onopen = () => {
        console.log("chat WebSocket connected user chat page");
      };
    };

    return () => {
      if (chatWs.current) {
        chatWs.current.close();
      }
    };
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const id = route.id;
    console.log(id, "8666");
    if (id) {
      setChatId(id);
      setShowBotReply(true);
      fetchChatHistory(id);
    }
  }, [route.id]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    fetchChat();
    const interval = setInterval(() => {
      fetchChat();
    }, 10000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  const fetchChat = async () => {
    try {
      const response = await axiosInstance.get(`/chats/`);
      const chats = response.data;
      const mentors = chats.map((chat) => ({
        chat_id: chat.chat_id,
        mentor_id: chat?.mentor,
      }));
      setMentorsId(mentors);

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const categorizedChats = {
        today: { solved: [], unsolved: [] },
        yesterday: { solved: [], unsolved: [] },
      };

      chats.forEach((chat) => {
        const chatDate = new Date(chat.created_at);
        const isToday = chatDate >= today;
        const isYesterday = chatDate >= yesterday && chatDate < today;
        const category = chat.status === "UNSOLVED" ? "unsolved" : "solved";

        if (isToday) {
          categorizedChats.today[category].push(chat);
        } else if (isYesterday) {
          categorizedChats.yesterday[category].push(chat);
        }
      });

      setSideBarData(categorizedChats);
      console.log("response", categorizedChats);
    } catch (error) {
      console.error("Error fetching chat history:", error);
      alert("An error occurred while fetching chat history.");
    }
  };

  const fetchChatHistory = async (id) => {
    setChatId(id);
    console.log("Fetching chat history for chatId:", id);
    try {
      const response = await axiosInstance.get(`/chats/${id}/history/`);
      const chatMessages = await axiosInstance.get(
        `/realtime/chats/history/${id}/`
      );
      const currentUserId = Number(localStorage.getItem("id"));

      // Set sender_type if missing
      const processedRealtimeMessages = (chatMessages.data.messages || []).map(
        (msg) => {
          if (!msg.sender_type) {
            if (msg.receiver === currentUserId) {
              return { ...msg, sender_type: "mentor" };
            } else {
              return { ...msg, sender_type: "user" };
            }
          }
          return msg;
        }
      );
      setMessages([...response.data, ...processedRealtimeMessages]);
      console.log("response of chat", response.data);
    } catch (error) {
      console.error("Error fetching chat history:", error);
      alert("An error occurred while fetching chat history.");
    }
  };

  const handleSendMessage = async () => {
    console.log(mentorsId, "mentores id is");
    if (!message.trim() && !attachedImage.trim()) return;
    // Find the mentor_id for the current chatId
    const mentor = mentorsId.find((mentor) => mentor.chat_id === chatId);
    const mentorId = mentor ? mentor.mentor_id : null;
    // attachments
    let attachment_name = null;
    let attachment_data = null;
    if (attachedImage) {
      const [name, data] = attachedImage.split(",");
      attachment_name = name;
      attachment_data = data;
    }
    console.log("Sending message:", { message, chatId, mentorId });
    // Send WebSocket message
    if (mentorId !== "" && typeof mentorId == "string") {
      console.log("sending throught socket");
      if (chatWs.current && chatWs.current.readyState === WebSocket.OPEN) {
        chatWs.current.send(
          JSON.stringify({
            message: message,
            main_chat_id: chatId,
            user_id: mentorId,
            attachment_data,
            attachment_name,
          })
        );
        setMessages((prev) => [
          ...prev,
          {
            message: message,
            sender_type: "user",
            chat_id: chatId,
            main_chat_id: chatId,
            attachment_data,
            attachment_name,
          },
        ]);
        setAttachedImage(null);
        setAttachedImagePreview(null);
      } else {
        console.error("WebSocket is not open");
        alert("Unable to send message: WebSocket connection is not open.");
        return;
      }
    }

    setIsLoading(true);
    try {
      let newChatId;
      if (!chatId) {
        const chatResponse = await axiosInstance.post("/chats/", {
          title: message,
        });

        console.log("Chat created:", chatResponse.data.chat_id);
        newChatId = await chatResponse.data.chat_id;
        console.log(newChatId, "new chat id");
        await axiosInstance.post(`/chats/${newChatId || chatId}/history/`, {
          message: "Please enter a title for this conversation?",
          sender_type: "bot",
        });

        setChatId(newChatId);
        await axiosInstance.post(`/chats/${newChatId || chatId}/history/`, {
          message: message,
          sender_type: "user",
        });
        navigation(`/chat/${newChatId}`);
      }

      if (messages.length === 4) {
        await axiosInstance.post(`/chats/${newChatId || chatId}/history/`, {
          message: "Please describe the topic you would like to discuss.",
          sender_type: "bot",
        });
      }
      console.log(mentor, mentor?.mentor_id);
      if (typeof mentor?.mentor_id != "string") {
        await axiosInstance.post(`/chats/${chatId}/history/`, {
          message: message,
          sender_type: "user",
        });
        await fetchChatHistory(chatId);
        await fetchChatHistory(chatId || newChatId);
      }

      setMessage("");
      setShowBotReply(true);
    } catch (error) {
      console.error("Error creating chat:", error);
      // alert("An error occurred while creating the chat.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrioritySelect = async (priority) => {
    if (!chatId) return;

    setIsLoading(true);
    try {
      await axiosInstance.post(`/chats/${chatId}/history/`, {
        message: "Please choose the appropriate priority level.",
        sender_type: "bot",
      });
      await axiosInstance.post(`/chats/${chatId}/history/`, {
        message: priority,
        sender_type: "user",
      });
      await axiosInstance.put(`/chats/${chatId}/`, {
        problem_level: priority,
      });
      setMessages((prev) => [
        ...prev,
        {
          sender_type: "bot",
          message: "Please choose the appropriate priority level.",
        },
      ]);
      setMessages((prev) => [
        ...prev,
        { sender_type: "user", message: priority },
      ]);

      fetchChatHistory(chatId);
    } catch (error) {
      console.error("Error saving priority:", error);
      alert("An error occurred while saving the priority.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const toggleChatHistory = () => {
    setIsChatHistoryOpen((prev) => !prev);
  };

  const [isExpanded, setIsExpanded] = useState(false);

  // console.log("mess", messages, chatId);

  const handleMark = async () => {
    await axiosInstance.put(`chats/${chatId}/mark-as-solved/`, {});
    fetchChat();
    fetchChatHistory(chatId);
  };
  // useEffect(() => {
  //   if (attachedImage) {
  //     console.log(attachedImage, "attached image (updated)");
  //   }
  // }, [attachedImage]);
  // Handle file input change
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result;
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const base64 = await toBase64(file);
      setAttachedImage(base64);
      setAttachedImagePreview(base64);
    }
    console.log(attachedImage, "attached image");
  };

  // Remove attached image
  const handleRemoveImage = () => {
    setAttachedImage(null);
    setAttachedImagePreview(null);
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900 dark:text-white">
      {console.log(messages)}
      <Button
        variant="ghost"
        className="fixed top-20 -left-3 z-0 md:hidden"
        onClick={toggleChatHistory}
        aria-label="Toggle Chat History"
      >
        <img src={ChatSideBaIcon} alt="" className="h-10 w-10" />
      </Button>
      <Navbar />
      <div className="flex flex-1 mt-16">
        <Sidebar />

        {isChatHistoryOpen && (
          <div
            className="fixed inset-0 bg-black/50 dark:bg-white/50 z-30 md:hidden"
            onClick={toggleChatHistory}
            aria-hidden="true"
          />
        )}

        <div
          className={cn(
            "fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-900 border-r dark:border-gray-600 md:z-0 z-40 transition-transform duration-300 ease-in-out md:static md:w-80 md:translate-x-0",
            isChatHistoryOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="p-4 border-b">
            <h2 className="text-md font-medium text-gray-700 dark:text-white mb-4">
              Chats History
            </h2>
            <Link
              to={"/chat"}
              onClick={() => {
                setChatId(null);
                setMessages([]);
              }}
            >
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 hover:text-white"
              >
                <Plus className="h-4 w-4" />
                New Chat
              </Button>
            </Link>
          </div>

          <div className="flex border-b">
            <button
              className={cn(
                "flex-1 py-2 text-center text-sm font-medium",
                activeTab === "solved"
                  ? "bg-blue-500 text-white dark:bg-gray-800"
                  : "bg-gray-100 text-gray-600"
              )}
              onClick={() => setActiveTab("solved")}
            >
              Solved
            </button>
            <button
              className={cn(
                "flex-1 py-2 text-center text-sm font-medium",
                activeTab === "unsolved"
                  ? "bg-blue-500 text-white dark:bg-gray-800"
                  : "bg-gray-100 text-gray-600"
              )}
              onClick={() => setActiveTab("unsolved")}
            >
              Unsolved
            </button>
          </div>

          <div className="overflow-y-auto h-[calc(100vh-300px)] px-2">
            <div className="p-2">
              {Object.entries(sidebarData).map(([date, categories]) => {
                console.log(date, categories, "side bar data");
                const hasChats =
                  categories.solved.length > 0 ||
                  categories.unsolved.length > 0;
                if (!hasChats) return null;

                return (
                  <div key={date}>
                    <h3 className="px-2 py-1 text-sm font-medium text-gray-500 dark:text-white">
                      {date === "today" ? "Today" : "Yesterday"}
                    </h3>
                    {activeTab === "solved" && categories.solved.length > 0 && (
                      <div>
                        {categories.solved.map((chat) => (
                          <div key={chat.chat_id}>
                            <div
                              className={`${
                                chatId == chat.chat_id
                                  ? "bg-blue-100 dark:bg-blue-900"
                                  : "bg-white dark:bg-gray-800"
                              } p-2 border shadow-md rounded-md mb-2 flex justify-between items-center cursor-pointer`}
                              onClick={() =>
                                navigation(`/chat/${chat.chat_id}`)
                              }
                            >
                              <span
                                className={`text-sm truncate ${
                                  chatId == chat.chat_id
                                    ? "text-gray-900 dark:text-white"
                                    : "text-gray-700 dark:text-gray-200"
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigation(`/chat/${chat.chat_id}`);
                                  setIsExpanded(!isExpanded);
                                }}
                              >
                                {chat.title}
                              </span>

                              {isExpanded == chat.chat_id ? (
                                <Minus
                                  className="h-4 w-4 text-gray-500 dark:text-gray-300 cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setIsExpanded(false);
                                  }}
                                />
                              ) : (
                                <Plus
                                  className="h-4 w-4 text-gray-500 dark:text-gray-300 cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setIsExpanded(chat.chat_id);
                                  }}
                                />
                              )}
                            </div>

                            {isExpanded == chat.chat_id && (
                              <div className="py-2 mb-1 flex items-center gap-2">
                                <div className="bg-blue-100 dark:bg-blue-900 shadow-md w-[50%] p-1 rounded-md flex items-center space-x-1 px-4 py-2">
                                  <CgNotes className="w-4 h-4 text-gray-700 dark:text-white" />
                                  <span className="text-xs text-gray-800 dark:text-gray-200">
                                    Summary
                                  </span>
                                </div>
                                <div className="bg-blue-100 dark:bg-blue-900 shadow-md w-[50%] p-1 rounded-md flex items-center px-4 py-2">
                                  <Video className="w-4 h-4 mr-1 text-gray-700 dark:text-white" />
                                  <span className="text-xs text-gray-800 dark:text-gray-200">
                                    Watch video
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {activeTab === "unsolved" &&
                      categories.unsolved.length > 0 && (
                        <div>
                          {categories.unsolved.map((chat) => (
                            <div key={chat.chat_id}>
                              <div
                                className={`${
                                  chatId == chat.chat_id
                                    ? "bg-blue-100 dark:bg-blue-900"
                                    : "bg-white dark:bg-gray-800"
                                } p-2 border shadow-md rounded-md mb-2 flex justify-between items-center cursor-pointer`}
                                onClick={() =>
                                  navigation(`/chat/${chat.chat_id}`)
                                }
                              >
                                <span
                                  className={`text-sm truncate ${
                                    chatId == chat.chat_id
                                      ? "text-gray-900 dark:text-white"
                                      : "text-gray-900 dark:text-gray-100"
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigation(`/chat/${chat.chat_id}`);
                                    setIsExpanded(!isExpanded);
                                  }}
                                >
                                  {chat.title}
                                </span>

                                {isExpanded == chat.chat_id ? (
                                  <Minus
                                    className="h-4 w-4 text-gray-500 dark:text-gray-300 cursor-pointer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setIsExpanded(false);
                                    }}
                                  />
                                ) : (
                                  <Plus
                                    className="h-4 w-4 text-gray-500 dark:text-gray-300 cursor-pointer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setIsExpanded(chat.chat_id);
                                    }}
                                  />
                                )}
                              </div>

                              {isExpanded == chat.chat_id && (
                                <>
                                  <div className="py-2 mb-1 flex items-center gap-2 cursor-pointer">
                                    <div
                                      onClick={() => {
                                        setIsSummaryOpen(true);
                                        setSummaryChatId(chat.chat_id);
                                      }}
                                      className="bg-blue-100 dark:bg-blue-900 shadow-md w-[50%] p-1 rounded-md flex space-x-1 items-center px-4 py-2"
                                    >
                                      <CgNotes className="w-4 h-4 text-gray-700 dark:text-white" />
                                      <span className="text-xs text-gray-800 dark:text-gray-200">
                                        Summary
                                      </span>
                                    </div>
                                    <div className="bg-blue-100 dark:bg-blue-900 shadow-md w-[50%] p-1 rounded-md flex items-center px-4 py-2">
                                      <Video className="w-4 h-4 mr-1 text-gray-700 dark:text-white" />
                                      <span className="text-xs text-gray-800 dark:text-gray-200">
                                        Watch video
                                      </span>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex-1 relative flex flex-col bg-white dark:bg-gray-900 md:pl-[2rem]">
          {messages[0]?.chat?.status === "UNSOLVED" && (
            <div className="p-3 absolute top-3 right-2 flex justify-end">
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center gap-2"
                onClick={handleMark}
              >
                <FiCheck className="h-10 w-10" />
                MARK AS SOLVED
              </Button>
            </div>
          )}

          {!voiceActive && (
            <div className="flex-1 overflow-y-auto p-4 flex flex-col">
              <div
                className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-100 scrollbar-track-gray-100"
                style={{ maxHeight: "calc(100vh - 200px)" }}
              >
                {messages.length === 0 && (
                  <div className="max-w-md mx-auto text-center pt-20">
                    <h2 className="text-md font-medium">Hi, There!</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Please enter a title for this conversation?
                    </p>
                  </div>
                )}
                {messages.length > 0 && (
                  <div className="flex flex-col gap-4 w-full px-2 max-w-6xl mx-auto">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.sender_type === "bot" ||
                          msg.sender_type === "mentor"
                            ? "justify-start"
                            : "justify-end"
                        }`}
                      >
                        {msg.sender_type === "bot" ? (
                          <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg max-w-sm">
                            <span className="text-sm text-gray-800 dark:text-white">
                              {msg.message}
                            </span>
                            {msg.attachment_data && (
                              <img
                                src={`${msg.attachment_name},${msg.attachment_data}`}
                                alt={msg.attachment_name}
                              />
                            )}
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Bot
                            </div>
                          </div>
                        ) : (
                          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg max-w-sm">
                            <span className="text-sm text-gray-800 dark:text-white">
                              {msg.message}
                            </span>
                            {msg.attachment_data && (
                              <img
                                src={`${msg.attachment_name},${msg.attachment_data}`}
                                alt={msg.attachment_name}
                              />
                            )}
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {msg.sender_type === "user"
                                ? "You"
                                : msg.sender_type === "mentor"
                                ? "Mentor"
                                : "Bot"}
                            </div>
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    ))}

                    {messages.length === 2 && (
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col items-center justify-center">
                          <p className="text-gray-700 dark:text-gray-300 mb-2">
                            Please choose the appropriate priority level.
                          </p>
                          <div className="flex gap-2 flex-wrap justify-center">
                            <Button
                              size="sm"
                              className="bg-blue-500 text-white hover:bg-blue-600"
                              onClick={() => handlePrioritySelect("Critical")}
                            >
                              Critical
                            </Button>
                            <Button
                              size="sm"
                              className="bg-blue-500 text-white hover:bg-blue-600"
                              onClick={() => handlePrioritySelect("Medium")}
                            >
                              Medium
                            </Button>
                            <Button
                              size="sm"
                              className="bg-blue-500 text-white hover:bg-blue-600"
                              onClick={() => handlePrioritySelect("General")}
                            >
                              General
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {messages.length === 4 && (
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col items-center justify-center">
                          <p className="text-gray-700 dark:text-gray-300 mb-2">
                            Please describe the topic you would like to discuss.
                          </p>
                        </div>
                      </div>
                    )}

                    {messages[0]?.chat.is_finding && (
                      <div className="flex flex-col items-center justify-center bg-slate-100 dark:bg-gray-800 p-2 rounded-md">
                        <p className="text-gray-700 dark:text-gray-300 mb-2 text-center">
                          Checking for available mentor's to support you. Please
                          wait for a moment or continue chatting with your AI
                          Mentor. Mentor will message you soon.
                        </p>
                      </div>
                    )}

                    {messages.length === 7 &&
                      !timeMettingShow &&
                      messages[0].chat.is_finding === false &&
                      messages[0].chat?.meetings.length === 0 && (
                        <div className="flex flex-col gap-4">
                          <SupportOptions
                            fetchChatData={fetchChatHistory}
                            chatId={chatId}
                            setTimeMettingShow={setTimeMettingShow}
                          />
                        </div>
                      )}

                    {timeMettingShow && (
                      <div className="flex flex-col gap-4">
                        <MettingOptions
                          fetchChatData={fetchChatHistory}
                          chatId={chatId}
                          setTimeMettingShow={setTimeMettingShow}
                          mentorId={
                            mentorsId.find(
                              (mentor) => mentor.chat_id === chatId
                            )?.mentor_id || null
                          }
                        />
                      </div>
                    )}
                    {messages[0].chat?.meetings.length === 1 && (
                      <div className="flex flex-col gap-4 bg-[#EAF3FB] dark:bg-gray-800 py-2 px-2 rounded-md">
                        {console.log(
                          messages[0].chat?.meetings,
                          "meetings length"
                        )}
                        <p className="text-gray-700 dark:text-gray-300 mb-2 text-center">
                          A meeting has been scheduled with our expert to
                          discuss your concerns. Please be available via Zoom.
                          Meeting link and time will be available in the meeting
                          section.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {voiceActive && (
            <VoiceInput
              setMessage={setMessage}
              messages={messages}
              setActive={setVoiceActive}
              handleSendMessage={handleSendMessage}
            />
          )}
          {/* voice to voice */}
          {isVToVActive && (
            <VoiceToVoiceChat
              isVToVActive={isVToVActive}
              setActive={setIsVToVActive}
              chatId={chatId}
            />
          )}
          <div className="w-full flex items-center justify-center mb-4 gap-2 px-4">
            <img
              src={videoMic}
              alt="Video icon"
              onClick={() => setVideoActive(true)}
              className="cursor-pointer h-10 w-10"
            />

            <div className="px-2 py-2 border-t dark:border-gray-600 bg-[#E9ECF3] dark:bg-gray-800 w-full max-w-6xl rounded-3xl flex items-center gap-2">
              {attachedImagePreview && (
                <div className="relative">
                  <img
                    src={attachedImagePreview}
                    alt="Attached"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
              <label className="cursor-pointer">
                <Paperclip
                  size={23}
                  className="text-gray-500 dark:text-gray-300"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              <div className="bg-white dark:bg-gray-900 w-full rounded-3xl px-4 flex items-center justify-between">
                <input
                  ref={inputRef}
                  placeholder="Start chat"
                  className="flex h-10 w-full border-none bg-transparent px-3 py-2 text-sm md:text-base placeholder:text-muted-foreground dark:placeholder:text-gray-400 text-gray-800 dark:text-white outline-none rounded-3xl"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                />

                <div className="flex items-center gap-2">
                  <FiMic
                    size={20}
                    className="text-gray-500 dark:text-gray-300 cursor-pointer"
                    onClick={() => setVoiceActive(!voiceActive)}
                  />
                  <img
                    onClick={() => setIsVToVActive(!isVToVActive)}
                    src={voice}
                    alt="Voice icon"
                    className="h-5 w-5"
                  />
                </div>
              </div>

              <button onClick={handleSendMessage} disabled={isLoading}>
                <Send size={20} className="text-gray-500 dark:text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <OnlineVideoModal
        isOpen={videoActive}
        onClose={() => setVideoActive(false)}
        onConfirm={() => {
          setTimeMettingShow(true);
          setVideoActive(false);
        }}
      />
      {/* showing summary */}
      <SummaryModal
        isOpen={isSummaryOpen}
        onClose={() => {
          setIsSummaryOpen(false);
          setSummaryChatId("");
        }}
        meetingId={summaryChatId}
      />
    </div>
  );
}
