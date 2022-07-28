import { useState, useEffect } from 'react';
import './human.css';

function Human() {
	const [human, setHuman] = useState({ 'name': 'Name', 'role': 'Role', 'imgUrl': '', 'text': '' });
	useEffect(() => {
		const humans = [
			{ 'name': 'Jackson Choyce', 'role': 'Engineering Manager', 'imgUrl': `${process.env.PUBLIC_URL}/humans/jackson.png`, 'text': 'Jackson is the Backend Engineering Manager for hippo2, the system that you\'re using right now. He has been with AI Camp since 2020 and leads multiple teams. He coordinates most of AI Camp\'s infrastructure to keep our programs running smoothly. Jackson led efforts to implement this product at 19 years old.' },
			{ 'name': 'Sricharan Guddanti', 'role': 'Product Manager', 'imgUrl': `${process.env.PUBLIC_URL}/humans/sri.jpeg`, 'text': 'Sricharan is a Product Manager at AI Camp, and as a 19-year-old, led the development of hippo2, the product you are using right now to sign up and register for courses! A 2021 alumni of our 3-week AI Summer Camp, Sricharan creates products that improve both AI Camp\'s  customer and internal team experience.' },
			{ 'name': 'Bernice Lau', 'role': 'Product Designer', 'imgUrl': `${process.env.PUBLIC_URL}/humans/bernice.jpg`, 'text': 'Bernice is AI Camp\'s Product Design Team Lead, as well as 2021 alumna of our 3 week AI Summer Camp. She designed hippo2, the system that you\'re using right now, as an 18-year-old. Bernice makes data-driven decisions to design seamless experiences for our customers on a daily basis.' },
			{ 'name': 'Alexander Zhou', 'role': 'Engineering Manager', 'imgUrl': `${process.env.PUBLIC_URL}/humans/alex.jpg`, 'text': 'Alex, 18-years old, is the Frontend Engineering Manager for project hippo2, the application that you are using right now. Joining AI Camp after the 20202 3-week Summer Camp, Alex has served as a leader and mentor for multiple teams, working on backend, frontend, mobile development, data analysis, and more. ' },
		];
		setHuman(humans[Math.floor(Math.random() * humans.length)]);
	}, []);

	return (
		<div className="flex flex-col items-center">
			<div className='human-img-container'>
				<img src={human.imgUrl} alt="" className="mb-4 human-img"/>
			</div>
			
			<div className='human-textbox-container'>
				<p className='human-textbox'>{human['text']}</p>
			</div>
			
			<h1 className='text-xl text-center'>Hi! I'm {human.name}, {human.role} at AI Camp.</h1>
			<h1 className='text-xl'>Let's get started.</h1>
		</div>
	);
}

export default Human;
