import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Replace these with your actual assets or Cloudinary images
const img2 = 'https://via.placeholder.com/40x40?text=%22'; // Quote icon
const img3 = 'https://via.placeholder.com/20x20?text=<'; // Left decoration (optional)
const img4 = 'https://via.placeholder.com/20x20?text=>'; // Right decoration (optional)

const testimonials = [
	{
		id: 1,
		name: 'Suntan',
		position: 'Frontend Developer',
		image:
			'https://res.cloudinary.com/dfsu0cuvb/image/upload/v1737529177/samples/smile.jpg',
		quote:
			'"The AI recommendations have saved us countless hours of planning and helped us identify risks we would have missed. Our project delivery time has improved by 30%."',
	},
	{
		id: 2,
		name: 'Rasif',
		position: 'Frontend Developer',
		image:
			'https://res.cloudinary.com/dfsu0cuvb/image/upload/v1737529178/samples/man-portrait.jpg',
		quote:
			'"The AI recommendations have saved us countless hours of planning and helped us identify risks we would have missed. Our project delivery time has improved by 30%."',
	},
	{
		id: 3,
		name: 'Bijoy Vi',
		position: 'Frontend Developer',
		image:
			'https://res.cloudinary.com/dfsu0cuvb/image/upload/v1737529169/samples/people/boy-snow-hoodie.jpg',
		quote:
			'"The AI recommendations have saved us countless hours of planning and helped us identify risks we would have missed. Our project delivery time has improved by 30%."',
	},
	{
		id: 4,
		name: 'Pappu Bhai',
		position: 'Frontend Developer',
		image:
			'https://res.cloudinary.com/dfsu0cuvb/image/upload/v1737529168/samples/people/kitchen-bar.jpg',
		quote:
			'"The AI recommendations have saved us countless hours of planning and helped us identify risks we would have missed. Our project delivery time has improved by 30%."',
	},
	{
		id: 5,
		name: 'Sojib Bhai',
		position: 'Frontend Developer',
		image:
			'https://res.cloudinary.com/dfsu0cuvb/image/upload/v1737529167/samples/animals/cat.jpg',
		quote:
			'"The AI recommendations have saved us countless hours of planning and helped us identify risks we would have missed. Our project delivery time has improved by 30%."',
	},
];

const UserSays = ({ reviewsRef }) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isAnimating, setIsAnimating] = useState(false);

	const handlePrev = () => {
		if (isAnimating) return;
		setIsAnimating(true);
		setCurrentIndex((prev) =>
			prev === 0 ? testimonials.length - 1 : prev - 1
		);
		setTimeout(() => setIsAnimating(false), 600);
	};

	const handleNext = () => {
		if (isAnimating) return;
		setIsAnimating(true);
		setCurrentIndex((prev) =>
			prev === testimonials.length - 1 ? 0 : prev + 1
		);
		setTimeout(() => setIsAnimating(false), 600);
	};

	useEffect(() => {
		const interval = setInterval(() => {
			if (!isAnimating) {
				handleNext();
			}
		}, 5000);
		return () => clearInterval(interval);
	}, [currentIndex, isAnimating]);

	const getCardPosition = (index) => {
		const totalItems = testimonials.length;
		const distance = (index - currentIndex + totalItems) % totalItems;
		const shortestDistance =
			distance <= totalItems / 2 ? distance : distance - totalItems;

		if (shortestDistance === 0) return 'center';
		if (shortestDistance === 1 || shortestDistance === -1) return 'adjacent';
		return 'edge';
	};

	return (
		<div ref={reviewsRef} className="py-16 px-4">
			<div className="max-w-[165vh] mx-auto">
				<div className="text-center mb-12">
					<p className="text-accent md:text-4xl text-2xl font-bold mb-2">
						REVIEWS
					</p>
					<h2 className="md:text-xl  font-bold text-gray-90">
						What Client Think About Us
					</h2>
				</div>

				<div className="relative">
					<div className="relative h-[500px] flex items-center justify-center overflow-hidden perspective-1000">
						<div className="absolute w-full flex justify-center items-center">
							{testimonials.map((testimonial, index) => {
								const position = getCardPosition(index);
								let transform = '';
								switch (position) {
									case 'center':
										transform = 'translateX(0%) scale(1) rotateY(0deg)';
										break;
									case 'adjacent':
										transform =
											(index - currentIndex + testimonials.length) %
												testimonials.length ===
											1
												? 'translateX(100%) scale(0.85) rotateY(-5deg)'
												: 'translateX(-100%) scale(0.85) rotateY(5deg)';
										break;
									case 'edge':
										transform =
											(index - currentIndex + testimonials.length) %
												testimonials.length <=
											2
												? 'translateX(185%) scale(0.7) rotateY(-10deg)'
												: 'translateX(-185%) scale(0.7) rotateY(10deg)';
										break;
								}

								const cardStyles = {
									transform,
									transformStyle: 'preserve-3d',
									zIndex:
										position === 'center'
											? 30
											: position === 'adjacent'
											? 20
											: 10,
									opacity:
										position === 'center'
											? 1
											: position === 'adjacent'
											? 0.9
											: 0.7,
									height: '400px', // Adjusted height to fit the new design
									width: '100%',
									maxWidth: '350px', // Slightly wider to match the image
									transition:
										'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s',
								};

								return (
									<div
										key={testimonial.id}
										className="absolute transition-all"
										style={cardStyles}>
										<div
											className={`rounded-2xl p-2 h-full flex flex-col items-center overflow-hidden ${
												position === 'center' ? 'bg-white ' : 'bg-white '
											}`}>
											<div
												className={`relative  overflow-hidden border-[10px] border-[#2BB0F7] rounded-lg shadow-lg ${
													position === 'center'
														? 'w-[95%] h-[200px] '
														: position === 'adjacent'
														? 'w-[95%] h-48 '
														: 'w-[95%] h-56 '
												}`}>
												<img
													src={testimonial.image}
													alt={`Photo of ${testimonial.name}`}
													className="w-full h-full object-cover"
												/>
											</div>
											<div className="bg-white z-30 p-4 -mt-5 rounded-lg shadow-md flex flex-col items-center justify-center">
												<h3
													className={`font-bold mt-4 ${
														position === 'center'
															? 'text-xl text-black dark:text-black'
															: position === 'adjacent'
															? 'text-lg text-black dark:text-black'
															: 'text-base text-black dark:text-black'
													}`}>
													{testimonial.name}
												</h3>

												<p
													className={`mb-4 font-medium ${
														position === 'center'
															? 'text-base text-gray-600 '
															: position === 'adjacent'
															? 'text-sm text-gray-600 '
															: 'text-xs text-gray-600 '
													}`}>
													{testimonial.position}
												</p>

												<p
													className={`text-center font-medium overflow-hidden ${
														position === 'center'
															? 'text-base text-gray-600  leading-relaxed'
															: position === 'adjacent'
															? 'text-sm text-black leading-snug'
															: 'text-xs text-black leading-tight line-clamp-3'
													}`}>
													{position === 'center'
														? testimonial.quote
														: position === 'adjacent'
														? testimonial.quote.length > 120
															? `${testimonial.quote.substring(0, 120)}...`
															: testimonial.quote
														: testimonial.quote.length > 80
														? `${testimonial.quote.substring(0, 80)}...`
														: testimonial.quote}
												</p>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</div>

					<div className="flex justify-center mt-8 gap-4">
						<button
							onClick={handlePrev}
							className="w-12 h-12 rounded-full bg-blue-900 dark:bg-blue-700 text-white flex items-center justify-center hover:bg-blue-800 dark:hover:bg-blue-600 transition-colors duration-300 disabled:opacity-50"
							aria-label="Previous testimonial"
							disabled={isAnimating}>
							<ChevronLeft size={24} />
						</button>
						<button
							onClick={handleNext}
							className="w-12 h-12 rounded-full bg-blue-900 dark:bg-blue-700 text-white flex items-center justify-center hover:bg-blue-800 dark:hover:bg-blue-600 transition-colors duration-300 disabled:opacity-50"
							aria-label="Next testimonial"
							disabled={isAnimating}>
							<ChevronRight size={24} />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserSays;
