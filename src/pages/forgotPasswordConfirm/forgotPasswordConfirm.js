import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useFlashMsg } from "../../services/flashMsg";
import sendReq from "../../services/sendReq";
import validatePassword from '../../validation/password';
import baseUrl from "../../apiUrls";
import Input from "../../components/form/input";
import Button from "../../components/button/button";
import Page from "../../components/page/page";


function ForgotPasswordConfirm() {
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const { flashMsg } = useFlashMsg();
	const [search] = useSearchParams();
	const uid = search.get('uid');
	const token = search.get('token');
	const navigate = useNavigate();


	const resetPassword = () => {
		const [err, data] = validatePassword(password);
		if (err) {
			//validate password
			setErrorMessage(err);
		} else if (password !== confirmPassword) { 
			//check if the 2 passwords match
			setErrorMessage('Passwords do not Match');
		} else if (uid && token) {
			//update password if we have uid and token
			setErrorMessage('');
			const url = baseUrl + '/auth/password/reset/confirm/';
			const options = {
				method: 'POST',
				body: {
					uid: uid,
					token: token,
					new_password1: data,
					new_password2: data
				}
			};
			sendReq(url, options).then(res => {
				flashMsg('success', 'Password Reset Successfully!');
				navigate('/login');
			}).catch(err => {
				if (err.data?.new_password2?.[0]) {
					return flashMsg('error', err.data.new_password2[0]);
				} else if (err.status) {
					return flashMsg(
						'error', 'Failed to reset! Check that your password is not too weak and common'
					);
				}
				flashMsg('error', 'Failed to connect to server');
			});	
		} else {
			// no UID or token but passwords are correct format
			setErrorMessage('');
			flashMsg('error', 'Error Resetting Password');
		}
	};

	return (
		<Page
			leftChildren={
				<>
					<h1 className="header text-2xl mb-8 text-center">Password Reset</h1>
					<p className="text-base mb-6">Reset your password by entering your new password.</p>
						
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
						<Input label="New Password"
							type="password"
							placeHolder="Password"
							className="mb-3"
							id="password"
							onChange={val => setPassword(val)} 
						/>
						<Input label="Confirm New Password"
							type="password"
							placeHolder="Confirm Password"
							className="mb-5 mt-5"
							onChange={val => setConfirmPassword(val)}
						/>
						<div className='pb-3'>
							{errorMessage && (<p className="error bg-red-100 border-l-4 border-red-500 text-red-700 p-4"> {errorMessage} </p>)}
						</div>
						<Button bgColor="green" txtColor="white" className="w-full py-1 mb-3" onClick={() => resetPassword()}>Reset Password</Button>
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

export default ForgotPasswordConfirm;
