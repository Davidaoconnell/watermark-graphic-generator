import { z } from 'zod';

export const formSchema = z.object({
	text: z.string()
});

const ScheduleEventSchema = z.object({
	time: z.string(),
	activities: z.array(z.string())
});

const DayScheduleSchema = z.object({
	date: z.string(),
	dayOfWeek: z.string(),
	events: z.array(ScheduleEventSchema)
});

export const WeeklyScheduleSchema = z.object({
	week: z.array(DayScheduleSchema)
});
