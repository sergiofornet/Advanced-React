import useForm from '../lib/useForm';

export default function CreateProduct() {
	const { inputs, handleChange, resetForm, clearForm } = useForm({
		name: 'ok',
		price: 20,
		description: 'ok',
	});

	return (
		<form>
			<label htmlFor="name">
				Name
				<input
					type="text"
					name="name"
					id="name"
					placeholder="Name"
					value={inputs.name}
					onChange={handleChange}
				/>
			</label>
			<label htmlFor="description">
				Description
				<input
					type="text"
					name="description"
					id="description"
					placeholder="Description"
					value={inputs.description}
					onChange={handleChange}
				/>
			</label>
			<label htmlFor="price">
				Price
				<input
					type="number"
					name="price"
					id="price"
					placeholder="Price"
					value={inputs.price}
					onChange={handleChange}
				/>
			</label>
			<div>
				<button type="button" onClick={clearForm}>
					Clear
				</button>
				<button type="button" onClick={resetForm}>
					Reset
				</button>
			</div>
		</form>
	);
}
