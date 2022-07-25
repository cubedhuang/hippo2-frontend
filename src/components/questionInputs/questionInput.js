import './questionInput.css';

function QuestionInput({ placeHolder, question, radioDict, value, setValue, isValid, errorText, className, id, questionNum, name, maxLength, mutedText }) {
	let error = '';
	let style = '';
	
	if (isValid) {
		error = errorText;
		style += ' invalid-border';
	}

	let radioList;
	let valueList;

	// if radio input is desired, RadioDict Format = {{'option1':'1','option2.5':'9','option3':'2','option5':'3','Other':''}} 
	// blank values will result in text inputs
	if (radioDict) {
		valueList = Object.entries(radioDict).map(([key, val]) => ( val ));
		radioList = Object.entries(radioDict).map(([key, val]) => {
			if (val !== '') {
				return (
					<div key={key} className="flex md:items-center pr-3">
						<input id={key} type='checkbox' value={val} name={name} onChange={() => setValue(val)} checked={value === val}/>
						<label htmlFor={key} className="ml-2 text-sm font-semibold text-gray-400"> {key}</label>
					</div>
				);
			} else {
				return (
					<div key={key} className="pl-2 md:flex items-center">
						<input id={key} type="text" 
							placeholder={key} value={valueList.includes(value) ? '' : value} 
							onChange={(e) => {
								setValue(e.target.value);
							}} name={name}
							className="w-full placeholder:font-semibold placeholder:text-sm placeholder:text-gray-400 border-b-2"
						/>
					</div>
				);
			}
		}
		);
	} else {
		// set maxLength with maxLength attribute
		radioList = (
			<div className = 'w-full'>
				<textarea onChange={(e) => {
					// Resizes textarea to fit response
					if (e.target.value) {
						e.target.style.height = '';
						e.target.style.height = e.target.scrollHeight + 'px';
					} else {
						e.target.style.height = '';
					}
					setValue(e.target.value);
				}} 
				name={name}
				rows="1"
				placeholder={placeHolder}
				className='textarea w-full border-b-2'
				id={id}
				maxLength={maxLength}
				>
				</textarea>
			</div>);
	}

	return (
		<div className={`${className}`} value = {value}>
			<label className='font-semibold w-full md:text-xl text-base'>
				{questionNum} {question} <span className='text-slate-400 pl-1 text-xs relative'>{mutedText}</span>
			</label>

			<div className={style + ' mt-4 md:flex w-full md:text-base'}>
				{radioList}
			</div>
			<span className='invalid-text'>{error}</span>
		</div>
	);
}

export default QuestionInput;
