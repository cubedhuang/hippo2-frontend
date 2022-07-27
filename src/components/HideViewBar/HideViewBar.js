import { useState } from "react";
import Button from "../../components/button/button";
import 'react-phone-input-2/lib/style.css';
import './HideViewBar.css';


function HideViewBar(prop) {
	const [blockHidden, setBlockHidden] = useState(false);
	const { info, buttonName } = prop;
	const hideView = () => {
		setBlockHidden(!blockHidden);
	};

	let HideViewButton;
	let arrow;
	if (blockHidden) {
		HideViewButton = (
			<p id = 'hideViewText' className='text-base md:text-xl whitespace-nowrap'>Hide {buttonName}</p>
		);
		arrow = (
			<div className='arrow upArrow relative left-3 top-1' id='upArrow'></div>
			
		);
	} else {
		HideViewButton = (
			<p id = 'hideViewText'className='text-base md:text-xl whitespace-nowrap'>View {buttonName}</p>
		);
		arrow = (
			<div className='arrow downArrow relative left-3 bottom-1' id='downArrow'></div>
		);
	}

	return (
		<>
			<div className="flex-none md:flex-initial w-full py-5 px-8 trxn-gray rounded-b-xl rounded-none">
				<div className="flex items-center justify-center h-0">
					<Button className="text-2xl flex font-semibold items-center justify-center px-20" onClick={hideView}>
						{HideViewButton}
						{arrow}
					</Button>
				</div>
				{blockHidden ?
					<div id='hideView' className='pt-5'>
						<form>
							{info}
						</form>
					</div> : null} 
			</div> 
		</>
	);

}

export default HideViewBar;
