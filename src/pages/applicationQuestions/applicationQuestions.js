import QuestionInput from '../../components/questionInputs/questionInput';
import ScholarshipBanner from '../../components/ScholarshipBanner/ScholarshipBanner';
import Button from '../../components/button/button';
import { useNavigate } from "react-router-dom";

function ApplicationQuestions() {
	const navigate = useNavigate();

	const onBack = () => {
		navigate('/scholarship/courses/<courseId>/general');
	};

	const onNext = () => {
		navigate('/scholarship/courses/<courseId>/tax-details');
	};

	return (
		<>
			<ScholarshipBanner/>
			<div className="w-full flex flex-row px-24 py-12 justify-center md:w-1/2 mx-auto mt-12 mb-32 rounded-xl bg-white">
				<form action="/" method="GET" onSubmit={event => {
					event.preventDefault();
				}} className="flex-none md:flex-initial w-full bg-white rounded-xl md:rounded-r-xl md:rounded-none">
					<QuestionInput
						questionNum={"1."}
						placeHolder="Enter response here"
						className="my-4 md:w-full"
						question="What would you like to learn about AI?"
						mutedText="(Word Max: 150 words)"
						maxLength={150}
					/>
					<QuestionInput
						questionNum={"2."}
						placeHolder="Enter response here"
						className="my-4 md:w-full"
						question="Why do you want to join AI Camp?"
						mutedText="(Word Max: 150 words)"
						maxLength={150}
					/>
					<QuestionInput
						questionNum={"3."}
						placeHolder="Enter response here"
						className="my-4 md:w-full"
						question="What do you hope to get out of AI Camp?"
						mutedText="(Word Max: 150 words)"
						maxLength={150}
					/>
					<QuestionInput
						questionNum={"4."}
						placeHolder="Enter response here"
						className="my-4 md:w-full"
						question="Describe a moment where you felt proud of yourself."
						mutedText="(Word Max: 150 words)"
						maxLength={150}
					/>
					<div className="flex flex-row flex-nowrap mt-8">
						<Button 
							bgColor="gray"
							txtColor="white" 
							className="w-1/3 py-1 mr-6" 
							onClick={() => onBack()}
						>
							Back
						</Button>
						<Button 
							bgColor="green" 
							txtColor="white" 
							className="w-2/3 py-3" 
							onClick={() => onNext()}
						>
							Next
						</Button>
					</div>
				</form>
			</div>
		</>
	);
}

export default ApplicationQuestions;
