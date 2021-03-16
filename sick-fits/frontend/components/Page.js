import PropTypes from 'prop-types';
import styled, { createGlobalStyle } from 'styled-components';
import Header from './Header';

const GlobalStyles = createGlobalStyle`
	@font-face {
		font-family: 'radnika_next';
		src: url('/static/radnikanext-medium-webfont.woff2') 
			 format('woff2');
		font-weight: normal;
		font-style: normal;
	}

	:root {
		--red: #ff0000;
		--black: #393939;
		--grey: #3A3A3A;
		--gray: var(--grey);
		--lightGrey: #e1e1e1;
		--lightGray: var(--lightGrey);
		--offWhite: #ededed;
		--maxWidth: 1000px;
		--bs: 0 13px 24px 0 rgba(0,0,0, 0.09);
		font-size: 62.5%;
		box-sizing: border-box;
	}

	*, *:before,*:after {
		box-sizing: inherit;
	}

	body {
		font-family: 'radnika_next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
		font-size: 1.5rem;
		line-height: 2;
		padding: 0;
		margin: 0;
	}

	a {
		text-decoration: none;
		color: var(--black);
		&:hover {
			text-decoration: underline;
		}
	}

	button {
		font-family: 'radnika_next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
	}
`;

const InnerStyles = styled.div`
	max-width: var(--maxWidth);
	margin: 0 auto;
	padding: 2em;
`;

export default function Page({ children }) {
	return (
		<div>
			<GlobalStyles />
			<Header />
			<InnerStyles>{children}</InnerStyles>
		</div>
	);
}

Page.propTypes = {
	children: PropTypes.any,
};
