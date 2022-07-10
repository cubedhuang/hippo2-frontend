import { useEffect, useRef } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../services/authentication";
import { useFlashMsg } from "../../services/flashMsg";
import baseUrl from "../../apiUrls";
import Loading from "../loading/loading";

function GroupJoin() {
	const location = useLocation();
	const navigate = useNavigate();
	const [search] = useSearchParams();
	const token = search.get('token');
	const { autoAuthReq } = useAuth();
	const { flashMsg } = useFlashMsg();
	const flashMsgRef = useRef(flashMsg).current;
	const here = location.pathname + location.search;

	useEffect(() => {
		if (token) {
			const url = baseUrl + '/api/v1/groups/join/';
			const options = {
				method: 'POST',
				body: {
					token: token
				}
			};
			autoAuthReq(url, options, here).then(res => {
				flashMsgRef('error', 'Successfully joined group');
				navigate('/');
			}).catch(err => {
				flashMsgRef('error', 'Failed to join group');
			});
		}
	}, [token, autoAuthReq, here, navigate, flashMsgRef]);

	return (
		<Loading />
	);
}

export default GroupJoin;
