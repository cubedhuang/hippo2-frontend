import Page from "../../components/page/page";
import Button from "../../components/button/button";

function TaxDetails () {

	const fileUpload = () => {
		//Dummy for now
	};

	const onBack = () => {
		//Dummy for now
	};

	const onSubmit = () => {
		//Dummy for now
	};

	return (
		<Page 
			leftChildren = {
				<div>
					<h1 className='text-2xl text-center mb-8'>Submit Tax Details</h1>
					<p className="mb-4"><b>(Optional)</b> For low-income families who would like to be considered for financial assistance, please upload a copy of your most recent W-2 form in PDF format.</p>
					<p><em>To determine if your family qualifies as low-income, <a href = "www.ai-camp.org" className="underline text-blue-700">click here for more information</a>.</em></p>
				</div> 
			} 
			rightChildren = {
				<div>
					<h1 className='text-xl text-center mb-12'>Upload Materials</h1>
                
					<div className='flex items-center justify-center'>
						<Button bgColor='gray' className="p-2 w-60 text-white mb-20" onClick={() => fileUpload()}>Upload W-2 Form</Button>
					</div>
                
					<div className="flex flex-col sm:flex-row mt-20">
						<div className="w-full p-4 sm:w-1/3">
							<Button bgColor="gray" txtColor="white" className="w-full py-2" onClick={() => onBack()}>Back</Button>
						</div>
                
						<div className="w-full p-4 sm:w-2/3">
							<Button bgColor="green" txtColor="white" className="w-full py-2" onClick={() => onSubmit()}>Submit</Button>
						</div>
					</div>
                
				</div>
                
			}
			leftRightRatio='5:7'
			maxWidth = '3xl'
			developers = {['Hyrum (23)']}
		/>
	);
}

export default TaxDetails;
