/**
 * Key entry form. `hero` = the first-run card; `compact` = "Have a different
 * key?" on the expired view. `keyHelp` is a node the consumer builds (a
 * translated sentence holding a link to the account).
 *
 * @param {Object}   props
 * @param {Function} props.t         Text reader (license/text.js).
 * @param {string}   [props.variant] hero | compact.
 * @param {string}   props.value     Current key.
 * @param {Function} props.onChange  Called with the new key.
 * @param {Function} props.onSubmit  Form submit handler.
 * @param {boolean}  props.busy      A request is running.
 */
export default function ActivateForm( {
	t,
	variant = 'hero',
	value,
	onChange = () => {},
	onSubmit = ( event ) => event.preventDefault(),
	busy,
} ) {
	const hero = variant === 'hero';
	const id = `mhmprokit-license-key-${ variant }`;
	const help = hero ? t( 'keyHelp' ) : '';
	return (
		<form
			className={ `mhmprokit-lic-form mhmprokit-lic-form--${ variant }` }
			onSubmit={ onSubmit }
		>
			<label htmlFor={ id } className="mhmprokit-lic-form__label">
				{ hero ? t( 'keyLabel' ) : t( 'newKeyLabel' ) }
			</label>
			<div className="mhmprokit-lic-form__row">
				<input
					id={ id }
					type="text"
					autoComplete="off"
					spellCheck="false"
					maxLength={ 100 }
					placeholder="XXXX-XXXX-XXXX-XXXX"
					value={ value }
					onChange={ ( e ) => onChange( e.target.value ) }
					aria-describedby={ help ? `${ id }-help` : undefined }
				/>
				<button
					type="submit"
					className={ `mhmprokit-lic-btn mhmprokit-lic-btn--${
						hero ? 'primary' : 'outline'
					}` }
					disabled={ busy }
					aria-busy={ busy ? 'true' : undefined }
				>
					{ hero ? t( 'activateHero' ) : t( 'activate' ) }
				</button>
			</div>
			{ help ? (
				<p id={ `${ id }-help` } className="mhmprokit-lic-form__help">
					{ help }
				</p>
			) : null }
		</form>
	);
}
