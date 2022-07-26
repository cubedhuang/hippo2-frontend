import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../services/authentication";
import { useFlashMsg } from "../../services/flashMsg";
import baseUrl from '../../apiUrls';
import Button from "../../components/button/button";
import Loading from "../loading/loading";


function OrderCancel () {
	const [deadline, setDeadline] = useState();
	const [processing, setProcessing] = useState(false);
	const { autoAuthReq } = useAuth(); // import this
	const { flashMsg } = useFlashMsg(); // this too
	const navigate = useNavigate(); // this too
	const location = useLocation(); // this too
	const { orderID } = useParams(); // this too

	useEffect(() => {
		const url = baseUrl + `/api/v1/orders/${orderID}/can-refund/`;
		const options = { method: 'GET' };
		autoAuthReq(url, options, location.pathname).then(res => {
			if (res.data.can_refund !== true) {
				flashMsg('error', 'Refund deadline for course has passed');
				return navigate('/');
			}
			setDeadline(res.data.deadline);
		}).catch(err => {
			if (err.data?.message) {
				flashMsg('error', err.data.message);
			} else {
				flashMsg('error', 'Failed to retrieve order info');
			}
			navigate('/');
		});
	}, [autoAuthReq, flashMsg, location, navigate, orderID]);

	if (!deadline) {
		return <Loading />;
	}

	const onConfirm = () => {
		setProcessing(true);
		// import baseUrl
		const url = baseUrl + `/api/v1/orders/${orderID}/refund/`;
		const options = { method: 'POST' };
    
		autoAuthReq(url, options, location.pathname).then(res => {
			flashMsg('success', 'Order successfully refunded');
			navigate('/'); // navigate to dashboard once successful
		}).catch(err => {
			setProcessing(false);
			// handle errors
			if (err.data?.message) {
				return flashMsg('error', err.data.message);
			}
			flashMsg('error', 'Error refunding order');
		});
	};

	const onBack = () => {
		navigate('/dashboard');
	};
    

	return (
		<div className="container content-center flex flex-wrap mx-auto mt-12 auth max-w-xl">
			<div className="md:flex-initial w-full py-5 px-8 bg-white rounded-xl">
				<h2 className="text-2xl mb-3 text-center font-semibold">Are you sure you want to cancel your course?</h2>
				<div className="mb-2 mt-2">
					<p className="italic text-center text-red-600">Deadline to cancel: {deadline}</p>
				</div>

				<div className="mb-4 mt-5 ml-16 mr-16 text-center" >
					<p className="mb-3 text-sm font-light pr-4">At AI Camp, our students not only gain a deep understanding of AI under guidance from world-class instructors, but also a supportive, lifelong, rapidly expanding network of peers, mentors, and industry professionals to help further their journey in the technical industry at a low cost compared to other educational programs.</p>
				</div>

				<h4 className="text-xl mb-3 mt-10 text-center font-semibold">Refund Policy</h4>
					
				<div className="mb-4 mt-5 ml-16 mr-16 text-center" >
					<p className="mb-3 text-sm font-light pr-4">We hope to see you again. Please note that refunds are only available if you cancel your course before the deadline, and Stripe's processing fees from the transaction will not be refunded. Click <a className="text-blue-700 hover:text-blue-600 underline" target="_blank" rel="noopener noreferrer" href="https://support.stripe.com/questions/understanding-fees-for-refunded-payments">here</a> for more information on Stripe's refund fees.</p>
				</div>

				<div className="flex ml-12 mr-12 mt-10">
					<div className="w-1/3 p-4">
						<Button 
							bgColor="gray" txtColor="white" className="w-full py-1" 
							onClick={() => onBack()}
							disabled={processing}
						>Back</Button>
					</div>

					<div className="w-2/3 p-4">
						<Button 
							bgColor="white" txtColor="black" className="w-full py-1" 
							onClick={() => onConfirm()}
							disabled={processing}
						>Confirm Cancellation</Button>
					</div>
				</div>

			</div>	
		</div>
	);
}

export default OrderCancel;
