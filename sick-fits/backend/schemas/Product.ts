import { integer, relationship, select, text } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';
import { isSignedIn, rules } from '../access';

export const Product = list({
	access: {
		create: isSignedIn,
		read: rules.canReadProducts,
		update: rules.canManageProducts,
		delete: rules.canManageProducts,
	},
	hooks: {
		resolveInput: async ({ operation, originalInput, resolvedData }) => {
			if (operation === 'create') {
				const originalName: string = await originalInput.name;
				const resolvedSlug: string = originalName
					.replace(/(<([^>]+)>)/gi, '')
					.trim()
					.replace(' ', '-')
					.toLowerCase();
				resolvedData.slug = resolvedSlug;
			}
			if (operation === 'update' && originalInput.slug) {
				const originalSlug: string = await originalInput.slug;
				const resolvedSlug = originalSlug
					.replace(/(<([^>]+)>)/gi, '')
					.trim()
					.replace(' ', '-')
					.toLowerCase();
				resolvedData.slug = resolvedSlug;
			}
			return resolvedData;
		},
	},
	fields: {
		name: text({
			isRequired: true,
			isUnique: true,
		}),
		slug: text({
			ui: {
				displayMode: 'input',
				itemView: { fieldmode: 'read' },
				createView: { fieldMode: 'hidden' },
			},
		}),
		description: text({
			ui: {
				displayMode: 'textarea',
			},
		}),
		photo: relationship({
			ref: 'ProductImage.product',
			ui: {
				displayMode: 'cards',
				cardFields: ['image', 'altText'],
				inlineCreate: { fields: ['image', 'altText'] },
				inlineEdit: { fields: ['image', 'altText'] },
			},
		}),
		status: select({
			options: [
				{ label: 'Draft', value: 'draft' },
				{ label: 'Available', value: 'available' },
				{ label: 'Unavailable', value: 'unavailable' },
			],
			defaultValue: 'draft',
			ui: {
				displayMode: 'segmented-control',
				createView: { fieldMode: 'hidden' },
			},
		}),
		price: integer(),
		user: relationship({
			ref: 'User.products',
			defaultValue: ({ context }) => ({
				connect: { id: context.session.itemId },
			}),
		}),
	},
});
