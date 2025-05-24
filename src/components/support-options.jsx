import { useState } from 'react';
import axiosInstance from '../component/axiosInstance';

export default function SupportOptions({
	fetchChatData,
	chatId,
	setTimeMettingShow,
}) {
	console.log('siam vai', chatId);
	const handleOptionClick = async (optionNumber) => {
		if (optionNumber === 1) {
			await axiosInstance.put(`/chats/${chatId}/`, {
				is_bot_involved: true,
			});
			await axiosInstance.post(`/chats/${chatId}/history/`, {
				message: 'Thank you for choosing our support option.',
				sender_type: 'bot',
			});
			fetchChatData(chatId);
		}
		if (optionNumber === 2) {
			await axiosInstance.put(`/chats/${chatId}/mentor_all/`, {});
			fetchChatData(chatId);
		}
		if (optionNumber === 3) {
			setTimeMettingShow(true);
		}
	};

	return (
		<div className="max-w-xl mx-auto p-8 border border-blue-300 rounded-lg">
			<h1 className="text-xl font-semibold text-slate-700 text-center mb-4">
				Please Click On One of The Options Below
			</h1>
			<p className="text-sm text-slate-600 text-center mb-8">
				Our expert mentors are always available to support you.
			</p>

			<div className="space-y-4">
				<button
					onClick={() => handleOptionClick(1)}
					className="w-full py-4 px-6 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200">
					<span className="font-medium">1.</span> Continue Chating With Ai Agent
				</button>

				<button
					onClick={() => handleOptionClick(2)}
					className="w-full py-4 px-6 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200">
					<span className="font-medium">2.</span> Request a live chat with an
					expert
				</button>

				<button
					onClick={() => handleOptionClick(3)}
					className="w-full py-4 px-6 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200">
					<span className="font-medium">3.</span> Request an online meeting with
					an expert
				</button>
			</div>
		</div>
	);
}
