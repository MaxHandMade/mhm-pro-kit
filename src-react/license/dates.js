/**
 * Date helpers for the license views (UTC dates from the REST body; shown in the admin language).
 */
import { dateI18n, getSettings, humanTimeDiff } from '@wordpress/date';

function locale() {
	return (
		( typeof document !== 'undefined' && document.documentElement.lang ) ||
		undefined
	);
}

export function formatDate( iso ) {
	if ( ! iso ) {
		return '';
	}
	try {
		return new Intl.DateTimeFormat( locale(), {
			dateStyle: 'long',
			timeZone: 'UTC',
		} ).format( new Date( iso ) );
	} catch ( e ) {
		return iso.slice( 0, 10 );
	}
}

/**
 * Absolute date and time in the SITE timezone (not the browser's), in the site's date/time format.
 *
 * @param {string|null} iso ISO timestamp.
 * @return {string} Text.
 */
export function formatDateTime( iso ) {
	if ( ! iso ) {
		return '';
	}
	try {
		const { formats } = getSettings();
		return dateI18n( formats.datetime || 'F j, Y g:i a', iso );
	} catch ( e ) {
		return iso.slice( 0, 10 );
	}
}

/**
 * "2 hours ago" (site language; core wp-date).
 *
 * @param {string|null} iso ISO timestamp.
 * @return {string} Text.
 */
export function relativeTime( iso ) {
	if ( ! iso ) {
		return '';
	}
	try {
		return humanTimeDiff( iso );
	} catch ( e ) {
		return formatDateTime( iso );
	}
}

/**
 * Whole days from now until `iso` (rounded up, never below 0); null when there is no date.
 *
 * @param {string|null} iso ISO timestamp.
 * @return {number|null} Days.
 */
export function daysUntil( iso ) {
	if ( ! iso ) {
		return null;
	}
	const ms = new Date( iso ).getTime() - Date.now();
	return Number.isNaN( ms )
		? null
		: Math.max( 0, Math.ceil( ms / 86400000 ) );
}
