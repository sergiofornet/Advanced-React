import { gql, useMutation } from '@apollo/client';
import { CURRENT_USER_QUERY } from './User';

const SIGN_OUT_MUTATION = gql`
	mutation {
		endSession
	}
`;

export default function SignOut({ children }) {
	const [signout] = useMutation(SIGN_OUT_MUTATION, {
		refetchQueries: [{ query: CURRENT_USER_QUERY }],
	});
	return (
		<button type="button" onClick={signout}>
			{children}
		</button>
	);
}
