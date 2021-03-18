import Link from 'next/link';
import formatMoney from '../lib/formatMoney';
import OrderItemStyles from './styles/OrderItemStyles';

function countItemsInOrder(order) {
	return order.items.reduce((tally, item) => tally + item.quantity, 0);
}

export default function Order({ order }) {
	const items = countItemsInOrder(order);
	const products = order.items.length;
	return (
		<OrderItemStyles>
			<Link href={`/order/${order.id}`}>
				<a>
					<div className="order-meta">
						<p>
							{items} item{items > 1 && 's'}
						</p>
						<p>
							{products} product{products > 1 && 's'}
						</p>
						<p>{formatMoney(order.total)}</p>
					</div>
					<div className="images">
						{order.items.map((item) => (
							<img
								key={item.photo.id}
								src={item.photo?.image?.publicUrlTransformed}
								alt={item.name}
							/>
						))}
					</div>
				</a>
			</Link>
		</OrderItemStyles>
	);
}
