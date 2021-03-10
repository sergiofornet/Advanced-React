import { gql, useMutation } from '@apollo/client';
import Form from './styles/Form';
import useForm from '../lib/useForm';
import DisplayError from './ErrorMessage';

const SIGNUP_MUTATION = gql`
	mutation SIGNUP_MUTATION(
		$email: String!
		$name: String!
		$password: String!
	) {
		createUser(data: { email: $email, name: $name, password: $password }) {
			id
			email
			name
		}
	}
`;

export default function SignUp() {
	const { inputs, handleChange, resetForm } = useForm({
		email: '',
		name: '',
		password: '',
	});
	const [signup, { data, error, loading }] = useMutation(SIGNUP_MUTATION, {
		variables: inputs,
	});
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
			<h2>Sign up for an account</h2>
			<DisplayError error={error} />
			<fieldset>
				{data?.createUser && (
					<p>
						Signed up with {data.createUser.email} - Please go ahead
						and sign in!
					</p>
				)}
				<label htmlFor="name">
					Name
					<input
						type="text"
						name="name"
						id="name"
						placeholder="Your name"
						autoComplete="name"
						value={inputs.name}
						onChange={handleChange}
					/>
				</label>
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
				<label htmlFor="email">
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
				<button type="submit">Sign In!</button>
			</fieldset>
		</Form>
	);
}
