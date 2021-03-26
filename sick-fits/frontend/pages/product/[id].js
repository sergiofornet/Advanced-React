import SingleProduct from '../../components/SingleProduct';

export default function SingleProductPage({ query }) {
	return <SingleProduct slug={query.id} />;
}
