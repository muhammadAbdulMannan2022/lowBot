import { ArrowLeft, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';

import { useState, useEffect } from 'react';
import axiosInstance from '../../component/axiosInstance';
import Sidebar from '../../component/admin/Sidebar';

export default function UserEditProfile() {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		first_name: '',
		last_name: '',
		phone_number: '',
		about: '',
		profession: '',
		education: '',
		gender: '',
		age: '',
		languages: '',
		profile_picture: null,
		house_no: '',
		road_no: '',
		city: '',
		postcode: '',
		business_email: '',
		phone_number_home: '',
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [fileName, setFileName] = useState('');

	// Fetch profile data on mount
	useEffect(() => {
		const fetchProfile = async () => {
			setLoading(true);
			try {
				const response = await axiosInstance.get('/auth/profile/');
				setFormData({
					...response.data,
					profile_picture: null, // Reset file input
				});
			} catch (err) {
				setError(err.response?.data?.error || 'Failed to fetch profile');
			} finally {
				setLoading(false);
			}
		};
		fetchProfile();
	}, []);

	// Handle input changes
	const handleInputChange = (e) => {
		const { id, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[id]: value,
		}));
	};

	// Handle file input change
	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setFormData((prev) => ({
				...prev,
				profile_picture: file,
			}));
			setFileName(file.name);
		}
	};

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError('');

		const data = new FormData();
		Object.keys(formData).forEach((key) => {
			if (formData[key] !== null && formData[key] !== '') {
				data.append(key, formData[key]);
			}
		});

		try {
			const response = await axiosInstance.put('/auth/profile/', data, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			if (response.status === 200) {
				navigate('/profile', {
					state: { success: 'Profile updated successfully' },
				});
			}
		} catch (err) {
			setError(err.response?.data?.error || 'Failed to update profile');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex flex-col h-screen bg-[#f0f7ff]">
			<div className="flex flex-1 overflow-hidden mt-16">
				{/* Sidebar */}
				<Sidebar />

				{/* Main Content */}
				<div className="flex-1 overflow-y-auto p-4 md:p-6 md:pl-7 md:mt-0 mt-16">
					<div className="mb-6">
						<Button
							onClick={() => navigate(-1)}
							variant="ghost"
							className="p-2 flex items-center text-slate-800 hover:bg-blue-500 hover:text-white"
							aria-label="Go back">
							<ArrowLeft className="h-4 w-4 mr-2" />
							Back
						</Button>
					</div>

					<h1 className="text-xl font-semibold text-center mb-8 text-slate-800">
						Edit Profile Details
					</h1>

					{error && <p className="text-red-500 text-center mb-4">{error}</p>}

					{loading ? (
						<p className="text-center">Loading...</p>
					) : (
						<form onSubmit={handleSubmit}>
							{/* Personal Information Section */}
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8">
								<div className="space-y-2">
									<Label htmlFor="first_name">First Name</Label>
									<Input
										id="first_name"
										placeholder="Enter here"
										value={formData.first_name || ''}
										onChange={handleInputChange}
										className="w-full"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="last_name">Last Name</Label>
									<Input
										id="last_name"
										placeholder="Enter here"
										value={formData.last_name || ''}
										onChange={handleInputChange}
										className="w-full"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="phone_number">Phone number (personal)</Label>
									<div className="relative">
										<Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
										<Input
											id="phone_number"
											placeholder="5646-6541645"
											value={formData.phone_number || ''}
											onChange={handleInputChange}
											className="pl-10 w-full"
										/>
									</div>
								</div>

								<div className="space-y-2 sm:col-span-2 md:col-span-3">
									<Label htmlFor="about">Describe yourself in short</Label>
									<Input
										id="about"
										placeholder="Enter here"
										value={formData.about || ''}
										onChange={handleInputChange}
										className="w-full"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="profession">Profession</Label>
									<Input
										id="profession"
										placeholder="Enter here"
										value={formData.profession || ''}
										onChange={handleInputChange}
										className="w-full"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="education">Education</Label>
									<Input
										id="education"
										placeholder="Enter here"
										value={formData.education || ''}
										onChange={handleInputChange}
										className="w-full"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="gender">Gender</Label>
									<Input
										id="gender"
										placeholder="Enter here"
										value={formData.gender || ''}
										onChange={handleInputChange}
										className="w-full"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="age">Age</Label>
									<Input
										id="age"
										type="number"
										placeholder="Enter here"
										value={formData.age || ''}
										onChange={handleInputChange}
										className="w-full"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="languages">Language</Label>
									<Input
										id="languages"
										placeholder="Enter here"
										value={formData.languages || ''}
										onChange={handleInputChange}
										className="w-full"
									/>
								</div>

								<div className="space-y-2 sm:col-span-2 md:col-span-1">
									<Label htmlFor="profile_picture">Upload picture</Label>
									<div className="flex flex-col sm:flex-row">
										<Button
											type="button"
											variant="outline"
											className="rounded-r-none border-r-0 bg-gray-100 hover:bg-gray-200 text-gray-700 w-full sm:w-auto"
											onClick={() =>
												document.getElementById('profile_picture').click()
											}
											aria-label="Choose file">
											Choose file
										</Button>
										<Input
											id="profile_picture"
											type="file"
											accept="image/*"
											onChange={handleFileChange}
											className="hidden"
										/>
										<Input
											value={fileName || 'No file chosen'}
											readOnly
											className="rounded-l-none bg-white w-full sm:w-auto"
										/>
									</div>
								</div>
							</div>

							{/* Address Section */}
							<h2 className="text-lg font-medium mb-4 text-slate-800">
								Address
							</h2>
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8">
								<div className="space-y-2">
									<Label htmlFor="house_no">House No.</Label>
									<Input
										id="house_no"
										placeholder="Enter here"
										value={formData.house_no || ''}
										onChange={handleInputChange}
										className="w-full"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="road_no">Road No</Label>
									<Input
										id="road_no"
										placeholder="Enter here"
										value={formData.road_no || ''}
										onChange={handleInputChange}
										className="w-full"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="city">Town/city</Label>
									<Input
										id="city"
										placeholder="Enter here"
										value={formData.city || ''}
										onChange={handleInputChange}
										className="w-full"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="postcode">Postal code</Label>
									<Input
										id="postcode"
										placeholder="Enter here"
										value={formData.postcode || ''}
										onChange={handleInputChange}
										className="w-full"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="business_email">Business email</Label>
									<div className="relative">
										<Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
										<Input
											id="business_email"
											placeholder="user@mail.com"
											value={formData.business_email || ''}
											onChange={handleInputChange}
											className="pl-10 w-full"
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="phone_number_home">Phone number (Home)</Label>
									<div className="relative">
										<Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
										<Input
											id="phone_number_home"
											placeholder="5646-6541645"
											value={formData.phone_number_home || ''}
											onChange={handleInputChange}
											className="pl-10 w-full"
										/>
									</div>
								</div>
							</div>

							<div className="flex justify-center">
								<Button
									type="submit"
									disabled={loading}
									className={`w-full max-w-xs bg-blue-500 hover:bg-blue-600 text-white ${
										loading ? 'opacity-50 cursor-not-allowed' : ''
									}`}
									aria-label="Save profile changes">
									{loading ? 'Saving...' : 'Done'}
								</Button>
							</div>
						</form>
					)}
				</div>
			</div>
		</div>
	);
}
