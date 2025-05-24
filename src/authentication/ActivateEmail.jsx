import React, { useState, useRef } from 'react';
import { MdEmail, MdLockOutline } from 'react-icons/md';
// import Logo from '../assets/logo.svg';
import Black from '../assets/register.svg';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../component/axiosInstance';
import { useAuth } from '../component/AuthContext';

const ActivateEmail = () => {
	const [code, setCode] = useState(new Array(4).fill(''));
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const inputRefs = useRef([]); // Create refs for inputs
	const { login } = useAuth();

	const { state } = useLocation();
	const email = state?.email || {};

	// Handle individual input changes
	const handleChange = (element, index) => {
		if (isNaN(element.value)) return;

		const newCode = [...code];
		newCode[index] = element.value;
		setCode(newCode);

		if (element.value && index < 3) {
			inputRefs.current[index + 1].focus();
		}
	};

	// Handle paste event
	const handlePaste = (e) => {
		const pastedData = e.clipboardData.getData('text').trim();
		if (pastedData.length === 4 && !isNaN(pastedData)) {
			const newCode = pastedData.split('');
			setCode(newCode);
			inputRefs.current[3].focus(); // Focus last input after paste
			e.preventDefault();
		}
	};

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();

		const otp = code.join('');
		if (otp.length !== 4) {
			setError('Please enter a 4-digit code');
			return;
		}

		setLoading(true);
		setError('');

		try {
			const response = await axiosInstance.post('/accounts/activate/', {
				email: email,
				otp: otp,
			});

			console.log('OTP verified:', response.data);
			if (response.status === 200) {
				login(email, response.data.access_token, response.data.refresh_token);
				navigate('/home'); // Redirect to home page on success
			}
		} catch (err) {
			setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	// Handle resend OTP
	const handleResend = async () => {
		setLoading(true);
		try {
			await axiosInstance.post('/accounts/resend-otp/', { email });
			setError('New OTP sent to your email');
		} catch (err) {
			setError('Failed to resend OTP. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex items-center md:justify-between justify-center min-h-screen   md:px-5">
			<div className="w-1/2 h-[90vh] md:block hidden relative rounded-md overflow-hidden">
				<img
					src={Black}
					alt=""
					className="w-full h-full object-cover rounded-md"
				/>
			</div>
			<div className="md:w-1/2 flex items-center justify-center">
				<div className="md:w-[60%] p-8 space-y-8 rounded-lg">
					<div className="w-full p-8  text-t_color rounded-lg shadow-lg">
						<h2 className="text-[20px] text-center mb-6">
							We have sent you an activation code.
						</h2>
						<p className="text-[12px] text-center mb-5">
							An email has been sent to your email address containing a code to
							reset your password.
						</p>

						{error && (
							<p
								className={`text-center text-sm mb-4 ${
									error.includes('sent') ? 'text-green-500' : 'text-red-500'
								}`}>
								{error}
							</p>
						)}

						<p className="text-[16px] py-5 text-center">
							Enter verification code
						</p>
						<form onSubmit={handleSubmit}>
							<div className="flex justify-center space-x-2 mb-8">
								{code.map((digit, index) => (
									<input
										key={index}
										type="text"
										name="code"
										maxLength="1"
										value={digit}
										onChange={(e) => handleChange(e.target, index)}
										onPaste={index === 0 ? handlePaste : null} // Only first input handles paste
										onKeyUp={(e) => {
											if (e.key === 'Backspace' && !digit && index > 0) {
												inputRefs.current[index - 1].focus();
											}
										}}
										ref={(el) => (inputRefs.current[index] = el)} // Assign ref
										className="w-12 h-12 bg-gray-100 rounded text-center text-lg font-bold text-white border border-gray-100 focus:border-blue-500"
										onFocus={(e) => e.target.select()}
										required
									/>
								))}
							</div>
							<div className="w-full flex items-center justify-center">
								<button
									type="submit"
									disabled={loading}
									className={`w-[30%] flex items-center justify-center py-3 bg-blue-500 rounded text-white text-sm font-bold ${
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
							className={`text-center text-sm text-t_color mt-6 ${
								loading
									? 'cursor-not-allowed'
									: 'hover:text-blue-600 cursor-pointer'
							}`}>
							If you didn't receive a code! click here...
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ActivateEmail;
