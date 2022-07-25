import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import './batchBoard.css';

function BatchBoard({ batchData, batchID, onChange, className, price, disabledID }) {
	// render each column into jsx
	const columns = [];
	const batchIDs = [];
	for (let x = 0; x < batchData.length; x++) {
		// get the first batch
		const batch = batchData[x];
		// continue if this batch was rendered already
		if (batchIDs.includes(batch.id)) {
			continue;
		}
		const column = [batch];
		batchIDs.push(batch.id);
		// get all batches with same name
		for (let i = x + 1; i < batchData.length; i++) {
			if (batchData[i].name === batch.name) {
				column.push(batchData[i]);
				batchIDs.push(batchData[i].id);
			}
		}

		// render batches to jsx
		const selection = [];
		for (let i = 0; i < column.length; i++) {
			const b = column[i];
			const selected = b.id === batchID;
			const disabled = !b.seats || b.id === disabledID;

			const seatsInfo = {};
			if (b.seats > 20) {
				seatsInfo.text = 'OPEN';
				seatsInfo.class = 'open';
			} else if (b.seats > 0) {
				seatsInfo.text = `${b.seats} LEFT`;
				seatsInfo.class = 'partial';
			} else {
				seatsInfo.text = 'SOLD OUT';
				seatsInfo.class = 'full';
			}
			// individual batch
			selection.push(
				<button 
					key={b.id}
					className={`batch ${selected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`} 
					disabled={selected || disabled}
					onClick={() => onChange(b)}
				>
					<p className="name">Batch {b.name}</p>
					<p className="time">
						{b.start_time} - {b.end_time} <span>{b.time_zone}</span>
					</p>
					<span className={`pill ${seatsInfo.class}`}>{seatsInfo.text}</span>
					<p className={`price ${price ? '' : 'hidden'}`}>
						<span>from</span>
						<span className="number">${price}</span>
					</p>
				</button>
			);
		}
		// column with column header
		columns.push(
			<div key={x} className="batch-col">
				<button 
					className="batch-head"
					onClick={(e) => e.currentTarget.parentElement.classList.toggle('show')}
				>
					<h1>{batch.start_date} - {batch.end_date}</h1>
					<h4>Batch {batch.name}</h4>
					<FontAwesomeIcon className="caret" icon={faAngleDown} />
				</button>
				{selection}
			</div>
		);
	}

	return (
		<div className={`batch-container ${className}`}>
			{columns}
		</div>
	);
}

export default BatchBoard;
