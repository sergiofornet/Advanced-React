import {
	integer,
	relationship,
	select,
	text,
	virtual,
} from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';
import formatMoney from '../lib/formatMoney';

export const Order = list({
	ui: {
		listView: {
			initialColumns: ['label', 'user', 'total'],
		},
	},
	fields: {
		label: virtual({
			graphQLReturnType: 'String',
			resolver(item) {
				return `WES IS COOL ${formatMoney(item.charge)}`;
			},
		}),
		total: integer(),
		items: relationship({ ref: 'OrderItem.order', many: true }),
		user: relationship({ ref: 'User.orders' }),
		charge: text(),
	},
});
