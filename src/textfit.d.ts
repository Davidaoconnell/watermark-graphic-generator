declare module 'textfit' {
	interface TextFitOptions {
		alignVert?: boolean;
		alignHoriz?: boolean;
		multiLine?: boolean;
		minFontSize?: number;
		maxFontSize?: number;
		reProcess?: boolean;
		widthOnly?: boolean;
		alignVertWithFlexbox?: boolean;
	}

	function textFit(
		elements: HTMLElement | HTMLElement[] | HTMLCollection,
		options?: TextFitOptions
	): void;

	export default textFit;
}
