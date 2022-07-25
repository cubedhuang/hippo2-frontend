import './ttlogo.css';
import TTLogoSVG from '../../ttlogo.svg';
import HippoSVG from '../../hippo.svg';

function TTLogo({ className, developers }) {
	let developerString = '';
	
	let devs;
	if ((developers) && (developers.length > 0)) {
		developerString = developers.join(', ');
		devs = (
			<p><span>Software Developers: </span> {developerString} </p>
		);
	} else {
		devs = null;
	}

	return (
		<div className={`ttlogo-main-container ${className}`}>
			<a target="_blank" rel="noreferrer" href="https://www.ai-camp.org/team-tomorrow" className="tt-logo">
				<img src={TTLogoSVG} alt="logo"/>
			</a>

			<div className="ttlogo-text-box-container">
				<div className="hippo-logo-container">
					<img src={HippoSVG} alt="hippo-logo" className="ttlogo-text-box-hippo float-right"/>
				</div>
                
				<div className="ttlogo-text-box-left">
					<p className="ttlogo-text-box-top text">
                        This system was built entirely by Team Tomorrow, AI Camp’s team of teen developers, in a project called hippo2!
					</p>
					<p><span>Product Manager: </span> Sricharan Guddanti (19)</p>
					<p><span>Product Designer: </span> Bernice Lau (18)</p>
					<p><span>Engineering Managers: </span> Jackson Choyce (19), Alexander Zhou (18)</p>
					{devs}
				</div>
			</div>
		</div>
	);
}

export default TTLogo;
