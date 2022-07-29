import { useState, useEffect } from "react";
import { useAuth } from "../../../../services/authentication";
import { useFlashMsg } from "../../../../services/flashMsg";
import baseUrl from '../../../../apiUrls';
import HideViewBar from "../../../../components/HideViewBar/HideViewBar";
import 'react-phone-input-2/lib/style.css';


function GetCompletedTasks(prop) {
	const [tasksList, setTasksList] = useState([]);
	const { flashMsg } = useFlashMsg();
	const { autoAuthReq } = useAuth();
	const { orderId, comTasks } = prop;

	useEffect(() => {
		const options = { method: 'GET' };
		(async () => {
			// Grabbing a List of ToDo Tasks
			const ourl  = baseUrl + '/api/v1/orders/' + orderId + '/tasks/';
			const tdata = await autoAuthReq(ourl, options);
			setTasksList(tdata.data.tasks);

		})().catch(err => {
			flashMsg('error', 'Failed to get task info');
		});
	}, [autoAuthReq, flashMsg, orderId]);
	
	// create Completed toDo tasks container
	const ToDoCompletedTasks = tasksList.map((task) =>{
		if (comTasks && comTasks.includes(task.id)) {
			return (
				<label className="containertask" key={task.id}>{task.text}
					<input type="checkbox" value = {task.id} checked={true} readOnly></input>
					<span className="checkmark"></span>
				</label>
			);
		}
		return null;
	});

	return (
		<>
			<HideViewBar info={ToDoCompletedTasks} buttonName={'Completed Tasks'} > </HideViewBar>
		</>
	);

}

export default GetCompletedTasks;
