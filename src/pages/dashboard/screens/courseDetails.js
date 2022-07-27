import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../services/authentication";
import { useFlashMsg } from "../../../services/flashMsg";
import baseUrl from "../../../apiUrls";
import Button from "../../../components/button/button";
import Loading from "../../loading/loading";
import HideViewBar from "../../../components/HideViewBar/HideViewBar";
import './courseDetails.css';

function DashboardCourseDetails({ setIsStudentRegistered }) {
	const [courses, setCourses] = useState(null);
	const [courseTasks, setCourseTasks] = useState(null);
	const auth = useAuth();
	const { flashMsg } = useFlashMsg();

	useEffect(() => {
		(async () => {
			const data = await auth.autoAuthReq(
				baseUrl + `/api/v1/users/${auth.user.id}/orders/`, 
				{ method: 'GET' }
			);

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
			const transactionsTable = course.transactions.map((transaction) => (
				<div className='grid grid-cols-4 gap-4 text-center text-xs md:text-base pb-2'>
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

			coursesList.push((
				<div key={course.id} className="container flex flex-wrap mx-auto mt-12 px-6 pb-6">
					<div className="flex-none md:flex-initial w-full md:w-7/12 py-8 px-16 pb-10 text-lg text-black bg-white rounded-t-xl md:rounded-tl-xl md:rounded-none">
						<h1 className="font-semibold text-2xl mb-8 text-center">Course Information</h1>
						<p className="mb-5"><b className="font-semibold">Student Name: </b>{course.user.first_name} {course.user.last_name}</p>
						<p><b className="font-semibold">Course: </b>{course.course.name}</p>
						<p><b className="font-semibold">{course.batch.name}: </b>{course.batch.start_date} - {course.batch.end_date}, {course.batch.start_time} - {course.batch.end_time} {course.batch.time_zone}</p>
						<p className="mb-5"><a href={`/orders/${course.id}/change-batch`} className="text-blue-500 underline">Want to change your batch?</a><span className="italic text-red-400"> (Deadline: {course.course.batch_change_deadline})</span></p>
						<Link to={`/orders/${course.id}/refund`} className='mb-4'>
							<Button bgColor="white" txtColor="black" className="w-2/3 py-1">Cancel Your Course</Button>
						</Link>
					</div>
					<div className="flex-none md:flex-initial w-full md:w-5/12 py-8 px-16 pb-10 materials-gray md:rounded-tr-xl md:rounded-none">
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
					<HideViewBar info={transactionsTable} buttonName={'Financial Transactions'} />
				</div>
			));
		}
	}

	if (coursesList !== null) {
		// if there are no active/paid courses
		if (coursesList.length === 0) {
			return (
				<div className="mx-6 mt-12 p-5 text-center bg-white rounded-2xl">
					<h1 className="font-semibold text-2xl mb-6">Start your {auth.user.type === 'parent' ? 'child\'s AI' : ''} journey with an AI Camp course!</h1>
					<p className="mb-8">{auth.user.type === 'parent' ?
						'Your child is not registered for any courses. Register for a course to reserve a spot now! Spots are filling up quick!' :
						'You are not registered for any courses. Register for a course to reserve your spot now! Spots are filling up quick!'}</p>
					<Link to="/courses" className="w-full md:px-6 lg:px-24 block max-w-4xl mx-auto">
						<Button className="w-full mb-5 py-2" bgColor="red" txtColor="white">Register for Courses</Button>
					</Link>
				</div>
			);
		}

		return (
			<>
				{coursesList}
			</>
		);
	}
	return <Loading />;
}

export default DashboardCourseDetails;
