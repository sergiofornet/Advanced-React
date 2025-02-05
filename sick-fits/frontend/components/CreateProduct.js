import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import Router from 'next/router';
import useForm from '../lib/useForm';
import DisplayError from './ErrorMessage';
import { ALL_PRODUCTS_QUERY } from './Products';
import Form from './styles/Form';

const CREATE_PRODUCT_MUTATION = gql`
	mutation CREATE_PRODUCT_MUTATION(
		# Which variables are getting passed in
		$name: String!
		$description: String!
		$price: Int!
		$image: Upload
	) {
		createProduct(
			data: {
				name: $name
				description: $description
				price: $price
				status: "Available"
				photo: { create: { image: $image, altText: $name } }
			}
		) {
			id
			price
			description
			name
		}
	}
`;

export default function CreateProduct() {
	const { inputs, handleChange, resetForm, clearForm } = useForm({
		image: '',
		name: 'Nice Shoes!',
		price: 20,
		description: 'These are the best shoes',
	});

	const [createProduct, { loading, error, data }] = useMutation(
		CREATE_PRODUCT_MUTATION,
		{
			variables: inputs,
			refetchQueries: [{ query: ALL_PRODUCTS_QUERY }], // can also pass variables
		}
	);

	// console.log(createProduct);
	return (
		<Form
			onSubmit={async (e) => {
				e.preventDefault();
				console.log(inputs);
				try {
					// Submit the input fields to the backend:
					// const res = await createProduct(); // This is the same as 'data'
					await createProduct();
					console.log(data);
					clearForm();
					// Go to that product's page
					Router.push({
						pathname: `/product/${data.createProduct.id}`,
					});
				} catch (error) {
					console.log(error);
				}
			}}
		>
			<DisplayError error={error} />
			<fieldset disabled={loading} aria-busy={loading}>
				<label htmlFor="image">
					Image
					<input
						required
						type="file"
						name="image"
						id="image"
						onChange={handleChange}
					/>
				</label>
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
				<button type="submit">+Add Product</button>
			</fieldset>
		</Form>
	);
}
