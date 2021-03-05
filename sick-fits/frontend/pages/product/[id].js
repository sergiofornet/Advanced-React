import gql from 'graphql-tag';
import SingleProduct from '../../components/SingleProduct';

const SINGLE_ITEM_QUERY = gql`
	query {
		Product(where: { id: "6040b760403ed0082e58d489" }) {
			name
			price
			description
		}
	}
`;

export default function SingleProductPage({ query }) {
	return <SingleProduct id={query.id} />;
}
