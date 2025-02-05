import { permissionsList } from './schemas/fields';
import { ListAccessArgs } from './types';
// At it's simplest, the access control returns a yes or no value ddepending on the users session
export function isSignedIn({ session }: ListAccessArgs) {
	return !!session;
}

const generatedPermissions = Object.fromEntries(
	permissionsList.map((permission) => [
		permission,
		function ({ session }: ListAccessArgs) {
			return !!session?.data.role?.[permission];
		},
	])
);

// Permissions check if someone meets a criteria - yes or no.
export const permissions = {
	...generatedPermissions,
	isAwesome({ session }: ListAccessArgs) {
		return session?.data.name.includes('wes');
	},
};

// Rule based function
// rules can return a boolean - yes or no- or a filtrer which limits which proucts they can CRUD
export const rules = {
	canManageProducts({ session }: ListAccessArgs) {
		if (!isSignedIn({ session })) {
			return false;
		}
		// 1. Do they have the permission of canManageProducts.
		if (permissions.canManageProducts({ session })) {
			return true;
		}
		// 2. If not, do they own this item?
		return { user: { id: session.itemId } };
	},
	canOrder({ session }: ListAccessArgs) {
		if (!isSignedIn({ session })) {
			return false;
		}
		// 1. Do they have the permission of canManageProducts.
		if (permissions.canManageCart({ session })) {
			return true;
		}
		// 2. If not, do they own this item?
		return { user: { id: session.itemId } };
	},
	canManageOrderItems({ session }: ListAccessArgs) {
		if (!isSignedIn({ session })) {
			return false;
		}
		// 1. Do they have the permission of canManageProducts.
		if (permissions.canManageCart({ session })) {
			return true;
		}
		// 2. If not, do they own this item?
		return { order: { user: { id: session.itemId } } };
	},
	canReadProducts({ session }: ListAccessArgs) {
		// if (!isSignedIn({ session })) {
		// 	return false;
		// }
		if (permissions.canManageProducts({ session })) {
			return true; // They can read everything!
		}
		// They should only see available products (based on the status field)
		return { status: 'available' };
	},
	canManageUsers({ session }: ListAccessArgs) {
		if (!isSignedIn({ session })) {
			return false;
		}
		// 1. Do they have the permission of canManageProducts.
		if (permissions.canManageUsers({ session })) {
			return true;
		}
		// Otherwise they may only update themselves
		return { id: session.itemId };
	},
};
