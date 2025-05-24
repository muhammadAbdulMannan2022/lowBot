import { Search, Clock, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '../../component/user/Navbar';
import Sidebar from '../../component/user/UserSidebar';
import { useState, useEffect } from 'react';
import axiosInstance from '../../component/axiosInstance';

export default function UserMeetings() {
	const [meetings, setMeetings] = useState([]);
	const [filteredMeetings, setFilteredMeetings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [searchQuery, setSearchQuery] = useState('');
	const [users, setUsers] = useState([]);
	const [newMeeting, setNewMeeting] = useState({
		date: '',
		meeting_time: '',
		duration: '',
		meeting_id: '',
		link: '',
		users: [],
	});

	// Stats
	const today = new Date().toISOString().split('T')[0];
	const meetingsToday = meetings.filter(
		(meeting) => meeting.date === today
	).length;
	const pendingMeetings = meetings.filter(
		(meeting) => new Date(meeting.date) >= new Date()
	).length;

	// Fetch meetings and users on mount
	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const [meetingsResponse] = await Promise.all([
					axiosInstance.get('/zoom/meetings/'),
				]);
				setMeetings(meetingsResponse.data);
				setFilteredMeetings(meetingsResponse.data);
			} catch (err) {
				setError(err.response?.data?.error || 'Failed to fetch data');
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	// Handle search
	useEffect(() => {
		const filtered = meetings.filter((meeting) =>
			`${meeting.date} ${meeting.meeting_id} ${meeting.link}`
				.toLowerCase()
				.includes(searchQuery.toLowerCase())
		);
		setFilteredMeetings(filtered);
	}, [searchQuery, meetings]);

	// Handle new meeting input changes

	// Handle user selection

	// Delete meeting
	const handleDeleteMeeting = async (meetingId) => {
		setLoading(true);
		try {
			await axiosInstance.delete(`/zoom/meetings/${meetingId}/`);
			setMeetings((prev) =>
				prev.filter((meeting) => meeting.meeting_id !== meetingId)
			);
		} catch (err) {
			setError(err.response?.data?.error || 'Failed to delete meeting');
		} finally {
			setLoading(false);
		}
	};

	// Filter meetings for tabs
	const upcomingMeetings = filteredMeetings.filter(
		(meeting) => new Date(meeting.date) >= new Date()
	);
	const completedMeetings = filteredMeetings.filter(
		(meeting) => new Date(meeting.date) < new Date()
	);

	// Get current day and upcoming meeting
	const currentDate = new Date();
	const upcomingMeeting = upcomingMeetings[0]; // First upcoming meeting

	if (loading) {
		return (
			<div className="flex flex-col h-screen bg-[#f0f7ff]">
				<Navbar />
				<div className="flex flex-1 overflow-hidden mt-16">
					<Sidebar />
					<div className="flex-1 flex items-center justify-center">
						<p>Loading...</p>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col h-screen bg-[#f0f7ff]">
				<Navbar />
				<div className="flex flex-1 overflow-hidden mt-20">
					<Sidebar />
					<div className="flex-1 flex items-center justify-center">
						<p className="text-red-500">{error}</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col h-screen bg-[#f0f7ff]">
			<Navbar />
			<div className="flex flex-1 overflow-hidden mt-16">
				{/* Sidebar */}
				<Sidebar />

				{/* Main Content */}
				<div className="flex-1 overflow-y-auto p-4 md:pl-2">
					<h1 className="text-xl font-semibold text-center mb-6 text-slate-800">
						Meetings
					</h1>

					{/* Stats Cards */}
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
						<Card>
							<CardContent className="flex items-center justify-between p-4">
								<div>
									<p className="text-sm text-muted-foreground">Chats opened</p>
									<p className="text-2xl font-bold">{meetings.length}</p>
								</div>
								<div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
									<span className="text-blue-500 text-sm">💬</span>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="flex items-center justify-between p-4">
								<div>
									<p className="text-sm text-muted-foreground">Meeting Today</p>
									<p className="text-2xl font-bold">{meetingsToday}</p>
								</div>
								<div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
									<span className="text-blue-500 text-sm">👥</span>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="flex items-center justify-between p-4">
								<div>
									<p className="text-sm text-muted-foreground">
										Pending meetings
									</p>
									<p className="text-2xl font-bold">{pendingMeetings}</p>
								</div>
								<div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
									<span className="text-amber-500 text-sm">⏳</span>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="flex items-center justify-between p-4">
								<div>
									<p className="text-sm text-muted-foreground">Completed</p>
									<p className="text-2xl font-bold">
										{meetings.length - pendingMeetings}
									</p>
								</div>
								<div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
									<span className="text-green-500 text-sm">✅</span>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Current Day and Upcoming Meeting */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
						<Card className="bg-white">
							<CardContent className="p-4">
								<h2 className="text-sm text-muted-foreground mb-1">
									{currentDate.toLocaleDateString('en-US', { weekday: 'long' })}
								</h2>
								<p className="font-medium">
									{currentDate.toLocaleDateString('en-US', {
										month: 'long',
										day: 'numeric',
										year: 'numeric',
									})}
								</p>
							</CardContent>
						</Card>

						<Card className="bg-white">
							<CardContent className="p-4">
								<div className="flex justify-between items-center">
									<h2 className="text-sm text-muted-foreground mb-1">
										Upcoming
									</h2>
									<p className="text-sm text-muted-foreground">Time</p>
								</div>
								<div className="flex justify-between items-center flex-wrap">
									<p className="font-medium text-blue-500">
										{upcomingMeeting
											? `Meeting ID: ${upcomingMeeting.meeting_id}`
											: 'No upcoming meeting'}
									</p>
									<p className="font-medium">
										{upcomingMeeting
											? `${new Date(
													upcomingMeeting.date
											  ).toLocaleDateString()} ${
													upcomingMeeting.meeting_time || 'N/A'
											  }`
											: 'N/A'}
									</p>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Add New Meeting Form */}

					{/* Tabs and Meeting Table */}
					<div className="bg-white rounded-lg shadow-sm">
						<Tabs defaultValue="upcoming">
							<div className="flex flex-col md:flex-row justify-between items-center p-4 border-b gap-4">
								<TabsList className="w-full md:w-auto">
									<TabsTrigger
										value="upcoming"
										className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-none rounded-none w-full md:w-auto"
										aria-label="View upcoming meetings">
										Upcoming
									</TabsTrigger>
									<TabsTrigger
										value="completed"
										className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-none rounded-none w-full md:w-auto"
										aria-label="View completed meetings">
										Completed
									</TabsTrigger>
								</TabsList>

								<div className="relative w-full md:w-auto">
									<Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
									<Input
										placeholder="Search by date, ID, etc."
										className="pl-8 h-9 w-full md:w-[200px] lg:w-[300px]"
										aria-label="Search meetings"
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
									/>
								</div>
							</div>

							<TabsContent value="upcoming" className="m-0">
								{upcomingMeetings.length === 0 ? (
									<div className="p-4 text-center text-muted-foreground">
										No upcoming meetings to display.
									</div>
								) : (
									<>
										<div className="block md:hidden">
											{upcomingMeetings.map((meeting) => (
												<Card key={meeting.meeting_id} className="mb-4 p-4">
													<div className="flex flex-col gap-2">
														<div className="flex justify-between">
															<span className="text-sm font-medium text-muted-foreground">
																Date
															</span>
															<span className="text-sm">
																{meeting.date
																	? new Date(meeting.date).toLocaleDateString()
																	: 'N/A'}
															</span>
														</div>
														<div className="flex justify-between">
															<span className="text-sm font-medium text-muted-foreground">
																Meeting time
															</span>
															<span className="text-sm">
																{meeting.meeting_time || 'N/A'}
															</span>
														</div>
														<div className="flex justify-between">
															<span className="text-sm font-medium text-muted-foreground">
																Duration
															</span>
															<div className="flex items-center text-sm">
																<Clock className="h-4 w-4 mr-1 text-muted-foreground" />
																<span>{meeting.duration || 'N/A'}</span>
															</div>
														</div>
														<div className="flex justify-between">
															<span className="text-sm font-medium text-muted-foreground">
																Meeting ID
															</span>
															<span className="text-sm text-blue-500">
																{meeting.meeting_id}
															</span>
														</div>
														<div className="flex justify-between">
															<span className="text-sm font-medium text-muted-foreground">
																Link
															</span>
															{meeting.link ? (
																<a
																	href={meeting.link}
																	className="text-sm text-blue-500"
																	target="_blank"
																	rel="noopener noreferrer">
																	{meeting.link}
																</a>
															) : (
																'N/A'
															)}
														</div>
														<div className="flex justify-end">
															<Button
																variant="ghost"
																size="sm"
																className="text-red-500 h-8 px-2"
																aria-label="Delete meeting"
																onClick={() =>
																	handleDeleteMeeting(meeting.meeting_id)
																}>
																<Trash2 className="h-4 w-4" />
																<span className="ml-1">Delete</span>
															</Button>
														</div>
													</div>
												</Card>
											))}
										</div>
										<div className="hidden md:block overflow-x-auto">
											<table className="w-full">
												<thead>
													<tr className="border-b bg-slate-50">
														<th className="text-left p-4 font-medium text-sm text-muted-foreground">
															Date
														</th>
														<th className="text-left p-4 font-medium text-sm text-muted-foreground">
															Meeting time
														</th>
														<th className="text-left p-4 font-medium text-sm text-muted-foreground">
															Duration
														</th>
														<th className="text-left p-4 font-medium text-sm text-muted-foreground">
															Meeting ID
														</th>
														<th className="text-left p-4 font-medium text-sm text-muted-foreground">
															Link
														</th>
														<th className="text-left p-4 font-medium text-sm text-muted-foreground">
															Action
														</th>
													</tr>
												</thead>
												<tbody>
													{upcomingMeetings.map((meeting) => (
														<tr
															key={meeting.meeting_id}
															className="border-b hover:bg-slate-50">
															<td className="p-4 text-sm">
																{meeting.date
																	? new Date(meeting.date).toLocaleDateString()
																	: 'N/A'}
															</td>
															<td className="p-4 text-sm">
																{meeting.meeting_time || 'N/A'}
															</td>
															<td className="p-4 text-sm">
																<div className="flex items-center">
																	<Clock className="h-4 w-4 mr-1 text-muted-foreground" />
																	<span>{meeting.duration || 'N/A'}</span>
																</div>
															</td>
															<td className="p-4 text-sm text-blue-500">
																{meeting.meeting_id}
															</td>
															<td className="p-4 text-sm">
																{meeting.link ? (
																	<a
																		href={meeting.link}
																		className="text-blue-500"
																		target="_blank"
																		rel="noopener noreferrer">
																		{meeting.link}
																	</a>
																) : (
																	'N/A'
																)}
															</td>
															<td className="p-4 text-sm">
																<Button
																	variant="ghost"
																	size="sm"
																	className="text-red-500 h-8 px-2"
																	aria-label="Delete meeting"
																	onClick={() =>
																		handleDeleteMeeting(meeting.meeting_id)
																	}>
																	<Trash2 className="h-4 w-4" />
																	<span className="ml-1">Delete</span>
																</Button>
															</td>
														</tr>
													))}
												</tbody>
											</table>
										</div>
									</>
								)}
							</TabsContent>

							<TabsContent value="completed" className="m-0">
								{completedMeetings.length === 0 ? (
									<div className="p-4 text-center text-muted-foreground">
										No completed meetings to display.
									</div>
								) : (
									<>
										<div className="block md:hidden">
											{completedMeetings.map((meeting) => (
												<Card key={meeting.meeting_id} className="mb-4 p-4">
													<div className="flex flex-col gap-2">
														<div className="flex justify-between">
															<span className="text-sm font-medium text-muted-foreground">
																Date
															</span>
															<span className="text-sm">
																{meeting.date
																	? new Date(meeting.date).toLocaleDateString()
																	: 'N/A'}
															</span>
														</div>
														<div className="flex justify-between">
															<span className="text-sm font-medium text-muted-foreground">
																Meeting time
															</span>
															<span className="text-sm">
																{meeting.meeting_time || 'N/A'}
															</span>
														</div>
														<div className="flex justify-between">
															<span className="text-sm font-medium text-muted-foreground">
																Duration
															</span>
															<div className="flex items-center text-sm">
																<Clock className="h-4 w-4 mr-1 text-muted-foreground" />
																<span>{meeting.duration || 'N/A'}</span>
															</div>
														</div>
														<div className="flex justify-between">
															<span className="text-sm font-medium text-muted-foreground">
																Meeting ID
															</span>
															<span className="text-sm text-blue-500">
																{meeting.meeting_id}
															</span>
														</div>
														<div className="flex justify-between">
															<span className="text-sm font-medium text-muted-foreground">
																Link
															</span>
															{meeting.link ? (
																<a
																	href={meeting.link}
																	className="text-sm text-blue-500"
																	target="_blank"
																	rel="noopener noreferrer">
																	{meeting.link}
																</a>
															) : (
																'N/A'
															)}
														</div>
														<div className="flex justify-end">
															<Button
																variant="ghost"
																size="sm"
																className="text-red-500 h-8 px-2"
																aria-label="Delete meeting"
																onClick={() =>
																	handleDeleteMeeting(meeting.meeting_id)
																}>
																<Trash2 className="h-4 w-4" />
																<span className="ml-1">Delete</span>
															</Button>
														</div>
													</div>
												</Card>
											))}
										</div>
										<div className="hidden md:block overflow-x-auto">
											<table className="w-full">
												<thead>
													<tr className="border-b bg-slate-50">
														<th className="text-left p-4 font-medium text-sm text-muted-foreground">
															Date
														</th>
														<th className="text-left p-4 font-medium text-sm text-muted-foreground">
															Meeting time
														</th>
														<th className="text-left p-4 font-medium text-sm text-muted-foreground">
															Duration
														</th>
														<th className="text-left p-4 font-medium text-sm text-muted-foreground">
															Meeting ID
														</th>
														<th className="text-left p-4 font-medium text-sm text-muted-foreground">
															Link
														</th>
														<th className="text-left p-4 font-medium text-sm text-muted-foreground">
															Action
														</th>
													</tr>
												</thead>
												<tbody>
													{completedMeetings.map((meeting) => (
														<tr
															key={meeting.meeting_id}
															className="border-b hover:bg-slate-50">
															<td className="p-4 text-sm">
																{meeting.date
																	? new Date(meeting.date).toLocaleDateString()
																	: 'N/A'}
															</td>
															<td className="p-4 text-sm">
																{meeting.meeting_time || 'N/A'}
															</td>
															<td className="p-4 text-sm">
																<div className="flex items-center">
																	<Clock className="h-4 w-4 mr-1 text-muted-foreground" />
																	<span>{meeting.duration || 'N/A'}</span>
																</div>
															</td>
															<td className="p-4 text-sm text-blue-500">
																{meeting.meeting_id}
															</td>
															<td className="p-4 text-sm">
																{meeting.link ? (
																	<a
																		href={meeting.link}
																		className="text-blue-500"
																		target="_blank"
																		rel="noopener noreferrer">
																		{meeting.link}
																	</a>
																) : (
																	'N/A'
																)}
															</td>
															<td className="p-4 text-sm">
																<Button
																	variant="ghost"
																	size="sm"
																	className="text-red-500 h-8 px-2"
																	aria-label="Delete meeting"
																	onClick={() =>
																		handleDeleteMeeting(meeting.meeting_id)
																	}>
																	<Trash2 className="h-4 w-4" />
																	<span className="ml-1">Delete</span>
																</Button>
															</td>
														</tr>
													))}
												</tbody>
											</table>
										</div>
									</>
								)}
							</TabsContent>
						</Tabs>
					</div>
				</div>
			</div>
		</div>
	);
}
