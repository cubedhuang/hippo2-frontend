import { Link } from "react-router-dom";

function PageNotFound() {
	return (
		<div className="mt-24 mb-12 text-center px-5">
			<h1 className="header text-5xl md:text-8xl font-semibold">OOPS!</h1>
			<p className="text-lg mt-3">Seems like we couldn't find the page you were looking for.</p>
			<p className="text-lg mt-3">Double check that the url link is correct!</p>
			<Link to='/dashboard' className="inline-block bg-black hover:bg-gray-700 text-white py-3 px-8 md:px-28 mt-10 rounded-3xl text-lg">
				Go to Dashboard
			</Link>
		</div>
	);
}

export default PageNotFound;
