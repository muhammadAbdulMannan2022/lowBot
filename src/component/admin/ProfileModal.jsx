import { useState } from 'react';
import { FiArrowLeft, FiTrash2, FiUpload, FiX } from 'react-icons/fi';

const ProfileModal = ({ isOpen, onClose }) => {
	const [formData, setFormData] = useState({
		name: 'Sumon Kumar',
		email: '',
		password: '',
		confirmPassword: '',
	});
	const [file, setFile] = useState(null);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleFileChange = (e) => {
		if (e.target.files && e.target.files[0]) {
			setFile(e.target.files[0]);
		}
	};

	const handleFileRemove = () => {
		setFile(null);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (formData.password !== formData.confirmPassword) {
			alert('Passwords do not match!');
			return;
		}
		console.log('Profile updated:', { ...formData, file });
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
					<h2 className="text-xl font-semibold text-gray-800 ">
						Profile Details
					</h2>
					<h2></h2>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Name */}
					<div>
						<label className="block text-sm text-gray-600 mb-1">Name</label>
						<input
							type="text"
							name="name"
							value={formData.name}
							onChange={handleInputChange}
							className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					{/* Email */}
					<div>
						<label className="block text-sm text-gray-600 mb-1">Email</label>
						<input
							type="email"
							name="email"
							value={formData.email}
							onChange={handleInputChange}
							placeholder="Enter here"
							className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					{/* Password */}
					<div>
						<label className="block text-sm text-gray-600 mb-1">Password</label>
						<input
							type="password"
							name="password"
							value={formData.password}
							onChange={handleInputChange}
							placeholder="Enter here"
							className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					{/* Confirm Password */}
					<div>
						<label className="block text-sm text-gray-600 mb-1">
							Confirm password
						</label>
						<input
							type="password"
							name="confirmPassword"
							value={formData.confirmPassword}
							onChange={handleInputChange}
							placeholder="Enter here"
							className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					{/* File Upload */}
					<div>
						<label className="block text-sm text-gray-600 mb-1">
							Upload your photo
						</label>
						<div className="flex items-center space-x-2">
							<label className="flex items-center px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200">
								<FiUpload className="mr-2 text-gray-600" />
								<span className="text-sm text-gray-600">
									{file ? file.name : 'Namexyz.jpg'}
								</span>
								<input
									type="file"
									onChange={handleFileChange}
									className="hidden"
									accept="image/*"
								/>
							</label>
							{file && (
								<button
									type="button"
									onClick={handleFileRemove}
									className="text-red-500 hover:text-red-600">
									<FiTrash2 size={16} />
								</button>
							)}
						</div>
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

export default ProfileModal;
