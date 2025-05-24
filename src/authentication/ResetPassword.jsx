import React, { useState } from 'react';
import Black from '../assets/register.svg';
import { MdLockOutline } from 'react-icons/md';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GoCheckCircleFill } from 'react-icons/go';
import { MdArrowBack } from 'react-icons/md';
import axiosInstance from '../component/axiosInstance';

const ResetPassword = ({ email, otp }) => {
	const [formData, setFormData] = useState({
		password: '',
		confirmPassword: '',
	});
	const [passwordSuccessful, setPasswordSuccessful] = useState(false);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();
	// const email = location.state?.email; // Get email from route state
	// const otp = location.state?.otp; // Get OTP from route state

	// Get email and token from OTP verification

	// Handle input changes
	const handleChange = (e) => {
		const { id, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[id === 'password' ? 'password' : 'confirmPassword']: value,
		}));
		setError('');
	};

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();

		// Validation
		if (!formData.password || !formData.confirmPassword) {
			setError('Please fill in all fields');
			return;
		}
		if (formData.password !== formData.confirmPassword) {
			setError('Passwords do not match');
			return;
		}

		setLoading(true);
		setError('');

		try {
			const response = await axiosInstance.post(
				'/auth/password-reset/confirm/',
				{
					email: email,
					otp: otp,
					new_password: formData.password,
				}
			);
			if (response.status !== 200) {
				throw new Error('Failed to reset password');
			}
			console.log('Password reset successful:', response.data);
			setPasswordSuccessful(true);
		} catch (err) {
			setError(
				err.response?.data?.detail ||
					'Failed to reset password. Please try again.'
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex items-center md:justify-between justify-center min-h-screen   md:px-5">
			<div className="w-1/2 h-[95vh] md:block hidden relative rounded-md overflow-hidden">
				<img
					src={Black}
					alt=""
					className="w-full h-full object-cover rounded-md"
				/>
			</div>
			<div className="md:w-1/2 w-full flex flex-col items-center justify-center">
				<div className="text-center">
					<p className="text-gray-600 mb-2">Logo here</p>
				</div>
				<div className="md:w-[60%] w-full px-4 md:p-8 space-y-8 rounded-lg">
					{passwordSuccessful ? (
						<div className="space-y-4  rounded-md box-shadow flex flex-col items-center justify-center p-4 md:p-10">
							<GoCheckCircleFill size={30} color="#1E5DCC" />
							<p className="text-[20px] text-center text-t_color">
								Password changed successfully
							</p>
							<Link
								to={'/'}
								className="px-3 flex items-center justify-center gap-2 py-3 bg-blue-500 hover:bg-blue-700 rounded text-white text-sm font-bold">
								<MdArrowBack size={20} />
								Back To Login
							</Link>
						</div>
					) : (
						<form
							onSubmit={handleSubmit}
							className="space-y-6  rounded-md  md:p-10">
							{error && (
								<p className="text-red-500 text-center text-sm">{error}</p>
							)}
							<div className="flex flex-col gap-1">
								<label htmlFor="password" className="text-[#BDC5DB] block">
									Password
								</label>
								<div className="relative">
									<MdLockOutline className="absolute left-3 top-3 text-[#BDC5DB] text-lg" />
									<input
										type="password"
										id="password"
										value={formData.password}
										onChange={handleChange}
										placeholder="Password"
										className="pl-10 w-full px-3 py-2 leading-tight border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
										required
									/>
								</div>
							</div>
							<div className="flex flex-col gap-1">
								<label
									htmlFor="confirmPassword"
									className="text-[#BDC5DB] block">
									Confirm Password
								</label>
								<div className="relative">
									<MdLockOutline className="absolute left-3 top-3 text-[#BDC5DB] text-lg" />
									<input
										type="password"
										id="confirmPassword"
										value={formData.confirmPassword}
										onChange={handleChange}
										placeholder="Confirm Password"
										className="pl-10 w-full px-3 py-2 leading-tight ] border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
										required
									/>
								</div>
							</div>
							<div className="w-full flex items-center justify-center">
								<button
									type="submit"
									disabled={loading}
									className={`md:w-[30%] flex items-center justify-center py-3 px-4 bg-blue-500 rounded text-white text-sm font-bold ${
										loading
											? 'opacity-50 cursor-not-allowed'
											: 'hover:bg-blue-700'
									}`}>
									{loading ? 'Resetting...' : 'Confirm'}
								</button>
							</div>
						</form>
					)}
				</div>
			</div>
		</div>
	);
};

export default ResetPassword;
