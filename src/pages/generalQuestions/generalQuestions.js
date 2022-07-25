import useState from 'react';
import QuestionInput from '../../components/questionInputs/questionInput';
import ScholarshipBanner from '../../components/ScholarshipBanner/ScholarshipBanner';
import Button from '../../components/button/button';

function GeneralQuestions() {
	const [option, selectOption] = useState('');

	return (
		<>
			<ScholarshipBanner isGeneral/>
			<div className="w-full flex flex-row px-24 py-12 justify-center md:w-1/2 mx-auto mt-12 mb-32 rounded-xl bg-white">
				<form action="/" method="GET" onSubmit={event => {
					event.preventDefault();
				}} className="flex-none md:flex-initial w-full bg-white rounded-xl md:rounded-r-xl md:rounded-none">
					<QuestionInput
						questionNum={"1."}
						placeHolder="Enter response here"
						className="my-4 md:w-full"
						question="How much programming experience do you have?"
						mutedText="(Word Max: 150 words)"
						maxLength={150}
					/>
					<QuestionInput
						questionNum={"2."}
						className="my-4 md:w-full"
						question="How did you learn about the AI Camp scholarship?"
						radioDict={{ 'Option 1': '1', 'Option 2': '2', 'Option 3': '3', 'Other': '' }}
						value={option}
						setValue={selectOption}
					/>
					<QuestionInput
						questionNum={"3."}
						placeHolder="Enter response here"
						className="my-4 md:w-full"
						question="What school did you attend?"
						mutedText="(Word Max: 150 words)"
						maxLength={150}
					/>
					<div className="flex flex-row flex-nowrap mt-8">
						<Button 
							bgColor="gray"
							txtColor="white" 
							className="w-1/3 py-1 mr-6" 
						>
							Back
						</Button>
						<Button 
							bgColor="green" 
							txtColor="white" 
							className="w-2/3 py-3" 
						>
							Next
						</Button>
					</div>
				</form>
			</div>
		</>
	);
}

export default GeneralQuestions;
