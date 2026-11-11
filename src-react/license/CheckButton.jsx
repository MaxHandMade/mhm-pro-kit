import Icon from './Icon';

/**
 * "Check now". `small` = the inline button in the facts row (with the refresh
 * icon); otherwise a full-size primary or outline button (help cards, actions).
 *
 * @param {Object}   props
 * @param {string}   props.label     Button text.
 * @param {Function} props.onCheck   Click handler.
 * @param {boolean}  props.busy      A request is running.
 * @param {boolean}  [props.small]   Inline facts-row size.
 * @param {boolean}  [props.primary] Primary instead of outline.
 */
export default function CheckButton( {
	label,
	onCheck,
	busy,
	small,
	primary,
} ) {
	let variant = primary ? 'primary' : 'outline';
	if ( small ) {
		variant = 'small';
	}
	return (
		<button
			type="button"
			className={ `mhmprokit-lic-btn mhmprokit-lic-btn--${ variant }` }
			onClick={ onCheck }
			disabled={ busy }
			aria-busy={ busy ? 'true' : undefined }
		>
			{ small ? <Icon name="refresh" size={ 14 } /> : null }
			{ label }
		</button>
	);
}
