/**
 * Navigation action drawn as a button (kit rule, user 2026-11-11: every navigation
 * action on the license screen looks like the secondary "Check now" button; the
 * main action of a card may be `primary`). Stays a real link; it opens in a new
 * tab, so it carries the external-link icon and screen-reader text. No arrows.
 * No usable `href` (empty, blank or "#") draws nothing: never a dead link.
 */
import Icon from './Icon';

/**
 * A URL the consumer actually set: not empty, not blank, not a bare "#".
 *
 * @param {string} [url] Consumer URL.
 * @return {boolean} Whether a link to it can be drawn.
 */
export function usableUrl( url ) {
	const trimmed = typeof url === 'string' ? url.trim() : '';
	return trimmed !== '' && trimmed !== '#';
}

export default function LinkButton( {
	href,
	variant = 'outline',
	newTab,
	children,
} ) {
	if ( ! usableUrl( href ) ) {
		return null;
	}
	return (
		<a
			className={ `mhmprokit-lic-btn mhmprokit-lic-btn--small mhmprokit-lic-btn--link-${ variant }` }
			href={ href }
			target="_blank"
			rel="noopener noreferrer"
		>
			{ children }
			<Icon name="external" size={ 14 } />
			{ newTab ? (
				<span className="screen-reader-text"> { newTab }</span>
			) : null }
		</a>
	);
}
