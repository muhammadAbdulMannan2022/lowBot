import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Register from '../assets/register.svg';
import { FcGoogle } from 'react-icons/fc';
import { FaLinkedin } from 'react-icons/fa';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axiosInstance from '../component/axiosInstance';

export default function Registration() {
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		email: '',
		role: '',
		password: '',
		confirmPassword: '',
	});
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (formData.password !== formData.confirmPassword) {
			setError('Passwords do not match');
			return;
		}

		if (!formData.email || !formData.role || !formData.password) {
			setError('Please fill in all fields');
			return;
		}

		try {
			const response = await axiosInstance.post('/auth/register/', {
				email: formData.email,
				role: formData.role,
				password: formData.password,
			});
			console.log('res', response.data);

			if (response.status === 201) {
				navigate('/');
			} else {
				setError('Invalid username or password');
			}
		} catch (error) {
			if (error.response) {
				console.log('Error response:', error.response.data);
				// If the server returned a response (e.g., 400 status)
				const serverErrors = error.response.data.error; // Adjust based on your API structure
				const formErrors = {
					email: '',
					role: '',
					password: '',
					confirmPassword: '',
				};
				setFormData(formErrors);
				setError(serverErrors);
			} else {
				// Handle other types of errors (e.g., network issues)
				console.log('Error without response:', error.message);

				setError('Network error. Please try again.');
			}
		} finally {
			setIsLoading(false);
		}
	};

	const handleChange = (name, value) => {
		setFormData((prev) => ({ ...prev, [name]: value }));
		setError('');
	};

	return (
		<main className="flex items-center md:justify-between justify-center min-h-screen md:px-5">
			{/* Left side - Image */}
			<div className="w-1/2 h-[95vh] md:block hidden relative rounded-md overflow-hidden">
				<img
					src={Register}
					alt="AI robot reading a book"
					className="w-full h-full object-cover rounded-md"
				/>
			</div>

			{/* Right side - Form */}
			<div className="flex flex-1 flex-col justify-center p-8 md:p-12">
				<div className="mx-auto w-full max-w-md">
					<div className="mb-6 text-center text-sm text-gray-500">
						Logo here
					</div>

					<h1 className="mb-8 text-2xl text-center font-semibold text-gray-900">
						Welcome to Digitalcy
					</h1>

					{error && (
						<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
							<span className="block sm:inline">{error}</span>
						</div>
					)}

					<form className="space-y-6" onSubmit={handleSubmit}>
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<div className="relative">
								<span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5"
										viewBox="0 0 20 20"
										fill="currentColor">
										<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
										<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
									</svg>
								</span>
								<Input
									id="email"
									type="email"
									placeholder="yourmail@email.com"
									className="pl-10"
									value={formData.email}
									onChange={(e) => handleChange('email', e.target.value)}
									required
								/>
							</div>
						</div>
						<div className="space-y-2">
							<Label htmlFor="role">What describes you best?</Label>
							<Select
								value={formData.role}
								onValueChange={(value) => handleChange('role', value)}>
								<SelectTrigger className="border-gray-300 hover:bg-blue-100 hover:text-blue-700">
									<SelectValue placeholder="Select role" />
								</SelectTrigger>
								<SelectContent className="z-[1000] bg-white border border-gray-200 shadow-lg">
									<SelectItem
										value="mentor"
										className="hover:bg-indigo-500 hover:text-white">
										Mentor
									</SelectItem>
									<SelectItem
										value="user"
										className="hover:bg-indigo-500 hover:text-white">
										Learner
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<div className="relative">
								<span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5"
										viewBox="0 0 20 20"
										fill="currentColor">
										<path
											fillRule="evenodd"
											d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
											clipRule="evenodd"
										/>
									</svg>
								</span>
								<Input
									id="password"
									type="password"
									placeholder="Password"
									className="pl-10"
									value={formData.password}
									onChange={(e) => handleChange('password', e.target.value)}
									required
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="confirmPassword">Confirm Password</Label>
							<div className="relative">
								<span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5"
										viewBox="0 0 20 20"
										fill="currentColor">
										<path
											fillRule="evenodd"
											d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
											clipRule="evenodd"
										/>
									</svg>
								</span>
								<Input
									id="confirmPassword"
									type="password"
									placeholder="Password"
									className="pl-10"
									value={formData.confirmPassword}
									onChange={(e) =>
										handleChange('confirmPassword', e.target.value)
									}
									required
								/>
							</div>
						</div>

						<Button
							type="submit"
							className="w-full bg-blue-500 hover:bg-blue-700 text-white hover:text-yellow-300">
							{isLoading ? (
								<span className="loader"></span>
							) : (
								<span>Register</span>
							)}
						</Button>
					</form>

					<div className="mt-6 text-center text-sm">
						<span className="text-gray-600">Already have an account?</span>{' '}
						<Link to="/" className="text-blue-500 hover:underline">
							Login
						</Link>
					</div>

					<div className="mt-6">
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-300"></div>
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-white px-2 text-gray-500">
									Or sign up with...
								</span>
							</div>
						</div>

						<div className="mt-6 flex gap-3">
							<Button
								variant="outline"
								className="flex-1 border-gray-300 hover:bg-indigo-500 hover:text-white"
								aria-label="Sign up with Google">
								<FcGoogle size={20} />
								Google
							</Button>
							<Button
								variant="outline"
								className="flex-1 border-gray-300 hover:bg-indigo-500 hover:text-white"
								aria-label="Sign up with LinkedIn">
								<FaLinkedin size={20} color="#0077B7" />
								LinkedIn
							</Button>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
