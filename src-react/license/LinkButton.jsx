/**
 * Navigation action drawn as a button (kit rule, user 2026-11-11: every navigation
 * action on the license screen looks like the secondary "Check now" button; the
 * main action of a card may be `primary`). Stays a real link; it opens in a new
 * tab, so it carries the external-link icon and screen-reader text. No arrows.
 */
import Icon from './Icon';

export default function LinkButton( {
	href,
	variant = 'outline',
	newTab,
	children,
} ) {
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
