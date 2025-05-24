import { CheckIcon } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export function ConfirmationModal({
	open,
	onOpenChange,
	message = 'Code has been sent again',
}) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md flex flex-col items-center py-10 bg-white">
				<div className="bg-blue-500 rounded-full p-2 mb-4">
					<CheckIcon className="h-6 w-6 text-white" />
				</div>
				<p className="text-center text-lg font-medium text-gray-800">
					{message}
				</p>
			</DialogContent>
		</Dialog>
	);
}
