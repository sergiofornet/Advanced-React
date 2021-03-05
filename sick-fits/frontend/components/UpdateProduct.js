import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import useForm from '../lib/useForm';
import DisplayError from './ErrorMessage';
import Form from './styles/Form';

const SINGLE_PRODUCT_QUERY = gql`
	query SINGLE_PRODUCT_QUERY($id: ID!) {
		Product(where: { id: $id }) {
			id
			name
			description
			price
		}
	}
`;

const UPDATE_PRODUCT_MUTATION = gql`
	mutation UPDATE_PRODUCT_MUTATION(
		$id: ID!
		$name: String
		$description: String
		$price: Int
	) {
		updateProduct(
			id: $id
			data: { name: $name, description: $description, price: $price }
		) {
			id
			name
			description
			price
		}
	}
`;
export default function UpdateProduct({ id }) {
	// 1. We need to get the existent product
	const { data, error, loading } = useQuery(SINGLE_PRODUCT_QUERY, {
		variables: { id },
	});

	// 2. We need to get the mutation to update the product
	const [
		updateProduct,
		{ data: updateData, error: updateError, loading: updateLoading },
	] = useMutation(UPDATE_PRODUCT_MUTATION);

	// 2.5 Create some state for the form inputs.
	const { inputs, handleChange, resetForm, clearForm } = useForm(
		data?.Product
	);
	// console.log(inputs);
	if (loading) return <p>Loading...</p>;
	console.log(inputs);

	// 3. We need the form to handle the updates
	return (
		<Form
			onSubmit={async (e) => {
				e.preventDefault();
				// TODO: Handle submit!!!
				console.log(inputs);
				try {
					// Submit the input fields to the backend:
					// const res = await createProduct(); // This is the same as 'data'
					const res = await updateProduct({
						variables: {
							id,
							name: inputs.name,
							description: inputs.description,
							price: inputs.price,
						},
					});
					console.log(res);
					// console.log(data);
					// clearForm();
					// Go to that product's page
					// Router.push({
					// 	pathname: `/product/${data.createProduct.id}`,
					// });
				} catch (error) {
					console.log(error);
				}
			}}
		>
			<DisplayError error={error || updateError} />
			<fieldset disabled={updateLoading} aria-busy={updateLoading}>
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
				<label htmlFor="description">
					Description
					<textarea
						name="description"
						id="description"
						placeholder="Description"
						value={inputs.description}
						onChange={handleChange}
					/>
				</label>
				<button type="submit">Update Product</button>
			</fieldset>
		</Form>
	);
}
