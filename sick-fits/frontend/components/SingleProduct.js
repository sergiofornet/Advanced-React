import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import Head from 'next/head';
import styled from 'styled-components';
import DisplayError from './ErrorMessage';

const ProductStyles = styled.div`
	display: grid;
	grid-auto-columns: 1fr;
	grid-auto-flow: column;
	max-width: var(--maxWidth);
	justify-content: center;
	align-items: top;
	gap: 2rem;
	img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
`;

const SINGLE_ITEM_QUERY = gql`
	query SINGLE_ITEM_QUERY($id: ID!) {
		Product(where: { id: $id }) {
			name
			price
			description
			id
			photo {
				id
				altText
				image {
					publicUrlTransformed
				}
			}
		}
	}
`;

const ID_BY_NAME = gql`
	query ID_BY_NAME($slug: String!) {
		allProducts(where: { slug_i: $slug }) {
			name
			id
		}
	}
`;

export default function SingleProduct({ slug }) {
	const { data: idData, loading: idLoading, error: idError } = useQuery(
		ID_BY_NAME,
		{
			variables: { slug },
			fetchPolicy: 'no-cache',
		}
	);
	const productId = idData?.allProducts[0]?.id;
	console.log(productId);
	const { data, loading, error } = useQuery(SINGLE_ITEM_QUERY, {
		skip: !productId,
		variables: { id: productId },
	});
	console.log({ idData, idLoading, idError });
	if (loading) return <p>Loading...</p>;
	if (error) return <DisplayError error={error} />;
	if (idLoading) return <p>Loading...</p>;
	if (idError) return <DisplayError error={idError} />;
	const { Product: product } = data;
	return (
		<ProductStyles>
			<Head>
				<title>Sick Fits | {product.name}</title>
			</Head>
			<img
				src={product.photo.image.publicUrlTransformed}
				alt={product.photo.altText}
			/>
			<div className="details">
				<h2>{product.name}</h2>
				<p>{product.description}</p>
			</div>
		</ProductStyles>
	);
}
