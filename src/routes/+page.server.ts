import type { PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import OpenAI from 'openai';
import { OPENAI_API_KEY } from '$env/static/private';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { formSchema, WeeklyScheduleSchema } from './schema';
import { zodTextFormat } from 'openai/helpers/zod.mjs';

export const load = (async () => {
	const form = await superValidate(zod4(formSchema));

	// Return form
	return { form };
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod4(formSchema));
		console.log(form);

		if (!form.valid) {
			// Again, return { form } and things will just work.
			return fail(400, { form });
		}

		// form data is valid do the ai stuff
		const client = new OpenAI({
			apiKey: OPENAI_API_KEY
		});

		const response = await client.responses.parse({
			model: 'gpt-5',
			input: form.data.text,
			text: {
				format: zodTextFormat(WeeklyScheduleSchema, 'weekly_schedule')
			}
		});

		// Extract the parsed schedule from the response
		const schedule = response.output_parsed;
		console.log('Extracted schedule:', schedule);

		return message(form, schedule);
	}
};
