import { KeystoneContext, SessionStore } from '@keystone-next/types';
import {
	OrderCreateInput,
	UserCreateInput,
	CartItemCreateInput,
} from '../.keystone/schema-types';
import stripeConfig from '../lib/stripe';

interface Arguments {
	token: string;
}

const graphql = String.raw;

async function checkout(
	root: any,
	{ token }: Arguments,
	context: KeystoneContext
): Promise<OrderCreateInput> {
	// 1. Make sure they are signed in.
	const userId = context.session.itemId;
	if (!userId) {
		throw new Error('Sorry! You must be signed in to create an order!');
	}
	/// 1.5 Query the current user.
	const user: UserCreateInput = await context.lists.User.findOne({
		where: { id: userId },
		resolveFields: graphql`
			id
			name
			email
			cart {
				id
				quantity
				product {
					name
					price
					description
					id
					photo {
						id
						image {
							id
							publicUrlTransformed
						}
					}
				}
			}
		`,
	});
	console.dir(user, { depth: null });
	// 2. Calculate the total price.
	const cartItems = user.cart.filter(
		(cartItem: CartItemCreateInput) => cartItem.product
	); // filter out no longer existing products
	const amount = cartItems.reduce(function (
		tally: number,
		cartItem: CartItemCreateInput
	) {
		return tally + cartItem.quantity * cartItem.product.price;
	},
		0);

	console.log(amount);

	// 3. Create charge with the Stripe library.
	const charge = await stripeConfig.paymentIntents
		.create({
			amount,
			currency: 'EUR',
			confirm: true,
			payment_method: token,
		})
		.catch((err) => {
			console.log(err);
			throw new Error(err.message);
		});
	console.log(charge);
	// 4. Convert CartItems to OrderItems.
	const orderItems = cartItems.map((cartItem) => {
		const orderItem = {
			name: cartItem.product.name,
			description: cartItem.product.description,
			price: cartItem.product.price,
			quantity: cartItem.quantity,
			photo: {
				connect: { id: cartItem.product.photo.id },
			},
		};
		return orderItem;
	});
	// 5. Create the order and return it.
	const order = await context.lists.Order.createOne({
		data: {
			total: charge.amount,
			charge: charge.id,
			items: { create: orderItems },
			user: { connect: { id: userId } },
		},
	});
	// 6. Cleanup any old cart item
	const cartItemIds = user.cart.map((cartItem) => cartItem.id);
	await context.lists.CartItem.deleteMany({
		ids: cartItemIds,
	});
	return order;
}

export default checkout;
