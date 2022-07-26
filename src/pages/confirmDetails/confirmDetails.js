import { useState } from "react";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../services/authentication";
import { useFlashMsg } from "../../services/flashMsg";
import validateUserInformation from "../../validation/userInformation";
import formatApiErrors from "../../validation/formatApiErrors";
import PhoneInput from "react-phone-input-2";
import Input from "../../components/form/input";
import Button from "../../components/button/button";
import Page from "../../components/page/page";
import 'react-phone-input-2/lib/style.css';
import './confirmDetails.css';

function ConfirmDetails() {
	const { user, handleUserUpdate } = useAuth();
	const { flashMsg } = useFlashMsg();
	const location = useLocation();
	const navigate = useNavigate();

	const [fName, setFName] = useState(user.fName);
	const [lName, setLName] = useState(user.lName);
	const [dob, setDob] = useState(user.dob);
	const [phone, setPhone] = useState(user.phone);
	const [formErrors, setFormErrors] = useState({});

	const origin = location.state?.from?.pathname || '/';

	if (user.filledDetails) {
		return <Navigate to={origin} replace />;
	}
	
	const onSubmit = () => {
		// executes when the Done button is clicked or when form is submitted
		setFormErrors({});
		const info = {
			fName,
			lName,
			email: user.email,
			type: user.type,
			phone
		};
		if (user.type !== 'PARENT') {
			info.dob = dob;
		}

		const [err, data] = validateUserInformation(info, user.type);
		if (err) {
			return setFormErrors(err);
		}

		handleUserUpdate(
			data.fName, data.lName, data.dob, 
			data.phone, true, user.id, location.pathname
		).then(res => {
			navigate(origin);
		}).catch(err => {
			if (err.status === 400) {
				const keyMap = {
					'first_name': 'fName',
					'last_name': 'lName',
					'phone_number': 'phone'
				};
				setFormErrors(formatApiErrors(err.data, keyMap));
			} else if (err.data?.message) {
				flashMsg('error', err.data.message);
			}
		});

	};

	return (
		<Page
			leftChildren={
				<>
					<h1 className="text-2xl mb-8 text-center">Confirm Your Details</h1>
					<p className="text-base mb-4">
						Fill out your personal details to start the course registration process! 
					</p>
					<p className="text-base mb-4">
						Some items may be pre-filled, so feel free to make edits to ensure that the information is accurate.
					</p>
					<p className="text-base mb-4">
						Click “Next” to move onto the {user.type === 'student' ? 'parent' : 'student'} information section!
					</p>
				</>
			} 
			rightChildren={
				<form action="/" method="GET" onSubmit={event => {
					event.preventDefault();
				}}>
					<h2 className="text-xl mb-8 text-center grow-0">Gain real experience by building real AI products. We are here to support you.</h2>
					<div className="mb-8 mt-5 grow">
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
								: null
						}
						{user.type !== 'PARENT' &&
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
		
					<div className="grow-0">
						<Button bgColor="green" txtColor="white" className="w-full py-1" onClick={() => onSubmit()}>Done</Button>
					</div>
				</form>
			} 
			leftRightRatio={'2:3'}
			maxWidth={'3xl'} 
			developers={[]}
		>
		</Page>
	);
}

export default ConfirmDetails;
