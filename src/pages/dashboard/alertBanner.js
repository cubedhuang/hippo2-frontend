import { useState, useEffect } from 'react';
import { useFlashMsg } from "../../services/flashMsg";
import { useAuth } from "../../services/authentication";
import baseUrl from '../../apiUrls';
import { useNavigate } from 'react-router-dom';


function AlertBanner() {
	const auth = useAuth();
	const isParent = auth.user.type === 'PARENT';
	const [completed, setCompleted] = useState(true);
	const { flashMsg } = useFlashMsg(); 
	const navigate = useNavigate();

	useEffect(() => {
		const url =  baseUrl + '/api/v1/users/' + auth.user.id + '/tasks/';

		auth.autoAuthReq(url, { method: 'GET' }).then(res => {
			setCompleted(res.data.completed);
		}).catch(err => {
			// API request was not successful
			flashMsg('error', 'Failed to load Completed Tasks');
		});
	}, [auth, flashMsg]);

	const onClick = () => {
		navigate('todo');
	};
	
	return (
		<>
			{!completed ?
				<div onClick={onClick} className="bg-red-500 w-full text-white text-center py-6">
					{isParent ? 
						<div>
							<p>One or more of your children have incomplete tasks in their To-Do List.</p>
							<p><b className='underline cursor-pointer hover:text-gray-200'>Click here</b> to complete them so you can help your child prepare for their course!</p>
						</div> :
						<div>
							<p>You have incomplete tasks in your To-Do List.</p>
							<p><b className='underline cursor-pointer hover:text-gray-200'>Click here</b> to complete them now so you can gain access to your couse materials!</p>
						</div>
					}
				</div> : null
			}
		</>
	);
}

export default AlertBanner;
