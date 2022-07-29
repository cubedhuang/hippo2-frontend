import { useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../services/authentication";
import validateUserInformation from "../../validation/userInformation";
import formatApiErrors from "../../validation/formatApiErrors";
import PhoneInput from "react-phone-input-2";
import Input from "../../components/form/input";
import Button from "../../components/button/button";
import Page from "../../components/page/page";
import 'react-phone-input-2/lib/style.css';
import './inviteUser.css';

function InviteUser() {
	const { user, handleUserInvite } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const [email, setEmail] = useState('');
	const [fName, setFName] = useState('');
	const [lName, setLName] = useState('');
	// users can only invite opposite type users currently
	const type = user.type === 'STUDENT' ? 'PARENT' : 'STUDENT';

	const [phone, setPhone] = useState('');
	const [dob, setDob] = useState('');

	const [formErrors, setFormErrors] = useState({});
	const [disable, setDisable] = useState(false);

	const origin = location.state?.from?.pathname || '/';

	if (user.filledInvite) {
		return <Navigate to={origin} replace />;
	}

	const onSubmit = () => {
		setDisable(true);
		setFormErrors({});
		const data = {
			email,
			fName,
			lName,
			type,
			phone
		};
		if (type !== 'PARENT') {
			data.dob = dob;
		}
		const [err, vData] = validateUserInformation(data, type);
		if (err) {
			setDisable(false);
			return setFormErrors(err);
		}

		// send invite
		handleUserInvite(
			vData.email, vData.fName, vData.lName, vData.type, 
			vData.phone, vData.dob
		).then(res => {
			navigate(origin);
		}).catch(err => {
			setDisable(false);
			if (err.status === 400) {
				const keyMap = {
					'first_name': 'fName',
					'last_name': 'lName',
					'phone_number': 'phone'
				};
				setFormErrors(formatApiErrors(err.data, keyMap));
			}
		});
	};

	let panelText;
	let formTitle;
	if (type === 'PARENT') {
		panelText = (
			<>
				<h1 className="header text-2xl mb-8 text-center">Parent Or Guardian Details</h1>
				<p className="text-base mb-4">
					Fill out your parent or guardian's personal details to create their account profile and invite them to log in so they access information, as well as other AI Camp course resources!
				</p>
			</>
		);
		formTitle = 'Invite your parent or guardian to create their AI Camp account.';
	} else {
		panelText = (
			<>
				<h1 className="header text-2xl mb-8 text-center">Student Details</h1>
				<p className="text-base mb-4">
					Fill out your student's email to invite them to create an account, which will allow them to access resources in preparation for their course(s).
				</p>
			</>
		);
		formTitle = 'Invite your student to create their AI Camp account.';
	}

	return (
		<Page
			leftChildren={
				<>
					{panelText}
					<p className="text-lg">Click "Next" to move onto the payment stage!</p>
				</>
			} 
			rightChildren={
				<form action="/" method="GET" onSubmit={event => {
					event.preventDefault();
				}}>
					<h2 className="header text-xl text-center">
						{formTitle}
					</h2>
					<div className="mb-8 mt-6">
						<Input label="Email"
							type="email"
							placeHolder="example@gmail.com"
							className="mb-3"
							value={email}
							isValid={formErrors.email?.length}
							errorText={formErrors.email?.[0]}
							onChange={val => setEmail(val)}
						/>
						<Input label="First Name"
							type="text"
							placeHolder="John"
							className="mb-3"
							value={fName}
							isValid={formErrors.fName?.length}
							errorText={formErrors.fName?.[0]}
							onChange={val => setFName(val)}
						/>
						<Input label="Last Name"
							type="text"
							placeHolder="Doe"
							className="mb-3"
							value={lName}
							isValid={formErrors.lName?.length}
							errorText={formErrors.lName?.[0]}
							onChange={val => setLName(val)}
						/>
						<label className="form-label mb-1">Mobile Phone Number</label>
						<PhoneInput 
							specialLabel="Phone Number"
							enableSearch
							countryCodeEditable={false}
							country={'us'}
							disableSearchIcon
							value={phone}
							onChange={value => {
								setPhone(value);
							}}
							isValid={() => !formErrors.phone?.length}
						/>
						{
							formErrors.phone?.length ? 
								<span className='mt-1 block form-error text-sm'>{formErrors.phone[0]}</span> 
								: 
								null
						}
						{type !== 'PARENT' &&
							<Input label="Birth Month and Year"
								type="text"
								placeHolder="MM/YYYY"
								value={dob}
								isValid={formErrors.dob?.length}
								errorText={formErrors.dob?.[0]}
								onChange={val => setDob(val)}
								className='mt-3'
							/>
						}
					</div>
		
					<Button disabled={disable} bgColor="green" txtColor="white" className={`w-full py-1 ${disable ? "opacity-50 cursor-not-allowed" : ""}`} onClick={() => onSubmit()}>Next</Button>
				</form>
			} 
			leftRightRatio={'5:7'}
			maxWidth={'3xl'} 
			developers={['Ray (14)', 'Zac (18)', 'Hyrum (23)']}
		>
		</Page>
	);
}

export default InviteUser;
