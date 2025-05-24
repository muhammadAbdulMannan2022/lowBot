// ProfileDetailsModal.jsx
'use client';

import { useState } from 'react';
import { ArrowLeft, Trash2, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export default function ProfileDetailsModal({ isOpen, onClose }) {
	const [photoName, setPhotoName] = useState(null);

	const handlePhotoDelete = () => {
		setPhotoName(null);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		// Handle form submission logic here (e.g., API call to update profile)
		onClose(); // Close the modal after submission
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-md p-0 border border-blue-100 rounded-lg overflow-hidden">
				<div className="bg-white p-6 w-full">
					<div className="mb-6">
						<button
							className="flex items-center text-gray-700"
							onClick={onClose}>
							<ArrowLeft className="h-5 w-5 mr-1" />
							<span>Back</span>
						</button>
					</div>

					<h1 className="text-2xl font-semibold text-center text-gray-700 mb-6">
						Profile Details
					</h1>

					<form className="space-y-5" onSubmit={handleSubmit}>
						<div className="space-y-2">
							<Label htmlFor="name" className="text-gray-600">
								Name of the user
							</Label>
							<Input
								id="name"
								defaultValue="Sumon Kumar"
								className="border-gray-200 focus:border-blue-300 focus:ring-blue-300"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="phone" className="text-gray-600">
								Phone number
							</Label>
							<Input
								id="phone"
								defaultValue="3546-63541645"
								className="border-gray-200 focus:border-blue-300 focus:ring-blue-300"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="profession" className="text-gray-600">
								Profession
							</Label>
							<Input
								id="profession"
								placeholder="Enter here"
								className="border-gray-200 focus:border-blue-300 focus:ring-blue-300"
							/>
						</div>

						<div className="space-y-2">
							<Label className="text-gray-600">Upload your photo</Label>
							<div className="flex items-center gap-3">
								{photoName ? (
									<div className="flex items-center bg-blue-50 rounded-md px-3 py-2">
										<ImageIcon className="h-5 w-5 text-blue-500 mr-2" />
										<span className="text-sm text-gray-600">{photoName}</span>
									</div>
								) : (
									<Button
										variant="outline"
										className="h-10 px-3 text-sm border-gray-200"
										onClick={() => setPhotoName('Namexyz.jpg')}>
										Choose file
									</Button>
								)}

								{photoName && (
									<Button
										variant="ghost"
										size="icon"
										className="h-8 w-8 text-red-500"
										onClick={handlePhotoDelete}>
										<Trash2 className="h-4 w-4" />
									</Button>
								)}
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="email" className="text-gray-600">
								Email
							</Label>
							<Input
								id="email"
								type="email"
								placeholder="Enter here"
								className="border-gray-200 focus:border-blue-300 focus:ring-blue-300"
							/>
						</div>

						<div className="pt-4">
							<Button
								type="submit"
								className="w-full bg-blue-500 hover:bg-blue-600 text-white">
								Submit
							</Button>
						</div>
					</form>
				</div>
			</DialogContent>
		</Dialog>
	);
}
