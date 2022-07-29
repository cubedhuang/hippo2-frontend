import { useState } from "react";
import { useNavigate } from "react-router-dom";
import baseUrl from "../../apiUrls";
import sendReq from "../../services/sendReq";
import Input from "../../components/form/input";
import Button from "../../components/button/button";
import validateEmail from '../../validation/email';
import { useFlashMsg } from "../../services/flashMsg";
import Page from "../../components/page/page";

function ForgotPassword() {
	const [email, setEmail] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [successMessage, setSuccessMessage] = useState('');
	const { flashMsg } = useFlashMsg();
	const navigate = useNavigate();

	const sendResetEmail = () => {
		setErrorMessage('');
		setSuccessMessage('');
		const [err, data] = validateEmail({ email: email });
		const url = baseUrl + '/auth/password/reset/';
		if (err) {
			// validate email input
			flashMsg('error', 'Invalid Email Input');
			setErrorMessage('Invalid Email Input');
		} else {
			const options = {
				method: 'POST',
				body: { email: data.email }
			};
			setErrorMessage('');
			sendReq(url, options).then(res => {
				// Email successfully sent
				flashMsg('success', 'Reset Password Email Sent!');
				setSuccessMessage('Email Sent! Please check your inbox for the reset link!');
			}).catch(err => {
				// error handling
				if (err.data?.message) {
					return flashMsg('error', err.data.message);
				}
				flashMsg('error', 'Failed to connect to server');	
			});
		}	
	};

	const onBack = () => {
		// back button
		navigate('/login');
	};

	return (
		<Page
			leftChildren={
				<>
					<h1 className="header text-2xl mb-8 text-center">Password Reset</h1>
					<p className="text-base mb-6">Enter your email to get a password reset link.</p>
						
					<p className="text-base">By logging into AI Camp, you agree to our&nbsp;
						<a className="text-blue-700 hover:text-blue-600 underline decoration-inherit" href="https://www.ai-camp.org/terms-of-service">Terms of Service</a> and&nbsp; 
						<a className="text-blue-700 hover:text-blue-600 underline decoration-inherit" href="https://www.ai-camp.org/privacy-notice">Privacy Policy</a>.
					</p>
				</>
			} 
			rightChildren={
				<>
					<h2 className="header text-2xl mb-8 text-center font-semibold">Reset your password to continue your AI adventure with AI Camp.</h2>
					<form action="" method="post" onSubmit={e => e.preventDefault()}>
						<Input label="Email"
							placeHolder="example@gmail.com"
							type = 'email'
							name = 'email'
							className="mb-3"
							id="email"
							onChange={val => setEmail(val)} 
						/>
						<div className='pb-3'>
							{errorMessage && (<p className="error bg-red-100 border-l-4 border-red-500 text-red-700 p-4"> {errorMessage} </p>)}
							{successMessage && (<p className="error bg-green-100 border-l-4 border-green-500 text-green-900 p-4"> {successMessage} </p>)}
						</div>

						<div>
							<div className='py-2'>
								<Button bgColor="green" txtColor="white" type="button" className="w-full py-1" onClick={() => sendResetEmail()}>Reset Password</Button>
							</div>
							<div className='py-2'>
								<Button bgColor="gray" txtColor="white" className="w-full py-1 mb-3" onClick={() => onBack()}>Back</Button>
							</div>
						</div>
					</form>
				</>
			} 
			leftRightRatio={'2:3'}
			maxWidth={'3xl'} 
			developers={['Alex (22)']}
		>
		</Page>
	);
}

export default ForgotPassword;
