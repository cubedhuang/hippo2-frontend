import { useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../services/authentication";
import { useFlashMsg } from '../../services/flashMsg';
import { googleSocialUrl } from '../../apiUrls';
import validateUserLogin from '../../validation/login';
import formatApiErrors from '../../validation/formatApiErrors';
import Input from "../../components/form/input";
import Button from "../../components/button/button";
import Page from '../../components/page/page';
import './login.css';

function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [formErrors, setFormErrors] = useState({});
	const auth = useAuth();
	const location = useLocation();
	const { flashMsg } = useFlashMsg();

	const origin = location.state?.from?.pathname || '/';

	const googleState = encodeURI(window.btoa(JSON.stringify({
		origin: origin
	})));

	const googleSocialUrlFull = googleSocialUrl + `&state=${googleState}`;

	const loginUser = () => {
		setFormErrors({});
		const [err, data] = validateUserLogin({
			email,
			password
		});
		if (err) {
			return setFormErrors(err);
		}
		auth.handleLogin(data.email, data.password, origin).then(res => {
			flashMsg('success', 'Welcome back!');
		}).catch(err => {
			if (err.status === 400) {
				const keyMap = {
					password1: 'password',
					non_field_errors: 'nonFieldErrors'
				};
				setFormErrors(formatApiErrors(err.data, keyMap));
			} else {
				flashMsg('error', 'Failed to login');
			}
		});
	};

	return (
		<Page
			leftChildren={
				<>
					<h1 className="header text-2xl mb-8 text-center">Log In</h1>

					<p className="text-base mb-4">Welcome back to AI Camp!</p>

					<p className="text-base">
						By logging into AI Camp, you agree to our <a className="text-blue-700 hover:text-blue-600 underline decoration-inherit" href="https://www.ai-camp.org/terms-of-service">Terms of Service</a> and <a className="text-blue-700 hover:text-blue-600 underline decoration-inherit" href="https://www.ai-camp.org/privacy-notice">Privacy Policy</a>.
					</p>
				</>
			} 
			rightChildren={
				<form action="/" method="GET" onSubmit={event => {
					event.preventDefault();
				}}>
					<h2 className="header text-2xl mb-8 text-center">Welcome back to AI Camp!</h2>
		
					{
						formErrors.nonFieldErrors?.length ? 
							<span className='block form-error'>
								{formErrors.nonFieldErrors[0]}
							</span> 
							:
							null
					}
		
					<Input label="Email"
						type="email"
						placeHolder="JohnDoe@yahoo.com"
						className="mb-5 mt-5"
						isValid={formErrors.email?.length}
						errorText={formErrors.email?.[0]}
						onChange={val => setEmail(val)}
					/>
					<Input label="Password"
						type="password"
						placeHolder="JohnDoePassword"
						className="mb-2"
						isValid={formErrors.password?.length}
						errorText={formErrors.password?.[0]}
						onChange={val => setPassword(val)}
					/>
					<div className="mb-6">
						<Link to="/password/reset" className="mx-auto underline text-blue-700 hover:text-blue-600">Forgot password?</Link>
					</div>
		
					<Button bgColor="green" txtColor="white" className="w-full mb-3 py-1" onClick={() => loginUser()}>Next</Button>
		
					<p className="text-xl mb-3 text-center">Or</p>
		
					<div className="block mb-4">
						<Button isLink={true} bgColor="white" href={googleSocialUrlFull} className="w-full my-1 py-1 mx-auto block text-center">Log in with Google</Button>
					</div>
		
					<div className="mb-5 flex items-center justify-center">
						<Link 
							to="/signup" 
							className="mx-auto text-blue-700 hover:text-blue-600 underline"
							state={{ from: { pathname: origin }}}
						>Don't have an account?</Link>
					</div>
				</form>
			} 
			leftRightRatio={'5:7'}
			maxWidth={'3xl'} 
			developers={['Ray (14)', 'Matthew (14)']}
		>
		</Page>
	);
}

export default Login;
