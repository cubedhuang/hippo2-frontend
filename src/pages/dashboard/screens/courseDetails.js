import {useEffect, useRef, useState} from "react";
import {useAuth} from "../../../services/authentication";
import {useFlashMsg} from "../../../services/flashMsg";
import baseUrl from "../../../apiUrls";
import Button from "../../../components/button/button";
import Loading from "../../loading/loading";
import './Home.css';
import {Link} from "react-router-dom";

function DashboardCourseDetails() {
	const [courses, setCourses] = useState(null);
	const [courseTasks, setCourseTasks] = useState(null);
	const auth = useAuth();
	const { flashMsg } = useFlashMsg();
	const flashMsgRef = useRef(flashMsg).current;
	const [blockHidden, setBlockHidden] = useState(false);
 
	function hideView() {
		setBlockHidden(e => !e);
	}

	useEffect(() => {
		auth.autoAuthReq(baseUrl + `/api/v1/users/${auth.user.id}/orders/`,{method: 'GET'})
			.then(data => {
				// fetch incomplete tasks from API
				(async () => {
					const courseTaskDict = {};

					for (let course of data.data) {
						courseTaskDict[course.id] = (await auth.autoAuthReq(baseUrl + `/api/v1/orders/${course.id}/tasks/?countonly=true`, {method: 'GET'})).data.count > 0;
					}

					setCourseTasks(courseTaskDict);
				})().catch(err => {
					flashMsgRef('error', 'Unable to retrieve course info')
				});

				setCourses(data.data);
			}).catch((err) => {
			// API request was not successful
			// TODO: handle API error
			flashMsgRef('error', 'Something went wrong');
		});
	}, [auth, flashMsgRef]);

	let coursesList = null;

	if (courseTasks !== null) {
		coursesList = [];
		for (let course of courses) {
			// TODO: remove dummy deadline - API does not return a deadline yet
			const transactionsTable = course.transactions.map((transaction) => {
				return <div className='grid grid-cols-4 gap-4 text-center text-xs md:text-base pb-2'>
					<div>{transaction.created_at.substring(0,10)}</div>
					<div>${course.course.price}</div>
					<div>{transaction.name}</div>
					<div>
						<span className=
							{{unpaid: 'text-red-400', paid: 'text-green-500', cancelled: 'text-yellow-400', refunded: 'text-gray-500'}[transaction.status]}>
							{{unpaid: 'Not Paid', paid: 'Paid', cancelled: 'Cancelled', refunded: 'Refunded'}[transaction.status]}
						</span>
					</div>
				</div>
			});

			coursesList.push((
				<div key={course.id} className="container flex flex-wrap mx-auto mt-10 px-5 mb-10">
					<div className="flex-none md:flex-initial w-full md:w-7/12 py-8 px-16 pb-10 text-lg text-black bg-white rounded-t-xl md:rounded-tl-xl md:rounded-none">
						<h1 className="font-semibold text-2xl mb-8 text-center">Course Information</h1>
						<p className="mb-5"><b className="font-semibold">Student Name: </b>{course.user.first_name} {course.user.last_name}</p>
						<p><b className="font-semibold">Course: </b>{course.course.name}</p>
						<a href="/" className="text-blue-500 underline mb-5">Want to cancel your course?</a>
						<p><b className="font-semibold">{course.product.name}: </b>{course.product.start_date} - {course.product.end_date}, {course.product.start_time} - {course.product.end_time} {course.product.time_zone}</p>
						<p className="mb-5"><a href="/" className="text-blue-500 underline">Want to change your batch?</a><span className="italic text-red-400"> (Deadline: 6/1)</span></p>

						<Button bgColor="white" txtColor="black" className="w-2/3 py-1 mb-4">Cancel Your Course</Button>
					</div>
					<div className="flex-none md:flex-initial w-full md:w-5/12 py-8 px-16 pb-10 bg-stone-300  md:rounded-tr-xl md:rounded-none">
						<h1 className="font-semibold text-2xl mb-10 text-center">Course Materials</h1>
						{courseTasks[course.id] ? <Button bgColor="white" txtColor="black" className="w-full py-3 mb-4">Student To Do List</Button> :
						<>
							<Button bgColor="white" txtColor="black" className="w-full py-2 mb-4">Zoom Link</Button>
							<Button bgColor="white" txtColor="black" className="w-full py-2 mb-4">Discord Server</Button>
							<Button bgColor="white" txtColor="black" className="w-full py-2 mb-4">Class Schedule</Button>
							<Button bgColor="white" txtColor="black" className="w-full py-2">Slideshow Presentations</Button>
						</>}
					</div>

					<div className="flex-none md:flex-initial w-full py-5 px-8 bg-zinc-400/75 rounded-b-xl rounded-none">
						<div className="flex items-center justify-center h-0">
							<Button className="text-2xl flex font-semibold items-center justify-center px-20" onClick={() => hideView()}>
								{blockHidden ?
									<>
										<p id='hideViewText' className='text-base md:text-xl'>Hide Financial Transactions</p>
										<div className='arrow upArrow relative left-3 top-1' id='upArrow' />
									</> :
									<>
										<p id='hideViewText' className='text-base md:text-xl'>View Financial Transactions</p>
										<div className='arrow downArrow relative left-3 bottom-1' id='downArrow' />
									</>
								}
							</Button>
						</div>

						{blockHidden ?
							<div id='hideView' className='pt-7'>
								<div className='grid grid-cols-4 gap-4 text-center font-bold text-xs md:text-base pb-2'>
									<div className=''>Date</div>
									<div className=''>Amount</div>
									<div className=''>Paid By</div>
									<div className=''>Status</div>
								</div>
								{transactionsTable}
							</div> : null}
					</div>
				</div>
			));
		}
	}

	if (coursesList !== null) {
		// if there are no active/paid courses
		if (coursesList.length === 0) {
			return (
				<div className="container p-4 mt-10 mx-auto text-center bg-white rounded-2xl">
					<h1 className="font-semibold text-2xl mb-6">Start your {auth.user.type === 'parent' ? 'child\'s AI' : ''} journey with an AI Camp course!</h1>
					<p className="mb-8">{auth.user.type === 'parent' ?
						'Your child is not registered for any courses. Register for a course to reserve a spot now! Spots are filling up quick!' :
						'You are not registered for any courses. Register for a course to reserve your spot now! Spots are filling up quick!'}</p>
					<Link to="/courses" className="w-full px-24 block">
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
