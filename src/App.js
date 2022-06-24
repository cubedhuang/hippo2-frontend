import {
	BrowserRouter, Routes, Route
} from 'react-router-dom';
import { lazy, Suspense } from 'react';
import PrivateRoute from './components/privateroute/privateRoute';

import { AuthProvider } from './services/authentication';
import { FlashMsgProvider } from './services/flashMsg';

import Navbar from './components/navbar/navbar';
import Home from './pages/home/home';
import SelectCourses from './pages/selectCourse/selectCourses';

import Signup from './pages/signup/signup';
import Login from './pages/login/login';
import Protected from './pages/protected/protected';
import GoogleAuth from './pages/google/google';
import Footer from './components/footer/footer';
import ForgotPassword from './pages/forgotPassword/forgotPassword';
import ForgotPasswordConfirm from './pages/forgotPasswordConfirm/forgotPasswordConfirm';
import GroupJoin from './pages/groupJoin/groupJoin';
import GroupJoinSignup from './pages/groupJoinSignup/groupJoinSignup';

import './App.css';
import Loading from './pages/loading/loading';
import BatchPage from './pages/batches/batchPage';

const Welcome = lazy(() => import('./pages/welcome/welcome'));

function App() {
	return (
		<BrowserRouter>
			<AuthProvider>
				<FlashMsgProvider>
					<Navbar />
					<Routes>
						<Route path='/' element={
							<PrivateRoute>
								<Home />
							</PrivateRoute>
						}></Route>
						<Route path='/auth/google/' element={<GoogleAuth />}></Route>
						<Route path='/welcome' element={
							<PrivateRoute initBlind={true}>
								<Suspense fallback={<Loading />}>
									<Welcome />
								</Suspense>
							</PrivateRoute>
						}></Route>
						<Route path='/protected' element={
							<PrivateRoute>
								<Protected />
							</PrivateRoute>
						}></Route>
						<Route path='/signup' element={<Signup />}></Route>
						<Route path='/login' element={<Login />}></Route>
						<Route path='/password/reset' element={<ForgotPassword />}></Route>
						<Route path='/courses' element={<SelectCourses/>}></Route>
						<Route path='/password/reset/confirm' element={<ForgotPasswordConfirm />}></Route>
						<Route path='/group/join' element={
							<PrivateRoute initBlind={true}>
								<GroupJoin />
							</PrivateRoute>
						}></Route>
						<Route path='/group/join/signup' element={
								<GroupJoinSignup />
						}></Route>
						<Route path='/courses/:courseID/batches' element={<BatchPage />}></Route>
					</Routes>
					<Footer />
				</FlashMsgProvider>
			</AuthProvider>
		</BrowserRouter>
	);
}

export default App;
