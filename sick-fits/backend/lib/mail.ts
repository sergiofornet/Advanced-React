import { createTransport, getTestMessageUrl } from 'nodemailer';
import { Envelope } from 'nodemailer/lib/mailer';

const transport = createTransport({
	host: process.env.MAIL_HOST,
	port: process.env.MAIL_PORT,
	auth: {
		user: process.env.MAIL_USER,
		pass: process.env.MAIL_PASS,
	},
});

function makeANiceEmail(text: string): string {
	return `
	<div style="
		border: 1px;
		padding: 20px
		fornt-family: sans-serif;
		line-height: 2;
		font-size: 20px;
	">
		<h2>Hello There!</h2>
		<p>${text}</p>
		<p>😘, Wes Bos</p>
	</div>
	`;
}

export interface MailResponse {
	accepted?: string[] | null;
	rejected?: null[] | null;
	envelopeTime: number;
	messageTime: number;
	messageSize: number;
	response: string;
	envelope: Envelope;
	messageId: string;
}

export async function sendPasswordResetEmail(
	resetToken: string,
	to: string
): Promise<void> {
	// email the user a token
	const info = (await transport.sendMail({
		to,
		from: 'test@example.com',
		subject: 'Your password reset token!',
		html: makeANiceEmail(`Your Password reset token is here!
		
		<a href="${process.env.FRONTEND_URL}/reset?token=${resetToken}">Click here to reset</a>
		`),
	})) as MailResponse;
	if (process.env.MAIL_USER.includes('ethereal.email')) {
		console.log(`💌 Message Sent! Preview at ${getTestMessageUrl(info)}`);
	}
}
