import { gql, useMutation } from '@apollo/client';
import Form from './styles/Form';
import useForm from '../lib/useForm';
import DisplayError from './ErrorMessage';

const REQUEST_RESET_MUTATION = gql`
	mutation REQUEST_RESET_MUTATION($email: String!) {
		sendUserPasswordResetLink(email: $email) {
			code
			message
		}
	}
`;

export default function RequestReset() {
	const { inputs, handleChange, resetForm } = useForm({
		email: '',
	});
	const [signup, { data, error, loading }] = useMutation(
		REQUEST_RESET_MUTATION,
		{
			variables: inputs,
		}
	);
	async function handleSubmit(e) {
		e.preventDefault();
		try {
			await signup();
			console.log({ data, error, loading });
			resetForm();
		} catch (error) {
			console.log(error);
		}
	}
	return (
		<Form method="POST" onSubmit={handleSubmit}>
			<h2>Lost your password?</h2>
			<DisplayError error={error} />
			<fieldset>
				{data?.sendUserPasswordResetLink === null && (
					<p>Success!! Check your email for a link!</p>
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

				<button type="submit">Request reset</button>
			</fieldset>
		</Form>
	);
}
