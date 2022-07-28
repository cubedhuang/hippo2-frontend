import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../services/authentication";
import { useFlashMsg } from "../../../services/flashMsg";
import baseUrl from "../../../apiUrls";
import Button from "../../../components/button/button";
import Loading from "../../loading/loading";
import HideViewBar from "../../../components/HideViewBar/HideViewBar";

function DashboardCourseDetails({ setIsStudentRegistered }) {
	const [courses, setCourses] = useState(null);
	const [scholarships, setScholarships] = useState(null);
	const [courseTasks, setCourseTasks] = useState(null);
	const auth = useAuth();
	const { flashMsg } = useFlashMsg();

	useEffect(() => {
		(async () => {
			const data = await auth.autoAuthReq(
				baseUrl + `/api/v1/users/${auth.user.id}/orders/`, 
				{ method: 'GET' }
			);
			const scholarshipData = data.data.filter((order) => order.status === 'UNPAID' && order.scholarship.name !== null);
			setScholarships(scholarshipData);

			// check if user is student and user has paid course
			for (const course of data.data) {
				if (auth.user.type === 'STUDENT' && course.transactions.filter(e => e.status.toUpperCase() === 'PAID').length > 0) {
					setIsStudentRegistered(true);
					break;
				}
			}

			// fetch incomplete tasks from API
			const courseTaskDict = {};
			for (let course of data.data) {
				if (scholarshipData.filter(order => order.id === course.id).length > 0) continue; // remove duplicates
				courseTaskDict[course.id] = (await auth.autoAuthReq(baseUrl + `/api/v1/orders/${course.id}/tasks/?countonly=true`, { method: 'GET' })).data.count > 0;
			}

			setCourseTasks(courseTaskDict);
			setCourses(data.data);
		})().catch(err => {
			flashMsg('error', 'Failed to get course info');
		});
	}, [auth, flashMsg, setIsStudentRegistered]);

	let coursesList = null;

	if (courseTasks !== null) {
		coursesList = [];
		for (let course of courses) {
			// TODO: remove dummy deadline - API does not return a deadline yet
			const transactionsTable = course.transactions.map((transaction, index) => (
				<div className='grid grid-cols-4 gap-4 text-center text-xs md:text-base pb-2' key={index}>
					<div>{transaction.created_at.substring(0, 10)}</div>
					<div>${course.course.price}</div>
					<div>{transaction.name}</div>
					<div>
						<span className=
							{{ UNPAID: 'text-red-400', PAID: 'text-green-500', CANCELLED: 'text-yellow-400', REFUNDED: 'text-gray-500' }[transaction.status.toUpperCase()]}>
							{{ UNPAID: 'Not Paid', PAID: 'Paid', CANCELLED: 'Cancelled', REFUNDED: 'Refunded' }[transaction.status.toUpperCase()]}
						</span>
					</div>
				</div>
			));

			const scholarship = course.scholarship.status !== null && course.scholarship.status.startsWith('ACCEPTED_') ? (
				<p className="mb-5"><b className="font-semibold">Scholarship Status: </b><span className="text-green-500">{course.scholarship.name}</span></p>
			) : null;
			const isFullScholarship = course.scholarship.status === 'ACCEPTED_FULL';

			coursesList.push((
				<div key={course.id} className="container flex flex-wrap mx-auto mt-12 px-6 pb-6">
					<div className={`flex-none md:flex-initial w-full md:w-7/12 py-8 px-16 pb-10 text-lg text-black bg-white rounded-t-xl ${isFullScholarship ? 'rounded-t-xl md:rounded-l-xl md:rounded-none' : 'md:rounded-tl-xl md:rounded-none'}`}>
						<h1 className="font-semibold text-2xl mb-8 text-center">Course Information</h1>
						<p className="mb-5"><b className="font-semibold">Student Name: </b>{course.user.first_name} {course.user.last_name}</p>
						<p><b className="font-semibold">Course: </b>{course.course.name}</p>
						<p><b className="font-semibold">{course.batch.name}: </b>{course.batch.start_date} - {course.batch.end_date}, {course.batch.start_time} - {course.batch.end_time} {course.batch.time_zone}</p>
						<p className="mb-5"><a href={`/orders/${course.id}/change-batch`} className="text-blue-500 underline">Want to change your batch?</a><span className="italic text-red-400"> (Deadline: {course.course.batch_change_deadline})</span></p>
						{scholarship}
						<Link to={`/orders/${course.id}/refund`} className='mb-4'>
							<Button bgColor="white" txtColor="black" className="w-2/3 py-1">Cancel Your Course</Button>
						</Link>
					</div>
					<div className={`flex-none md:flex-initial w-full md:w-5/12 py-8 px-16 pb-10 bg-stone-300 ${isFullScholarship ? 'rounded-b-xl md:rounded-tr-xl md:rounded-bl-none' : 'md:rounded-tr-xl md:rounded-none'}`}>
						<h1 className="font-semibold text-2xl mb-10 text-center">Course Materials</h1>
						{courseTasks[course.id] ? 
							<Link to = 'todo'>
								<Button bgColor="white" txtColor="black" className="w-full py-3 mb-4">Student To Do List</Button>
							</Link> :
							<>
								<Button bgColor="white" txtColor="black" className="w-full py-2 mb-4">Zoom Link</Button>
								<Button bgColor="white" txtColor="black" className="w-full py-2 mb-4">Discord Server</Button>
								<Button bgColor="white" txtColor="black" className="w-full py-2 mb-4">Class Schedule</Button>
								<Button bgColor="white" txtColor="black" className="w-full py-2">Slideshow Presentations</Button>
							</>}
					</div>
					{!isFullScholarship ? <HideViewBar info={transactionsTable} buttonName={'Financial Transactions'} /> : null}
				</div>
			));
		}
	}

	const registerForCoursesDiv = (
		<div className="mx-6 mt-12 p-5 text-center bg-white rounded-2xl">
			<h1 className="font-semibold text-2xl mb-6">Start
				your {auth.user.type === 'PARENT' ? 'child\'s AI' : ''} journey with an AI Camp course!</h1>
			<p className="mb-8">{auth.user.type === 'PARENT' ?
				'Your child is not registered for any courses or incubators. Register to reserve a spot now! Spots are filling up quick!' :
				'You are not registered for any courses or incubators. Register to reserve your spot now! Spots are filling up quick!'}</p>
			<Link to="/courses" className="w-full md:px-6 lg:px-24 block max-w-4xl mx-auto">
				<Button className="w-full mb-5 py-2" bgColor="red" txtColor="white">Register for
					Programs</Button>
			</Link>
		</div>
	);

	if (coursesList !== null) {
		if (coursesList.length === 0) {
			if (scholarships.length === 0) {
				// haven't booked and haven't applied for scholarship
				return (
					registerForCoursesDiv
				);
			} else if (scholarships.length > 0) {
				const scholarshipList = [];
				let hasAcceptedScholarship = false;
				let registerForCourses = false;

				for (const scholarshipOrder of scholarships) {
					if (scholarshipOrder.scholarship.status.startsWith('ACCEPTED_')) {
						// booked, scholarship accepted
						hasAcceptedScholarship = true;
						if (registerForCourses) registerForCourses = false;

						const scholarshipText = scholarshipOrder.scholarship.name;

						scholarshipList.push((
							<div className="container flex flex-wrap mx-auto mb-10 px-6 pb-6" key={scholarshipOrder.id}>
								<div className="flex-none md:flex-initial w-full md:w-7/12 py-8 px-16 pb-10 text-lg text-black bg-white rounded-t-xl md:rounded-l-xl md:rounded-none">
									<h1 className="font-semibold text-2xl mb-8 text-center">Course Information</h1>
									<p className="mb-5"><b className="font-semibold">Student Name: </b>{scholarshipOrder.user.first_name} {scholarshipOrder.user.last_name}</p>
									<p className="mb-5"><b className="font-semibold">Course: </b>{scholarshipOrder.course.name}</p>
									<p className="mb-1"><b className="font-semibold">Scholarship Status: </b><span className="text-green-500">{scholarshipText}</span></p>
									<p className="text-sm">Your spot is not reserved until payment is received. Register now to save your spot!</p>
								</div>
								<div className="flex-none md:flex-initial w-full md:w-5/12 py-8 px-16 pb-10 bg-stone-300 md:rounded-r-xl md:rounded-none">
									<h1 className="font-semibold text-2xl mb-10 text-center">Scholarship Materials</h1>
									<Button bgColor="white" txtColor="black" className="w-full py-2 mb-4 text-center">Claim Scholarship<br /><span className="text-sm italic">Deadline: 6/1</span></Button>
								</div>
							</div>
						));
					} else {
						// haven't booked, applied for scholarship
						// TODO: remove placeholder scholarship decision date (6/1/2022)

						if (!hasAcceptedScholarship) registerForCourses = true;
						scholarshipList.push((
							<div className="container flex flex-wrap mx-auto mb-10 px-6 pb-6 mb-8">
								<div className="flex-none w-full py-8 px-16 pb-10 text-lg text-black bg-white rounded-xl">
									<h1 className="font-semibold text-2xl mb-8 text-center">Course Information</h1>
									<p className="mb-5"><b className="font-semibold">Student Name: </b>{scholarshipOrder.user.first_name} {scholarshipOrder.user.last_name}</p>
									<p className="mb-5"><b className="font-semibold">Course: </b>{scholarshipOrder.course.name}</p>
									<p className="mb-1"><b className="font-semibold">Scholarship Status: </b><span className="text-yellow-400">Application Submitted, In Review</span></p>
									<p className="text-sm">Your spot is not reserved until payment is received. Register now to save your spot!<br />Scholarship decisions will be released by 6/1/2022.</p>
								</div>
							</div>
						));
					}
				}

				return (
					<>
						{hasAcceptedScholarship ? <div className="bg-red-500 w-full text-white text-center py-6">
							<div>
								<p className="text-2xl">{auth.user.type === 'PARENT' ?
									`Congratulations! Claim Your Child's Scholarship to Reserve a Spot Now!` :
									`Congratulations! Claim Your Scholarship to Reserve Your Spot Now!`}</p>
							</div>
						</div> : null}

						<div className="mt-10">
							{scholarshipList}
						</div>

						{coursesList}

						{registerForCourses ? <div className="container flex flex-wrap mx-auto mt-12 px-6 pb-6 mb-8">
							<div className="flex-none w-full mt-12 p-5 text-center bg-white rounded-2xl">
								<h1 className="font-semibold text-2xl mb-6">Start
									your {auth.user.type === 'PARENT' ? 'child\'s AI' : ''} journey with an AI Camp course!</h1>
								<p className="mb-8">{auth.user.type === 'PARENT' ?
									'Your child is not registered for any courses or incubators. Register to reserve a spot now! Spots are filling up quick!' :
									'You are not registered for any courses or incubators. Register to reserve your spot now! Spots are filling up quick!'}</p>
								<Link to="/courses" className="w-full md:px-6 lg:px-24 block max-w-4xl mx-auto">
									<Button className="w-full mb-5 py-2" bgColor="red" txtColor="white">Register for
										Programs</Button>
								</Link>
							</div>
						</div> : null}
					</>
				);
			}
		} else {
			// registered for courses
			return (
				<>
					{coursesList}
				</>
			);
		}
	}
	return <Loading />;
}

export default DashboardCourseDetails;
