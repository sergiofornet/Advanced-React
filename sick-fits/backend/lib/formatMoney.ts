const formatter = new Intl.NumberFormat('es-ES', {
	style: 'currency',
	currency: 'EUR',
});

export default function formatMoney(cents: number) {
	const dollars = cents / 100;
	return formatter.format(dollars);
}
