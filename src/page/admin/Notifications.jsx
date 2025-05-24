import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';

import Sidebar from '../../component/admin/Sidebar';
import axiosInstance from '../../component/axiosInstance';
import { Link } from 'react-router-dom';

const Notifications = () => {
	const [notifications, setNotifications] = useState([]);

	// Function to calculate relative time difference
	const getRelativeTime = (timestamp) => {
		const currentDate = new Date(); // Current date: 08:11 PM +06, May 16, 2025
		const notificationDate = new Date(timestamp);
		const diffInMs = currentDate - notificationDate;
		const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

		if (diffInDays === 0) return 'Today';
		if (diffInDays === 1) return 'Yesterday';
		return `${diffInDays} days ago`;
	};

	// Fetch notifications on component mount
	useEffect(() => {
		const fetchNotifications = async () => {
			try {
				const response = await axiosInstance.get(
					'/notification/get/user/all-notifications/'
				);
				setNotifications(response.data);
			} catch (error) {
				console.error('Error fetching notifications:', error);
				alert('An error occurred while fetching notifications.');
			}
		};
		fetchNotifications();
	}, []);

	// Handle deleting a notification
	const handleDelete = async (id) => {
		try {
			await axiosInstance.delete(`/notification/delete/${id}/notifications/`); // Assuming an endpoint to delete a notification
			setNotifications(
				notifications.filter((notification) => notification.id !== id)
			);
		} catch (error) {
			console.error('Error deleting notification:', error);
			alert('An error occurred while deleting the notification.');
		}
	};

	return (
		<Sidebar>
			<div className="h-[98vh] bg-gray-100 ml-2 py-12">
				<h2 className="text-2xl font-semibold text-gray-800 text-center my-4">
					Notifications
				</h2>
				<div className="max-w-7xl mx-auto bg-white rounded-lg shadow-sm">
					<div className="divide-y divide-gray-200">
						{notifications.length > 0 ? (
							notifications.map((notification) => (
								<div
									key={notification.id}
									className="flex items-center justify-between p-4 hover:bg-gray-50">
									<div>
										<p className="text-sm text-gray-700">
											{notification.title}: {notification.message}
											{notification.slug && (
												<Link
													to={notification.slug} // Changed from href to to for react-router-dom
													className="ml-1 text-blue-500 hover:underline">
													click here
												</Link>
											)}
										</p>
									</div>
									<div className="flex items-center gap-4">
										<span className="text-sm text-gray-500">
											{getRelativeTime(notification.created_at)}
										</span>
										<button
											onClick={() => handleDelete(notification.id)}
											className="text-gray-400 hover:text-red-500 transition-colors"
											aria-label={`Delete notification: ${notification.message}`}>
											<Trash2 size={18} />
										</button>
									</div>
								</div>
							))
						) : (
							<div className="p-4 text-center text-gray-500">
								No notifications available.
							</div>
						)}
					</div>
				</div>
			</div>
		</Sidebar>
	);
};

export default Notifications;
