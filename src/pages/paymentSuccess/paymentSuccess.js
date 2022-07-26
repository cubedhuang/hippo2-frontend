import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import validateUuid from "../../validation/uuid";
import sendReq from "../../services/sendReq";
import baseUrl from "../../apiUrls";
import Button from "../../components/button/button";
import Page from "../../components/page/page";

function PaymentSuccess() {
	const [data, setData] = useState(null);
	const [errorText, setErrorText] = useState('');
	const { orderID } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		const [err, id] = validateUuid(orderID);
		if (err) {
			return setErrorText('Invalid order ID');
		}
		const url = baseUrl + `/api/v1/orders/${id}/status/`;
		const options = { method: 'GET' };
		sendReq(url, options).then(res => {
			setData(res.data);
		}).catch(err => {
			setErrorText('Could not get order information');
		});
	}, [orderID]);

	const studentDashboard = () => {
		navigate('/');
	};

	if (!data) {
		return (
			<div className="container max-w-5xl mx-auto mt-10 bg-white px-5 py-10 rounded-xl">
				<h1 className="text-xl text-center">
					{errorText.length ? errorText : 'Processing...'}
				</h1>
			</div>
		);
	}

	return (
		<Page
			leftChildren={
				<>
					<h1 className="text-2xl mb-8 text-center">Congratulations!</h1>
					<p className="text-base mb-4">You are now officially enrolled in {data.course} in Batch {data.batch}.</p>
					<p className="text-base mb-4">Order ID: {data.id}</p>
					<p className="text-lg">Click "Proceed to Student Dashboard" to view your payment status and prepare for your upcoming AI Camp course!</p>
				</>
			} 
			rightChildren={
				<>
					<h2 className="text-xl mb-16 text-center">Thank you for registering at AI Camp!</h2>

					<Button 
						bgColor="green" txtColor="white" className="col-span-3 my-2 mb-8 py-3 w-full"
						onClick={() => studentDashboard()}
					>
						Proceed to Dashboard
					</Button>
				</>
			} 
			leftRightRatio={'1:1'}
			maxWidth={'5xl'} 
			developers={['Nathen Xayena (19)', 'Leo Du(17)', 'Zac (18)', 'Matthew (14)']}
		>
		</Page>
	);
}

export default PaymentSuccess;
