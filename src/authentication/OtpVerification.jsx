import React, { useState, useRef, useEffect } from 'react';
import Black from '../assets/register.svg';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../component/axiosInstance';
import ResetPassword from './ResetPassword';

const OtpVerification = () => {
	const [code, setCode] = useState(new Array(4).fill(''));
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();
	const inputRefs = useRef([]);

	const [isResetPassword, setIsResetPassword] = useState(false);

	// Get email and otpId from route state
	const { email } = location.state || {};

	// Handle OTP input changes
	const handleChange = (element, index) => {
		const value = element.value;
		if (isNaN(value) || value.length > 1) return;

		const newCode = [...code];
		newCode[index] = value;
		setCode(newCode);

		if (value && index < 3) {
			inputRefs.current[index + 1].focus();
		}
	};

	// Handle paste event
	// Handle paste event
	const handlePaste = (e) => {
		e.preventDefault();
		console.log('Paste event triggered'); // Debug log

		// Get the pasted data
		const pastedData = e.clipboardData.getData('text').trim();
		console.log('Pasted data:', pastedData); // Debug log

		// Ensure the pasted data is 4 digits
		if (pastedData.length !== 4 || isNaN(pastedData)) {
			setError('Please paste a valid 4-digit OTP');
			console.log('Invalid paste data'); // Debug log
			return;
		}

		// Split the pasted data into individual digits and update the state
		const newCode = pastedData.split('');
		console.log('New code:', newCode); // Debug log

		setCode(newCode); // Update the state with the new OTP digits

		// Update the input field values manually
		newCode.forEach((digit, index) => {
			if (inputRefs.current[index]) {
				inputRefs.current[index].value = digit;
			}
		});

		// Focus on the last input field after pasting
		if (inputRefs.current[3]) {
			inputRefs.current[3].focus();
		}
	};

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log('Form submitted with code:', code); // Debug log

		const otp = code.join('');
		if (otp.length !== 4) {
			setError('Please enter a 4-digit code');
			return;
		}

		if (!email) {
			setError('Email not found. Please start the reset process again.');
			navigate('/forget-password');
			return;
		}

		setLoading(true);
		setError('');

		try {
			const response = await axiosInstance.post('/auth/otp/verify/', {
				email,
				otp,
			});

			if (response.status === 200) {
				console.log('OTP verified:', response.data); // Debug log
				setIsResetPassword(true);
			}
		} catch (err) {
			setError(err.response?.data?.error || 'Invalid OTP. Please try again.');
			console.log('API error:', err.response?.data); // Debug log
		} finally {
			setLoading(false);
		}
	};

	// Handle resend OTP
	const handleResend = async () => {
		if (!email) {
			setError('Email not found. Please start the reset process again.');
			navigate('/forget-password');
			return;
		}

		setLoading(true);
		setError('');

		try {
			await axiosInstance.post('/auth/password-reset/request/', { email });
			setError('New OTP sent to your email');
			setCode(new Array(4).fill('')); // Clear the input fields
			inputRefs.current.forEach((input) => {
				if (input) input.value = '';
			});
		} catch (err) {
			setError(
				err.response?.data?.error || 'Failed to resend OTP. Please try again.'
			);
		} finally {
			setLoading(false);
		}
	};

	// Clear inputs on mount
	useEffect(() => {
		inputRefs.current.forEach((input) => {
			if (input) input.value = '';
		});
	}, []);

	return (
		<>
			{isResetPassword ? (
				<ResetPassword email={email} otp={code.join('')} />
			) : (
				<div className="flex items-center md:justify-between justify-center min-h-screen md:px-5">
					<div className="md:w-1/2 h-[95vh] md:block hidden relative rounded-md overflow-hidden">
						<img
							src={Black}
							alt="Illustration"
							className="w-full h-full object-cover rounded-md"
						/>
					</div>
					<div className="md:w-1/2 flex items-center justify-center">
						<div className="md:w-[60%] p-8 space-y-8 rounded-lg">
							<div className="w-full p-8 text-gray-700 rounded-lg shadow-lg">
								<h2 className="text-xl text-center mb-6">
									Enter Verification Code
								</h2>
								<p className="text-sm text-center mb-5">
									An email has been sent to{' '}
									<span className="font-semibold">{email || 'your email'}</span>{' '}
									containing a 4-digit code to reset your password.
								</p>

								{error && (
									<p
										className={`text-center text-sm mb-4 ${
											error.includes('sent') ? 'text-green-500' : 'text-red-500'
										}`}>
										{error}
									</p>
								)}

								<form onSubmit={handleSubmit}>
									<div className="flex justify-center space-x-2 mb-8">
										{code.map((digit, index) => (
											<input
												key={index}
												type="text"
												maxLength="1"
												value={digit}
												onChange={(e) => handleChange(e.target, index)}
												onPaste={index === 0 ? handlePaste : null}
												onKeyDown={(e) => {
													if (e.key === 'Backspace' && !digit && index > 0) {
														inputRefs.current[index - 1].focus();
													}
												}}
												ref={(el) => (inputRefs.current[index] = el)}
												className="w-12 h-12 bg-gray-100 rounded text-center text-lg font-bold border border-gray-300 focus:border-blue-500 focus:outline-none"
												onFocus={(e) => e.target.select()}
												required
												aria-label={`OTP digit ${index + 1}`}
											/>
										))}
									</div>
									<div className="w-full flex items-center justify-center">
										<button
											type="submit"
											disabled={loading}
											className={`md:w-[30%] flex items-center justify-center py-3 px-3 bg-blue-500 rounded text-white text-sm font-bold ${
												loading
													? 'opacity-50 cursor-not-allowed'
													: 'hover:bg-blue-700'
											}`}>
											{loading ? 'Verifying...' : 'Confirm'}
										</button>
									</div>
								</form>
								<p
									onClick={!loading ? handleResend : null}
									className={`text-center text-sm text-gray-600 mt-6 ${
										loading
											? 'cursor-not-allowed'
											: 'hover:text-blue-600 cursor-pointer'
									}`}>
									Didn't receive a code?{' '}
									<span className="font-semibold">Resend OTP</span>
								</p>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default OtpVerification;
