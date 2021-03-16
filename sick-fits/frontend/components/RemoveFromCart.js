import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import styled from 'styled-components';
import DisplayError from './ErrorMessage';

const REMOVE_FROM_CART_MUTATION = gql`
	mutation REMOVE_FROM_CART_MUTATION($id: ID!) {
		deleteCartItem(id: $id) {
			id
		}
	}
`;

const BigButton = styled.button`
	font-size: 3rem;
	background: none;
	border: 0;
	&:hover {
		color: var(--red);
		cursor: pointer;
	}
`;

function update(cache, payload) {
	cache.evict(cache.identify(payload.data.deleteCartItem));
}

export default function RemoveFromCart({ id }) {
	const [deleteItem, { loading, error }] = useMutation(
		REMOVE_FROM_CART_MUTATION,
		{
			variables: { id },
			update,
			// optimisticResponse: {
			// 	deleteCartItem: {
			// 		__typename: 'CartItem',
			// 		id,
			// 	},
			// },
		}
	);
	return (
		<>
			<DisplayError error={error} />
			<BigButton
				disabled={loading}
				type="button"
				onClick={deleteItem}
				title="Remove this item from Cart"
			>
				&times;
			</BigButton>
		</>
	);
}
