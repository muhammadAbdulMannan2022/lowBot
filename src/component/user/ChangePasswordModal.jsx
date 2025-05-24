// ChangePasswordModal.jsx
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';

export default function ChangePasswordModal({ isOpen, onClose }) {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-md bg-white">
				<div className="mb-2">
					<button className="flex items-center text-gray-700" onClick={onClose}>
						<ArrowLeft className="h-5 w-5 mr-1" />
						<span>Back</span>
					</button>
				</div>

				<DialogHeader className="mb-6">
					<DialogTitle className="text-center text-2xl font-semibold">
						Change Password
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-6">
					<div className="space-y-2">
						<label htmlFor="new-password" className="block text-sm font-medium">
							New password
						</label>
						<div className="relative">
							<div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 text-gray-400"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor">
									<rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
									<path d="M7 11V7a5 5 0 0 1 10 0v4" />
								</svg>
							</div>
							<Input
								id="new-password"
								type="password"
								placeholder="Enter Password"
								className="pl-10"
							/>
						</div>
					</div>

					<div className="space-y-2">
						<label
							htmlFor="confirm-password"
							className="block text-sm font-medium">
							Confirm new password
						</label>
						<div className="relative">
							<div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 text-gray-400"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor">
									<rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
									<path d="M7 11V7a5 5 0 0 1 10 0v4" />
								</svg>
							</div>
							<Input
								id="confirm-password"
								type="password"
								placeholder="Enter Password"
								className="pl-10"
							/>
						</div>
					</div>

					<Button
						className="w-full bg-blue-500 hover:bg-blue-600 text-white"
						onClick={() => {
							// Handle password change logic here
							onClose();
						}}>
						Continue
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
