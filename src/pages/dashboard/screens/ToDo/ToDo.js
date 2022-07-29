import { useState, useEffect } from "react";
import { useAuth } from "../../../../services/authentication";
import { useFlashMsg } from "../../../../services/flashMsg";
import baseUrl from '../../../../apiUrls';
import Loading from "../../../loading/loading";
import 'react-phone-input-2/lib/style.css';
import GetTasks from './Tasks';
import GetCompletedTasks from './CompletedTasks';


function ToDo() {
	const [isLoaded, setIsLoaded] = useState(true);
	const [orders, setOrders] = useState(null);
	const { flashMsg } = useFlashMsg();
	const { user, autoAuthReq } = useAuth();

	useEffect(() => {
		// get data for each order
		const orderApi = baseUrl + '/api/v1/users/' + user.id + '/orders/';
		const options = { method: 'GET' };

		(async () => {
			const orderData = await autoAuthReq(orderApi, options);
			setOrders(orderData.data);
		})().catch(err => {
			flashMsg('error', 'Failed to get task info');
		});
		setIsLoaded(false);

	}, [autoAuthReq, flashMsg, user]);

	let orderList = null;
	if (orders !== null) {
		orderList = [];
		for (let order of orders) {
			// For each order, create Task Container for each order with both Tasks and Completed Tasks
			orderList.push((
				<div className="container flex flex-wrap mx-auto mt-10 px-5 mb-10">
				   <div className="flex-none md:flex-initial w-full md:w-full py-5 px-8 bg-white text-black rounded-t-xl md:rounded-t-xl md:rounded-none">
					   <h1 className="text-2xl mb-8 text-center">{order.user.first_name} {order.user.last_name}'s To Do List</h1>
					   <form>
						   {isLoaded ? <Loading /> : null}
						   <GetTasks orderId={order.id} comTasks={order.completed_tasks} />
					   </form>
					</div>
					<GetCompletedTasks orderId={order.id} comTasks={order.completed_tasks} />
				</div>
			));
		}
	}

	return (
		<>
			<div className="container w-full md:max-w-4xl md:w-8/12 flex flex-wrap mx-auto pt-12 px-3"> 			
				{orderList}
			</div>
		</>
	);

}

export default ToDo;
