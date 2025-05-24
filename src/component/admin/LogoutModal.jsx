import { FiX } from 'react-icons/fi';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
	if (!isOpen) return null;
	const navigate = useNavigate();
	const { logout } = useAuth();

	const handleLogout = () => {
		logout();

		navigate('/');
	};
	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg shadow-lg md:max-w-sm w-full p-6 relative">
				{/* Close Button */}
				<button
					onClick={onClose}
					className="absolute top-4 right-4 text-gray-600 hover:text-gray-800">
					<FiX size={20} />
				</button>

				{/* Content */}
				<div className="text-center">
					<h2 className="text-lg font-semibold text-gray-800 mb-6">
						Do you want to Logout?
					</h2>
					<div className="flex justify-center space-x-4">
						<button
							onClick={() => {
								handleLogout();
							}}
							className="px-10 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">
							Yes
						</button>
						<button
							onClick={onClose}
							className="px-10 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
							No
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LogoutModal;
