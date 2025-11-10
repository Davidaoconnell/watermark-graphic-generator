// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}

		interface ScheduleEvent {
			time: string;
			activities: string[];
		}

		interface DaySchedule {
			date: string;
			dayOfWeek: string;
			events: ScheduleEvent[];
		}

		interface WeeklySchedule {
			week: DaySchedule[];
		}
	}
}

export {};
