import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFlashMsg } from "../../services/flashMsg";
import { useAuth } from "../../services/authentication";
import sendReq from "../../services/sendReq";
import validateUuid from "../../validation/uuid";
import baseUrl from "../../apiUrls";
import BatchBoard from "../../components/batchBoard/batchBoard";
import Button from "../../components/button/button";
import Loading from "../loading/loading";
import Page from "../../components/page/page";
import './batchSelect.css';

function BatchSelect() {
	const [batch, setBatch] = useState({});
	const [data, setData] = useState({});
	const { courseID } = useParams();
	const { flashMsg } = useFlashMsg();
	const { user } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!courseID) {
			return flashMsg('error', 'Invalid course');
		}

		const url = baseUrl + `/api/v1/courses/${courseID}/batches/`;
		const options = { method: 'GET' };

		sendReq(url, options).then(res => {
			setData(res.data);
		}).catch(err => {
			flashMsg('error', 'Failed to get batch info');
		});
	}, [flashMsg, courseID]);

	if (!data.batches) {
		return <Loading />;
	}

	const onSubmit = () => {
		const id = batch.id;
		const [err] = validateUuid(id);
		if (err) {
			flashMsg('error', 'Please select an available batch');
		} else if (user.type === "PARENT") {
			const path = `/batches/${id}/student-selection`;
			navigate(path); 
		} else {
			const path = `/batches/${id}/payment`;
			navigate(path); 
		}
	};

	function SideText() {
		if (batch.id) {
			return (
				<>
					<div className="text-center text-3xl mb-10">
						<h1>Batch {batch.name}</h1>
						<h4>{batch.start_date} - {batch.end_date}</h4>
						<h4>({batch.time_zone})</h4>
					</div>
					<ul className="text-base">
						<li className="mb-2">
							Program Dates: {batch.start_date} - {batch.end_date}
						</li>
						<li className="mb-2">
							Duration: {batch.duration}
						</li>
						<li className="mb-10">
							Time: {batch.start_time} - {batch.end_time} {batch.time_zone} every weekday
						</li>
					</ul>
					<p className="text-lg">
						Click “Next” to hold your spot while you create your AI Camp account!
					</p>
				</>
			);
		} else {
			return (
				<>
					<h1 className="text-center text-3xl mb-8">Batch<br/>Details </h1>
					<p className="text-base mb-4">
						Select the batch that you want to register for. Details about your selected batch will appear here!
					</p>
					<p className="text-base">
						Some batch choices will be limited due to our capacity.
					</p>
				</>
			);
		}
	}

	return (
		<Page
			leftChildren={
				<SideText/>
			} 
			rightChildren={
				<>
					<h1 className="text-center text-xl font-bold">{data.name}</h1>
					<p className="text-center text-xl mb-8">Select a batch that fits your schedule</p>
					<BatchBoard 
						className="w-full"
						batchID={batch.id} 
						batchData={data.batches}
						price={data.price}
						onChange={(b) => setBatch(b)}
					/>
					<div className="flex flex-row flex-nowrap mt-8">
						<Button 
							bgColor="gray"
							txtColor="white" 
							className="w-full py-1 mr-6" 
							onClick={() => navigate('/courses')}
						>
							Back
						</Button>
						<Button 
							bgColor="green" 
							txtColor="white" 
							className="w-full py-1" 
							onClick={() => onSubmit()}
						>
							Next
						</Button>
					</div>
				</>
			} 
			leftRightRatio={'1:2'}
			maxWidth={'5xl'} 
			developers={['Zac (18)', 'Leo Du (17)']}
		>
		</Page>
	);
}

export default BatchSelect;
