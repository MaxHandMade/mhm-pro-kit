/**
 * Small decorative inline icons for the license views (aria-hidden).
 */
const PATHS = {
	key: (
		<>
			<circle cx="8" cy="15" r="4" />
			<path d="M10.8 12.2L20 3M16 7l3 3M14 9l2 2" />
		</>
	),
	refresh: (
		<>
			<path d="M21 12a9 9 0 1 1-3-6.7L21 8" />
			<path d="M21 3v5h-5" />
		</>
	),
	chat: (
		<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.9A8 8 0 1 1 21 12z" />
	),
	star: (
		<path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z" />
	),
	check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
	shield: (
		<>
			<path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6z" />
			<path d="M8.5 12.2l2.4 2.4 4.6-4.8" />
		</>
	),
	shieldAlert: (
		<>
			<path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6z" />
			<path d="M12 9v3M12 15.5h.01" />
		</>
	),
	clock: (
		<>
			<circle cx="12" cy="13" r="8" />
			<path d="M12 9v4l2.5 2M9 2h6" />
		</>
	),
	clockAlert: (
		<>
			<circle cx="12" cy="13" r="8" />
			<path d="M12 9v4M12 16.5h.01M9 2h6" />
		</>
	),
	pause: (
		<>
			<rect x="6" y="5" width="4" height="14" rx="1" />
			<rect x="14" y="5" width="4" height="14" rx="1" />
		</>
	),
	offline: (
		<path d="M2 8.5a15 15 0 0 1 20 0M5.5 12a10 10 0 0 1 13 0M9 15.5a5 5 0 0 1 6 0M12 19h.01M3 3l18 18" />
	),
	external: (
		<>
			<path d="M14 4h6v6M20 4l-9 9" />
			<path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
		</>
	),
	cart: (
		<>
			<circle cx="9" cy="20" r="1.4" />
			<circle cx="18" cy="20" r="1.4" />
			<path d="M2 3h3l2.6 12.2a1.5 1.5 0 0 0 1.5 1.2h8.6a1.5 1.5 0 0 0 1.5-1.2L21 7H6" />
		</>
	),
	download: <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />,
};

export default function Icon( { name, size = 20 } ) {
	return (
		<svg
			width={ size }
			height={ size }
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			focusable="false"
		>
			{ PATHS[ name ] }
		</svg>
	);
}
