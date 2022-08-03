import { Outlet, Link, useLocation } from 'react-router-dom';

function Dashboard() {
	const location = useLocation();
	const split = location.pathname.split('/');
	const tail = split[split.length - 1];

	return (
		<div className="flex h-screen relative">
			<div className="flex flex-col bg-neutral-300">
				<nav className='w-64 h-full bg-neutral-300 pr-4 hidden lg:block'>
					<ul className="mt-16 list-none pl-6">
						<li className='mb-6 hover:text-gray-500'>
							<Link 
								to='customers' 
								className={`header px-3 py-1 ${tail === 'customers' ? 'text-gray-500 cursor-default pointer-events-none' : ''}`}
							>
								Customers
							</Link>
						</li>
						<li className='mb-6 hover:text-gray-500'>
							<Link 
								to='courses' 
								className={`header px-3 py-1 ${tail === 'courses' ? 'text-gray-500 cursor-default pointer-events-none' : ''}`}
							>
								Courses
							</Link>
						</li>
						<li className='mb-6 hover:text-gray-500'>
							<Link 
								to='scholarships' 
								className={`header px-3 py-1 ${tail === 'scholarships' ? 'text-gray-500 cursor-default pointer-events-none' : ''}`}
							>
								Scholarships
							</Link>
						</li>
					</ul>
				</nav>
			</div>

			<div className='w-full flex flex-col flex-1'>
				<div className="grow overflow-y-scroll">
					<Outlet/>
				</div>
			</div>
		</div>
	);
}

export default Dashboard;
