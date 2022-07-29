import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from "react";
import { useFlashMsg } from '../../services/flashMsg';
import { useAuth } from '../../services/authentication';
import baseUrl from "../../apiUrls";
import Button from "../../components/button/button";
import Loading from '../loading/loading';
import Page from '../../components/page/page';

function SelectionPage() {
	const [batchData, setBatchData] = useState({});
	const [studentData, setStudentData] = useState([]);
	const [loading, setLoading] = useState(true);
	const { batchID } = useParams();
	const navigate = useNavigate();
	const { flashMsg } = useFlashMsg();
	const { autoAuthReq } = useAuth();
	const here = useLocation().pathname;

	useEffect(() => {
		if (!batchID) {
			return flashMsg('error', 'Invalid Batch');
		}
		const batchUrl = baseUrl + `/api/v1/batches/${batchID}/`;
		const studentsUrl = baseUrl + `/api/v1/users/groupstudents/`;
		const pendingInvitesUrl = baseUrl + `/api/v1/users/pendinginvites/`;
		const options = {
			method: 'GET',
		};
		(async () => {
			const batchRes = await autoAuthReq(batchUrl, options, here);
			setBatchData(batchRes.data);

			const studRes = await autoAuthReq(studentsUrl, options, here);
			setStudentData(studRes.data);

			const inviteRes = await autoAuthReq(pendingInvitesUrl, options, here);
			const invited = inviteRes.data.map(invite => invite.invite_to);
			setStudentData(prev => [...prev, ...invited]);

			setLoading(false);
		})().catch(err => {
			flashMsg('error', 'Error fetching batch and student info');
			navigate('/courses');
		});
	}, [batchID, flashMsg, navigate, autoAuthReq, here]);

	if (loading) {
		return <Loading />;
	}
    
	function SideBar() { 
		return (
			<>
				<h1 className="header text-3xl mb-10 text-center">
					Select a Student
				</h1>
				<h1 className="text-1xl mx-4 my-3">You have chosen Batch {batchData.name} ({batchData.start_date} - {batchData.end_date}) {batchData.time_zone} in {batchData.course.name}.</h1>
				<h1 className="text-1xl mx-4 my-3">Select the student for whom you would like to reserve this spot for.</h1>
				<h1 className="text-1xl mx-4 mb-6">You may register for additional students afterwards.</h1>
			</>
		);
	}

	const selection = [];
	const ids = [];
	for (let i = 0; i < studentData.length; i++) {
		const student = studentData[i];
		if (!ids.includes(student.id)) {
			ids.push(student.id);
			selection.push(
				<Button 
					key={i} 
					onClick={() => navigate(`/batches/${batchID}/payment?for=${student.id}`)} bgColor='white'
					txtColor='black' 
					className="mt-3 py-4 w-full"
				>
					<p className="text-lg">{student.first_name + ' ' + student.last_name}</p>
				</Button>
			);
		}
	}

	const onBack = () => {
		navigate(`/courses/${batchData.course.id}/batches`);
	};

	return (
		<Page
			leftChildren={
				<SideBar/>
			} 
			rightChildren={
				<>
					<div>
						<div className="my-2 text-center w-full">
							<h2 className="header text-2xl mt-3">Reserve spot in {batchData.course.name} for</h2>
						</div>
						<div className="my-10">
							{selection}
						</div>                 
					</div>
					<div className="my-5">
						<Button 
							onClick={() => onBack()} 
							bgColor="gray" 
							txtColor="white" 
							className="w-full lg:w-1/4 h-12 mb-2 lg:my-3"
						>
							<p className="text-lg">Back</p>
						</Button>
					</div>
				</>
			} 
			leftRightRatio={'1:2'}
			maxWidth={'3xl'} 
			developers={['Leo Du (17)']}
		>
		</Page>
	);
}

export default SelectionPage;
