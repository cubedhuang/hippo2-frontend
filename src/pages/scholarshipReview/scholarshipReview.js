import Button from "../../components/button/button";
import { useState, useEffect } from "react";
import { useFlashMsg } from "../../services/flashMsg";
import sendReq from "../../services/sendReq";
import baseUrl from "../../apiUrls";

function ScholarshipReview() {
	const [scholarshipIndex, setScholarshipIndex] = useState(0);
	const [scholarshipList, setScholarshipList] = useState([]);
	const [courseList, setCourseList] = useState([]);
	const [courseID, setCourseID] = useState('');
	const { flashMsg } = useFlashMsg();
	const index = 0;

	const listCourses = courseList.map((course) =>
		<option value={course.id} key={course.name.toString()} >{course.name}</option>
	);

	useEffect(() => {
		const url = baseUrl + `/__api/v1/courses/`;
		const options = {
			method: 'GET'
		};
		sendReq(url, options).then(res => {
			setCourseList(res.data);
		}).catch(err => {
			flashMsg('error', 'Failed to get course list');
		});
	}, [index, flashMsg]);

	const handleChange = (courseID) => {
		setCourseID(courseID.target.value);
		const url = baseUrl + `/__api/v1/scholarships/`;
		const options = {
			method: 'GET',
			body: {
				course_id: courseID.target.value
			}
		};
		sendReq(url, options).then(res => {
			setScholarshipList(res.data);
		}).catch(err => {
			flashMsg('error', 'Failed to get scholarship list');
		});
	};

	const onNext = () => {
		setScholarshipIndex(scholarshipIndex + 1);
	};
	
	const onBack = () => {
		setScholarshipIndex(scholarshipIndex - 1);
	};

	const onReject = () => {
		onSubmit('REJECTED');
	};

	const onPartial = () => {
		onSubmit('ACCEPTED_PARTIAL');
	};

	const onFull = () => {
		onSubmit('ACCEPTED_FULL');
	};

	function onSubmit(decision) {
		const urlPost = baseUrl + `/__api/v1/scholarships/`;
		const optionsPost = {
			method: 'POST',
			body: {
				scholarship_id: scholarshipList[scholarshipIndex].id,
				scholarship_status: decision
			}
		};
		sendReq(urlPost, optionsPost).then(res => {
			setScholarshipList(res.data);
		}).catch(err => {
			flashMsg('error', 'Failed to get update scholarship status');
		});
		const urlGet = baseUrl + `/__api/v1/scholarships/`;
		const optionsGet = {
			method: 'GET',
			body: {
				course_id: courseID
			}
		};
		sendReq(urlGet, optionsGet).then(res => {
			setScholarshipList(res.data);
		}).catch(err => {
			flashMsg('error', 'Failed to get scholarship list');
		});
	}

	const responseHTML = !(courseID === '' || scholarshipList.length === 0) ? Object.keys(scholarshipList[scholarshipIndex].response).map((key) =>
		<div key={key}>
			<p className='mt-9'>{key}</p>
			<p className='mt-5 mb-10'>{scholarshipList[scholarshipIndex].response[key]}</p>
		</div>
	) : <></>;

	let noScholarships;
	if (courseID === '') {
		noScholarships = <></>;
	} else if (scholarshipList.length === 0) {
		noScholarships = <p className='mt-9 text-2xl'>No undecided scholarships found for this course</p>;
	}
	
	return (
		<div>
			<div className="w-full py-6 pl-10 flex flex-row border border-solid border-b-gray-400">
				<div className='my-1'>
					<label for="cars" className='pr-1 mt-1'>Organize by: </label>

					<select data-dropdown-placement="right" value={courseID} onChange={handleChange}
						className="w-44 h-9 form-select form-select-lg
						course-select
						px-5
						text-left
						font-normal
						text-gray-700
						border border-solid border-black
						rounded-full
						transition
						ease-in-out
						focus:text-gray-700
						focus:border-blue-600
						focus:outline-none"
						aria-label=".form-select-lg example"
					>
						<option value ="" disabled >Course Name</option>
						{listCourses}
					</select>
				</div>
			</div>
			{(courseID === '' || scholarshipList.length === 0) ?
				<span className='flex flex-row justify-center'>
					{noScholarships}
				</span> :
				<div className="w-full flex flex-col mt-9">
					<div className="w-full flex flex-row justify-center">
						<h1 className='text-2xl'>{scholarshipList[scholarshipIndex].name} Scholarship Application</h1>
					</div>
					<div className='text-xl ml-24 mr-14'>
						{responseHTML}
						<div className="flex flex-row absolute bottom-14">
							<Button bgColor='gray' txtColor='white' className='w-60 h-12 mr-6' onClick={onBack} disabled={(scholarshipIndex === 0) ? true : false}>
								Back (A)
							</Button>
							<Button bgColor='white' txtColor='black' className='w-52 h-12 mr-6' onClick={onReject}>
								Reject (W)
							</Button>
							<Button bgColor='white' txtColor='black' className='w-52 h-12 mr-6' onClick={onPartial}>
								Partial (S)
							</Button>
							<Button bgColor='white' txtColor='black' className='w-52 h-12 mr-6' onClick={onFull}>
								Full (E)
							</Button>
							<Button bgColor='white' txtColor='black' className='w-80 h-12 mr-6'>
								View W-2 Form (Q)
							</Button>
							<Button bgColor='gray' txtColor='white' className='w-60 h-12' onClick={onNext} disabled={(scholarshipIndex === scholarshipList.length - 1) ? true : false}>
								Next (D)
							</Button>
						</div>
					</div>
				</div>
			}
		</div>
	);
}

export default ScholarshipReview;
