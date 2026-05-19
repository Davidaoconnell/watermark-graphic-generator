import type { PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import OpenAI from 'openai';
import { OPENAI_API_KEY, AZURE_OPEN_AI_BASE_URL } from '$env/static/private';
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
			apiKey: OPENAI_API_KEY,
			baseURL:AZURE_OPEN_AI_BASE_URL
		});

		const response = await client.responses.parse({
			model: 'gpt-chat-latest',
			input: `Convert the pasted weekly schedule into the requested JSON schema.

Rules:
- Preserve the event order exactly as it appears within each day.
- If a line is an event or notice without a time, include it as an event with an empty time string.
- Cancellation notices such as "ELECTION DAY-ALL PROGRAMS CANCELED" must be preserved as activities even when they have no time.
- Put each schedule line into the correct day.
- Keep activity wording faithful to the source text.

Schedule text:
${form.data.text}`,
			text: {
				format: zodTextFormat(WeeklyScheduleSchema, 'weekly_schedule')
			}
		});

		// Extract the parsed schedule from the response
		const schedule = {
			week:
				response.output_parsed?.week.map((day) => ({
					...day,
					events: day.events.map((event) => ({
						time: event.time?.trim() ?? '',
						activities: event.activities.map((activity) => activity.trim()).filter(Boolean)
					}))
				})) ?? []
		};
		console.log('Extracted schedule:', schedule);

		return message(form, schedule);
	}
};
