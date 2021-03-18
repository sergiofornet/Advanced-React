import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import styled from 'styled-components';
import Head from 'next/head';
import Order from './Order';
import DisplayError from './ErrorMessage';

const ALL_ORDERS_QUERY = gql`
	query {
		orders: allOrders {
			id
			charge
			total
			label
			user {
				id
				name
			}
			items {
				id
				name
				description
				price
				quantity
				photo {
					id
					image {
						publicUrlTransformed
					}
				}
			}
		}
	}
`;

const OrderUl = styled.ul`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
	grid-gap: 4rem;
`;

export default function Orders() {
	const { data, error, loading } = useQuery(ALL_ORDERS_QUERY);
	if (loading) return <p>Loading...</p>;
	if (error) return <DisplayError error={error} />;
	const { orders } = data;
	return (
		<div>
			<Head>
				<title>Your Orders ({orders.length})</title>
			</Head>
			<h2>You have {orders.length} Orders</h2>
			<OrderUl>
				{orders.map((order) => (
					<Order order={order} key={order.id} />
				))}
			</OrderUl>
		</div>
	);
}
