import { useState, useEffect } from 'react';
import './human.css';

function Human() {
	const [human, setHuman] = useState({ 'name': 'Name', 'role': 'Role', 'imgUrl': '', 'text': '' });
	useEffect(() => {
		const humans = [
			{ 'name': 'Jackson Choyce', 'role': 'Engineering Manager', 'imgUrl': `${process.env.PUBLIC_URL}/humans/jackson.png`, 'text': 'Jackson is here' },
			{ 'name': 'Sricharan Guddanti', 'role': 'Product Manager', 'imgUrl': `${process.env.PUBLIC_URL}/humans/sri.jpeg`, 'text': 'Sricharan is here' },
			{ 'name': 'Bernice Lau', 'role': 'Product Designer', 'imgUrl': `${process.env.PUBLIC_URL}/humans/bernice.jpg`, 'text': 'Bernice is AI Camp\'s Product Design Team Lead, as well as 2021 alumna of our 3 week AI Summer Camp ' },
			{ 'name': 'Alexander Zhou', 'role': 'Engineering Manager', 'imgUrl': `${process.env.PUBLIC_URL}/humans/alex.jpg`, 'text': 'Alexander is here' },
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
