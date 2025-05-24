import { Bell, ChevronRight } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

function Navbar() {
	return (
		/* Top Navigation */
		<header className="bg-white fixed z-40 top-0 border-t-[20px] w-full border-[#C3DAEF] py-2 px-4 flex justify-end items-center border-b">
			<div className="flex items-center gap-4">
				<Bell className="w-5 h-5 text-gray-600" />
				<div className="flex items-center gap-2">
					<Avatar className="w-8 h-8 border">
						<AvatarImage
							src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Desktop%20-%20489-uXtSfwFxEGp28xQRAlXpi6iTA8vhbf.png"
							alt="User"
						/>
						<AvatarFallback>CM</AvatarFallback>
					</Avatar>
					<span className="font-medium">Cameron</span>
					<ChevronRight className="w-5 h-5" />
				</div>
			</div>
		</header>
	);
}

export default Navbar;
