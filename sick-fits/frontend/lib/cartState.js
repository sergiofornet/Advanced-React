import { createContext, useContext, useState } from 'react';

const LocalStateContext = createContext();
const LocalStateProvider = LocalStateContext.Provider;

function CartStateProvider({ children }) {
	// This is our own custom provider! We will store dat (state)amd fucntionality (updaters) in here and anyone can access it cia the consumer!

	// Closed by default
	const [cartOpen, setCartOpen] = useState(false);

	function toggleCart() {
		setCartOpen(!cartOpen);
	}

	function closeCart() {
		setCartOpen(false);
	}

	function openCart() {
		setCartOpen(true);
	}

	return (
		<LocalStateProvider
			value={{ cartOpen, setCartOpen, toggleCart, closeCart, openCart }}
		>
			{children}
		</LocalStateProvider>
	);
}

// make a custom hook for accesing the cart local state
function useCart() {
	// We use a consumer here to access the local state
	const all = useContext(LocalStateContext);
	return all;
}

export { CartStateProvider, useCart };
