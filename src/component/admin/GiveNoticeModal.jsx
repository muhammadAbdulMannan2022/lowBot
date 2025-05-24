import { useState } from 'react';
import { FiArrowLeft, FiX } from 'react-icons/fi';

const GiveNoticeModal = ({ isOpen, onClose, user }) => {
	const [formData, setFormData] = useState({
		title: '',
		description: '',
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log('Notice submitted for user:', user.name, formData);
		onClose(); // Close the modal after submission
		// Add your form submission logic here (e.g., API call)
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
				{/* Close Button */}
				<button
					onClick={onClose}
					className="absolute top-4 right-4 text-gray-600 hover:text-gray-800">
					<FiX size={20} />
				</button>

				{/* Header */}
				<div className="flex items-center mb-6 justify-between">
					<button
						onClick={onClose}
						className="text-blue-600 hover:text-blue-700 flex items-center">
						<FiArrowLeft className="mr-2" />
						Back
					</button>
					<h2 className="text-xl font-semibold text-gray-800 ">Notice</h2>
					<h2></h2>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Title */}
					<div>
						<label className="block text-sm text-gray-600 mb-1">
							Give a Title
						</label>
						<input
							type="text"
							name="title"
							value={formData.title}
							onChange={handleInputChange}
							placeholder="Enter here"
							className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					{/* Description */}
					<div>
						<label className="block text-sm text-gray-600 mb-1">
							Describe here
						</label>
						<textarea
							name="description"
							value={formData.description}
							onChange={handleInputChange}
							placeholder="Enter here"
							rows="4"
							className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
						/>
					</div>

					{/* Submit Button */}
					<button
						type="submit"
						className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
						SUBMIT
					</button>
				</form>
			</div>
		</div>
	);
};

export default GiveNoticeModal;
