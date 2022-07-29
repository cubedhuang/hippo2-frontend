import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../services/authentication";
import { useFlashMsg } from "../../services/flashMsg";
import validatePassword from "../../validation/password";
import sendReq from "../../services/sendReq";
import baseUrl from "../../apiUrls";

import Loading from "../loading/loading";
import Button from "../../components/button/button";
import Input from "../../components/form/input";

import Page from "../../components/page/page";
import Human from "../../components/human/human";

function SignUpInvite() {
	const [data, setData] = useState({
		invite_to: {},
		invited_by: {}
	});
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(true);
	const [formErrors, setFormErrors] = useState('');
	const [search] = useSearchParams();
	const { handleLogin } = useAuth();
	const { flashMsg } = useFlashMsg();
	const resetToken = search.get('resettoken');
	const inviteToken = search.get('invitetoken');
	

	useEffect(() => {
		if (!resetToken || !inviteToken) {
			return flashMsg('error', 'Invalid invite link');
		}
		// get invite information
		const url = baseUrl + `/api/v1/groups/invite/${inviteToken}/`;
		sendReq(url, { method: 'GET' }).then(res => {
			setData(res.data);
			setLoading(false);
		}).catch(err => {
			flashMsg('error', 'Failed to get invite info');
		});
	}, [resetToken, inviteToken, flashMsg]);

	const setupUser = () => {
		setFormErrors('');
		const [err, vPassword] = validatePassword(password);
		if (err) {
			return setFormErrors(err);
		}
		// set user password
		const url = baseUrl + '/auth/password/reset/confirm/';
		const options = {
			method: 'POST',
			body: {
				uid: data.invite_to.id,
				token: resetToken,
				new_password1: vPassword,
				new_password2: vPassword
			}
		};
		(async () => {
			await sendReq(url, options);
			// login user
			await handleLogin(data.invite_to.email, vPassword, '/');
		})().then(res => {
			flashMsg('success', 'Welcome to AI Camp!');
		}).catch(err => {
			if (err.status === 400) {
				if (
					err.data?.new_password1 && Array.isArray(err.data.new_password1) && 
					err.data.new_password1.length
				) {
					return setFormErrors(err.data.new_password1[0]);
				}
			}
			flashMsg('error', 'Error signing up');
		});
	};

	if (loading) {
		return <Loading/>;
	}

	const formTitle = `
		Your ${data.invited_by.type === 'STUDENT' ? 'student' : 'parent or guardian'}, 
		${data.invited_by.first_name}, has invited you to create a 
		${data.invite_to.type === 'STUDENT' ? 'student' : 'parent'} account.
	`;

	return (
		<Page
			leftChildren={
				<>
					<h1 className="header text-2xl mb-8 text-center">Create an Account</h1>
					<p className="text-base mb-4">
						AI Camp teaches future leaders about coding, AI, how to learn, and how to work through creating impressive AI products and tech internships.
					</p>

					<p className="text-base mb-4">
						By creating AI products, our students apply what they have learned through first-hand experience of being an engineer, a product manager, or a data scientist.
					</p>

					<p className="text-base mb-4">
						Ready to start your AI journey? Our world class mentors and instructors are here to guide you!
					</p>

					<p className="text-base">
						By signing up for AI Camp, you agree to our <a className="text-blue-700 hover:text-blue-600 underline decoration-inherit" href="/">Terms of Service</a> and <a className="text-blue-700 hover:text-blue-600 underline decoration-inherit" href="/">Privacy Policy</a>.
					</p>
				</>
			} 
			rightChildren={
				<form action="/" method="GET" onSubmit={event => {
					event.preventDefault();
				}}>
					<Human></Human>
					<h2 className="header text-xl mb-6 mt-8 text-center">
						{formTitle}
					</h2>
					<Input label="Email"
						type="email"
						className="mb-3"
						id="email"
						value={data.invite_to.email}
						readOnly
						onChange={() => {}}
					/>
					<Input label="Password"
						type="password"
						placeHolder="JohnDoePassword"
						className="mb-3"
						id="password"
						isValid={formErrors}
						errorText={formErrors}
						onChange={val => setPassword(val)}
					/>
		
					<Button bgColor="green" txtColor="white" className="w-full my-1 mb-3 py-1 mx-auto block text-center" onClick={() => setupUser()}>Next</Button>
				</form>
			} 
			leftRightRatio={'5:7'}
			maxWidth={'3xl'} 
			developers={['Ray (14)', 'Zac (18)']}
		>
		</Page>
	);
}

export default SignUpInvite;
