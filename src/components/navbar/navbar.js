import { Link } from 'react-router-dom';
import { useAuth } from '../../services/authentication';
import usePageTracking from '../../services/usePageTracking';
import logo from '../../logo.svg';
import './navbar.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useFlashMsg } from "../../services/flashMsg";

function Navbar({ isStudentRegistered }) {
	usePageTracking(); // google analytics
	// const [show] = useState(true); //change [show] to [show, setShow] if uncommenting showNav() below
	const show = true;
	const { user, handleLogout } = useAuth();
	const { flashMsg } = useFlashMsg();
	// const showNav = () => {
	// 	setShow(!show);
	// };
	const [mobileMenuOpened, setMobileMenuOpened] = useState(false);

	const handlePageSwitch = () => {
		setMobileMenuOpened(false);
	};

	const menuButtonColor = mobileMenuOpened ? `bg-gray-400` : `bg-transparent-green`;

	const onCoursesClick = (event) => {
		if (isStudentRegistered) {
			event.preventDefault();
			setMobileMenuOpened(false);
			flashMsg('error', 'You are already registered for a course.');
		} else {
			handlePageSwitch();
		}
	};

	const onLogout = () => {
		handleLogout();
	};

	return (
		<>
			<header className='w-full py-3'>
				<div className="navbar container lg:mx-auto px-3 lg:px-0">
					<Link className='nav-logo' to="/">
						<img src={logo} alt='logo'/>
						<h1 className='text-3xl text-white font-semibold' >{/*Navbar*/}</h1>
					</Link>
					{/* <button className='navbar-collapse' onClick={() => showNav()}>
						<FontAwesomeIcon icon={faBars} />
					</button> */}
					<nav className={`${show ? 'show' : ''} hidden lg:flex`}>
						<ul className='nav-links grow'>
							{
								user.isLoggedIn && user.fName ?
									<li>
										<span className='user-text'>Logged in as {user.fName}</span>
									</li>
									: null
							}
							{/* <li className='text-white hover:text-gray-300'>
								<Link to='/'>Page 1</Link>
							</li>
							<li className='text-white hover:text-gray-300'>
								<Link to='protected'>Page 2</Link>
							</li>
							<li className='text-white hover:text-gray-300'>
								<Link to='/introductionVideo'>Welcome Page</Link>
							</li> */}
						</ul>
						<ul className='nav-links grow-0'>
							{/* <li className='text-white hover:text-gray-300'>
								<Link to='signup'>Sign Up</Link>
							</li>
							<li className='text-white hover:text-gray-300'>
								<Link to='login'>Login</Link>
							</li> */}
							{
								user.isLoggedIn ?
									<li className='logout'>
										<button onClick={() => onLogout()} >Logout</button>
									</li>
									: null
							}
						</ul>
					</nav>
				</div>
			</header>

			<button className={`menu lg:hidden absolute top-5 right-4 h-8 w-8 rounded-full transition-colors ${menuButtonColor}`}
				title="Open Navigation Menu"
				onClick={() => setMobileMenuOpened(!mobileMenuOpened)}>
				<FontAwesomeIcon className={mobileMenuOpened ?
					`mt-1 h-6 w-6 text-black` :
					`mt-1 h-5 w-5 text-neutral-800`} icon={mobileMenuOpened ? faXmark : faBars} />
			</button>

			<div className={`w-full h-full absolute top-18 left-0 z-50 bg-light-green flex flex-col lg:hidden transparent ${mobileMenuOpened ? 'show' : null}`}>
				<div className="h-24 bg-transparent-green p-8 text-right text-xl flex-initial">
					<button onClick={() => handleLogout()}>Log Out</button>
				</div>
				<div className="menu-items flex-grow py-6 px-8 text-right text-xl">
					<Link to="/dashboard" onClick={() => handlePageSwitch()}>Home</Link>
					<hr />
					<Link to="/dashboard/todo" onClick={() => handlePageSwitch()}>To Do List</Link>
					<hr />
					<Link to="/dashboard/account" onClick={() => handlePageSwitch()}>Account Settings</Link>
					<hr />
					<Link to="/courses" onClick={(e) => onCoursesClick(e)} className={isStudentRegistered ? 'disabled' : ''}>Register for Courses</Link>
					<hr />
					<Link to="/dashboard/events" onClick={() => handlePageSwitch()}>Upcoming Events</Link>
					<hr />
					<Link to="/dashboard/products" onClick={() => handlePageSwitch()}>Explore Student Products</Link>
					<hr />
					<Link to="/dashboard/help" onClick={() => handlePageSwitch()}>Help Center</Link>
					<hr />
				</div>
			</div>
		</>
	);
}

export default Navbar;
