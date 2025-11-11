import { BASIC_AUTH_PASS, BASIC_AUTH_USER } from '$env/static/private';

export async function handle({ event, resolve }) {
	const authHeader = event.request.headers.get('authorization');

	if (!authHeader || !authHeader.startsWith('Basic ')) {
		return new Response('Unauthorized', {
			status: 401,
			headers: {
				'WWW-Authenticate': 'Basic realm="Secure Area"'
			}
		});
	}

	// Decode the base64 credentials
	const base64Credentials = authHeader.split(' ')[1];
	const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
	const [username, password] = credentials.split(':');

	// Check credentials
	if (username !== BASIC_AUTH_USER || password !== BASIC_AUTH_PASS) {
		return new Response('Unauthorized', {
			status: 401,
			headers: {
				'WWW-Authenticate': 'Basic realm="Secure Area"'
			}
		});
	}

	// User is authenticated, continue
	return resolve(event);
}
