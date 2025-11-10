import type { PageServerLoad } from './$types';
import { schedule } from '$lib/data/schedule';
import OpenAI from 'openai';
import { OPENAI_API_KEY } from '$env/static/private';
export const load = (async () => {
	const client = new OpenAI({
		apiKey: OPENAI_API_KEY
	});

	const response = await client.responses.create({
		model: 'gpt-5',
		input: 'Write a one-sentence bedtime story about a unicorn.'
	});

	console.log(response.output_text);

	return { schedule };
}) satisfies PageServerLoad;

// form on page (sveltekit superforms)
// zod schema to verify client data before it goes into my prompt
// send user prompt to openai to get back my data typed accordingly (provide schema)
