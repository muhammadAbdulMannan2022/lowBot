// LandingPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import Robot from '../assets/robot.svg';
import ReviewsSlider from '../component/ReviewsSlider';
import { FaChevronDown } from 'react-icons/fa';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import Login from '../assets/login.svg';
import Navbar from '../component/Navbar';
import { Link } from 'react-router-dom';

const LandingPage = () => {
	const [openFaq, setOpenFaq] = useState(null);
	const [activeSection, setActiveSection] = useState('home'); // Track the active section

	const faqs = [
		{
			question: 'What is field service management?',
			answer:
				"Field service management refers to the management of a company's resources employed at or en route to the property of clients, rather than on company property.",
		},
		{
			question: 'What are the benefits of field service management?',
			answer:
				'Benefits include improved efficiency, reduced costs, better customer satisfaction, optimized scheduling, and enhanced communication between field workers and the office.',
		},
		{
			question: 'How much does field service management cost?',
			answer:
				'Costs vary depending on the size of your organization, features needed, and deployment model. Most solutions offer tiered pricing based on the number of users.',
		},
		{
			question: 'What are the common features of field service management?',
			answer:
				'Common features include scheduling, dispatching, work order management, mobile access, customer management, inventory management, and reporting.',
		},
		{
			question: 'Factors to consider when buying field service management?',
			answer:
				'Consider your business size, industry-specific needs, integration capabilities, mobile functionality, ease of use, scalability, and total cost of ownership.',
		},
		{
			question: 'Who needs field service management?',
			answer:
				'Industries that benefit include HVAC, plumbing, electrical, IT services, property maintenance, healthcare, telecommunications, and any business with mobile workers.',
		},
	];

	// Create refs for each section
	const homeRef = useRef(null);
	const reviewsRef = useRef(null);
	const faqRef = useRef(null);
	const contactRef = useRef(null);

	// Scroll handler functions
	const scrollToHome = () => {
		homeRef.current.scrollIntoView({ behavior: 'smooth' });
		setActiveSection('home');
	};

	const scrollToReviews = () => {
		reviewsRef.current.scrollIntoView({ behavior: 'smooth' });
		setActiveSection('reviews');
	};

	const scrollToFaq = () => {
		faqRef.current.scrollIntoView({ behavior: 'smooth' });
		setActiveSection('faq');
	};

	const scrollToContact = () => {
		contactRef.current.scrollIntoView({ behavior: 'smooth' });
		setActiveSection('contact');
	};

	// Set up IntersectionObserver to detect which section is in view
	useEffect(() => {
		const sections = [
			{ ref: homeRef, id: 'home' },
			{ ref: reviewsRef, id: 'reviews' },
			{ ref: faqRef, id: 'faq' },
			{ ref: contactRef, id: 'contact' },
		];

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setActiveSection(entry.target.id);
					}
				});
			},
			{
				root: null, // Use the viewport as the root
				threshold: 0.5, // Trigger when 50% of the section is in view
			}
		);

		// Observe each section
		sections.forEach((section) => {
			if (section.ref.current) {
				observer.observe(section.ref.current);
			}
		});

		// Clean up the observer on unmount
		return () => {
			sections.forEach((section) => {
				if (section.ref.current) {
					observer.unobserve(section.ref.current);
				}
			});
		};
	}, []);

	// Toggle FAQ
	const toggleFaq = (index) => {
		setOpenFaq(openFaq === index ? null : index);
	};

	return (
		<div className="font-sans">
			{/* Header */}
			<Navbar
				onScrollToHome={scrollToHome}
				onScrollToReviews={scrollToReviews}
				onScrollToFaq={scrollToFaq}
				onScrollToContact={scrollToContact}
				activeSection={activeSection}
				setActiveSection={setActiveSection}
			/>

			{/* Hero Section */}
			<section
				ref={homeRef}
				id="home"
				className="bg-image text-white py-16 px-8 flex flex-col md:flex-row items-center">
				<div className="md:w-1/2">
					<h1 className="md:text-4xl text-2xl font-bold mb-4">
						AI-POWERED PDF TRANSFORMATION
					</h1>
					<p className="md:text-lg text-sm mb-6">
						Upload, enhance, and reformat, or experience the future of document
						generation to meet your needs.
					</p>
					<Link
						to={'/login'}
						className="bg-secondary md:text-base text-sm text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-300">
						GET STARTED NOW
					</Link>
				</div>
			</section>

			{/* Features Section */}
			<section className="pt-10 px-8 flex items-center justify-center flex-col bg-gray-100">
				<h2 className="md:text-4xl text-2xl text-accent font-bold text-center">
					ARTIFICIAL INTELLIGENCE
				</h2>
				<h3 className="text-2xl text-[#304750] mb-4">Advanced feature</h3>
			</section>

			{/* Reviews Section */}
			<section
				ref={reviewsRef}
				id="reviews"
				className="py-16 md:px-20 px-2 bg-gray-100">
				<div className="shadow-lg bg-white p-4 rounded-lg border md:h-[400px] flex md:flex-row flex-col justify-start items-center">
					<div className="h-[30vh] md:w-[30%] mx-auto">
						<img src={Robot} alt="" className="w-full h-full" />
					</div>
					<div className="flex flex-col items-start md:w-[60%] mx-auto md:mt-0 mt-4">
						<h2 className="md:text-4xl text-2xl text-accent font-bold md:text-center mb-2">
							Let AI Do the Heavy Lifting — For Your PDFs
						</h2>
						<p className="md:text-lg text-sm text-center mb-4">
							Your documents, upgraded.
						</p>
						<p className="md:text-lg text-sm text-left mb-4 md:w-[70%]">
							Harness the power of Artificial Intelligence to generate, enhance,
							and recreate your PDFs with unmatched precision.
						</p>
						<h3 className="text-accent font-semibold">
							Faster. Smarter. Effortless.
						</h3>
						<button className="bg-secondary md:text-base text-sm text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-600 mt-4">
							Try It Now
						</button>
					</div>
				</div>
			</section>
			<ReviewsSlider />

			{/* FAQ Section */}
			<section ref={faqRef} id="faq" className="py-16 bg-gray-100">
				<div className="container mx-auto px-4">
					<div className="max-w-8xl flex-col items-center justify-center mx-auto">
						<h2 className="md:text-4xl text-2xl text-accent text-center font-bold mb-10">
							FREQUENTLY ASKED QUESTIONS
						</h2>
						<div className="flex md:flex-row flex-col items-center justify-between w-full">
							<div className="md:w-[50%] mx-auto">
								<div className="space-y-4">
									{faqs.map((faq, index) => (
										<div key={index} className="border-b pb-4">
											<button
												className="flex justify-between items-center w-full text-left"
												onClick={() => toggleFaq(index)}>
												<span className="font-medium">{faq.question}</span>
												<FaChevronDown
													className={`w-5 h-5 text-gray-500 transition-transform ${
														openFaq === index ? 'rotate-180' : ''
													}`}
												/>
											</button>
											{openFaq === index && (
												<div className="mt-2 text-gray-600 text-sm">
													{faq.answer}
												</div>
											)}
										</div>
									))}
								</div>
							</div>
							<div>
								<div className="md:w-[50%] p-6 rounded-lg">
									<h3 className="text-xl font-bold mb-4">FAQ's</h3>
									<p className="text-sm text-gray-600 mb-4">
										Let us know if you have any other questions, we'd love to
										answer them for you.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Contact Us Section */}
			<section
				ref={contactRef}
				id="contact"
				className="py-16 px-8 bg-gradient-to-r bg-contact dfrom-blue-600 tod-blue-800 text-white">
				<div className="container mx-auto px-4">
					<div className="max-w-4xl mx-auto text-center mb-8">
						<h2 className="md:text-4xl text-2xl font-bold mb-1">Contact Us</h2>
						<p>Have a question? reach out to us!</p>
					</div>

					<form
						className="max-w-4xl mx-auto"
						onSubmit={(e) => e.preventDefault()}>
						<div className="grid md:grid-cols-2 gap-4 mb-4">
							<div>
								<label className="block mb-1 text-sm">First name</label>
								<input
									type="text"
									placeholder="Enter here"
									className="w-full p-2 border border-gray-500 rounded"
									style={{ backgroundColor: 'rgba(246, 248, 250, 0.3)' }}
								/>
							</div>
							<div>
								<label className="block mb-1 text-sm">Last name</label>
								<input
									type="text"
									placeholder="Enter here"
									className="w-full p-2 border border-gray-500 rounded"
									style={{ backgroundColor: 'rgba(246, 248, 250, 0.3)' }}
								/>
							</div>
						</div>

						<div className="grid md:grid-cols-2 gap-4 mb-4">
							<div>
								<label className="block mb-1 text-sm">Email</label>
								<input
									type="email"
									placeholder="Enter here"
									className="w-full p-2 border border-gray-500 rounded"
									style={{ backgroundColor: 'rgba(246, 248, 250, 0.3)' }}
								/>
							</div>
							<div>
								<label className="block mb-1 text-sm">Phone number</label>
								<input
									type="tel"
									placeholder="Enter here"
									className="w-full p-2 border border-gray-500 rounded"
									style={{ backgroundColor: 'rgba(246, 248, 250, 0.3)' }}
								/>
							</div>
						</div>

						<div className="grid md:grid-cols-2 gap-4 mb-4">
							<div>
								<label className="block mb-1 text-sm">Team</label>
								<input
									type="text"
									placeholder="Enter here"
									className="w-full p-2 border border-gray-500 rounded"
									style={{ backgroundColor: 'rgba(246, 248, 250, 0.3)' }}
								/>
							</div>
							<div>
								<label className="block mb-1 text-sm">Location</label>
								<input
									type="text"
									placeholder="Enter here"
									className="w-full p-2 border border-gray-500 rounded"
									style={{ backgroundColor: 'rgba(246, 248, 250, 0.3)' }}
								/>
							</div>
						</div>

						<div className="mb-6">
							<label className="block mb-1 text-sm">How can we help you?</label>
							<textarea
								rows={5}
								placeholder="Enter here"
								className="w-full p-2 border border-gray-500 rounded"
								style={{
									backgroundColor: 'rgba(246, 248, 250, 0.3)',
								}}></textarea>
						</div>

						<div className="flex justify-center">
							<button
								type="submit"
								className="bg-blue-500 text-white px-8 py-2 rounded hover:bg-cyan-600 transition">
								Submit
							</button>
						</div>
					</form>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-[#0a2e47] text-white py-12">
				<div className="container mx-auto px-4">
					<div className="grid md:grid-cols-4 gap-8 mb-8">
						<div>
							<div className="text-xl font-bold mb-4">Logo here</div>
						</div>

						<div>
							<h3 className="font-bold mb-4">Our collaborators</h3>
							<ul className="space-y-2 text-sm">
								<li>Demo company limited</li>
								<li>Demo tech company</li>
							</ul>
						</div>

						<div>
							<h3 className="font-bold mb-4">About Us</h3>
							<ul className="space-y-2 text-sm">
								<li>Mission</li>
								<li>Learn more</li>
							</ul>
						</div>

						<div>
							<h3 className="font-bold mb-4">Follow us on</h3>
							<div className="flex space-x-4">
								<a href="#" className="hover:text-cyan-400">
									<FaFacebook className="w-5 h-5" />
								</a>
								<a href="#" className="hover:text-cyan-400">
									<FaTwitter className="w-5 h-5" />
								</a>
								<a href="#" className="hover:text-cyan-400">
									<FaInstagram className="w-5 h-5" />
								</a>
								<a href="#" className="hover:text-cyan-400">
									<FaLinkedin className="w-5 h-5" />
								</a>
							</div>
						</div>
					</div>

					<div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center text-sm">
						<div>© 2023 Digital. All rights reserved</div>
						<div className="flex space-x-4 mt-4 md:mt-0">
							<a href="#" className="hover:text-cyan-400">
								Privacy Notice
							</a>
							<a href="#" className="hover:text-cyan-400">
								FAQs
							</a>
							<a href="#" className="hover:text-cyan-400">
								Cookie Policy & Settings
							</a>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default LandingPage;
