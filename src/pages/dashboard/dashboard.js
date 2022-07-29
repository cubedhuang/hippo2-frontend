import { Outlet, Link, useLocation } from 'react-router-dom';
import TTLogo from '../../components/ttlogo/ttlogo';
import { useFlashMsg } from "../../services/flashMsg";
import { useState } from "react";

function Dashboard({ isStudentRegistered }) {
	const location = useLocation();
	const split = location.pathname.split('/');
	const tail = split[split.length - 1];
	const { flashMsg } = useFlashMsg();
	const [devs, setDevs] = useState([]);

	return (
		<div className="flex h-screen relative">
			<div className="flex flex-col bg-neutral-300">
				<nav className='w-64 h-full bg-neutral-300 pr-4 hidden lg:block'>
					<ul className="mt-16 list-none pl-6">
						<li className='mb-6 hover:text-gray-500'>
							<Link 
								to='' 
								className={`header px-3 py-1 ${tail === 'dashboard' ? 'text-gray-500 cursor-default pointer-events-none' : ''}`}
								onClick = {() => setDevs(['Matthew (14)', 'Alex (22)', 'Zac (18)', 'Sean (16)', 'Hyrum (23)'])}
							>
								Dashboard Home
							</Link>
						</li>
						<li className='mb-6 hover:text-gray-500'>
							<Link 
								to='todo' 
								className={`header px-3 py-1 ${tail === 'todo' ? 'text-gray-500 cursor-default pointer-events-none' : ''}`}
								onClick = {() => setDevs(['Zac (18)', 'Alex (22)', 'Hyrum (23)'])}
							>
								To-Do List
							</Link>
						</li>
						<li className='mb-6 hover:text-gray-500'>
							<Link 
								to='account' 
								className={`header px-3 py-1 ${tail === 'account' ? 'text-gray-500 cursor-default pointer-events-none' : ''}`}
								onClick = {() => setDevs(['Nathan Xaysena (19)', 'Leo Due (17)'])}
							>
								Account Settings
							</Link>
						</li>
						<li className={`mb-6 ${!isStudentRegistered ? 'hover:text-gray-500' : ''}`}>
							<Link 
								to='/courses'
								className={`header px-3 py-1 ${isStudentRegistered ? 'cursor-default' : ''}`} onClick={(event) => {
									if (isStudentRegistered) {
										event.preventDefault();
										flashMsg('error', 'You are already registered for a course.');
									}
								}}>
								Register for Programs
							</Link>
						</li>
						<li className='header mb-6 hover:text-gray-500'>
							<a href='https://www.ai-camp.org/student-products' target='_blank' rel='noopener noreferrer' className="px-3 py-1">
								Explore Student Products
							</a>
						</li>
						<li className='header mb-6 hover:text-gray-500'>
							<a href='https://www.ai-camp.org/summer-help-center' target='_blank' rel='noopener noreferrer' className="px-3 py-1">
								Help Center
							</a>
						</li>
					</ul>
				</nav>
				<TTLogo className='sticky bottom-10 p-6 pl-9 lg-hidden text-white' developers={devs} />
			</div>

			<div className='w-full flex flex-col flex-1'>
				<div className="grow overflow-y-scroll">
					<Outlet />
				</div>
			</div>
		</div>
	);
}

export default Dashboard;
