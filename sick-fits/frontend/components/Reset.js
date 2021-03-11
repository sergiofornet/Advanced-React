import { gql, useMutation } from '@apollo/client';
import Form from './styles/Form';
import useForm from '../lib/useForm';
import DisplayError from './ErrorMessage';

const RESET_MUTATION = gql`
	mutation RESET_MUTATION(
		$email: String!
		$password: String!
		$token: String!
	) {
		redeemUserPasswordResetToken(
			email: $email
			token: $token
			password: $password
		) {
			code
			message
		}
	}
`;

export default function Reset({ token }) {
	const { inputs, handleChange, resetForm } = useForm({
		email: '',
		password: '',
		token,
	});
	const [reset, { data, loading, error }] = useMutation(RESET_MUTATION, {
		variables: inputs,
	});
	const successfulError = data?.redeemUserPasswordResetToken?.code
		? data?.redeemUserPasswordResetToken
		: undefined;
	async function handleSubmit(e) {
		e.preventDefault();
		try {
			await reset();
			resetForm();
		} catch (error) {
			console.log(error);
		}
	}
	return (
		<Form method="POST" onSubmit={handleSubmit}>
			<h2>Reset your password</h2>
			<DisplayError error={error || successfulError} />
			<fieldset>
				{data?.redeemUserPasswordResetToken === null && (
					<p>Success! You can now sign in. </p>
				)}

				<label htmlFor="email">
					Email
					<input
						type="email"
						name="email"
						id="email"
						placeholder="Your email address"
						autoComplete="email"
						value={inputs.email}
						onChange={handleChange}
					/>
				</label>
				<label htmlFor="password">
					Password
					<input
						type="password"
						name="password"
						id="password"
						placeholder="Your pa ssword"
						autoComplete="password"
						value={inputs.password}
						onChange={handleChange}
					/>
				</label>

				<button type="submit">Request reset</button>
			</fieldset>
		</Form>
	);
}
