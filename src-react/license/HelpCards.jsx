/**
 * Two help cards: "could not verify" (reason unverified) and "offline grace"
 * (grace state, or expired with reason offline).
 */
import CheckButton from './CheckButton';
import Icon from './Icon';
import LinkButton from './LinkButton';

export const GRACE_DAYS = 7;

export function UnverifiedCard( { t, product, busy, onCheck } ) {
	const steps = t( 'unverifiedSteps' );
	return (
		<section
			className="mhmprokit-lic-card mhmprokit-lic-help"
			aria-labelledby="mhmprokit-lic-u-title"
		>
			<div className="mhmprokit-lic-eyebrow">
				{ t( 'unverifiedEyebrow' ) }
			</div>
			<div className="mhmprokit-lic-help__head">
				<span className="mhmprokit-lic-badge mhmprokit-lic-badge--info">
					<Icon name="shieldAlert" size={ 28 } />
				</span>
				<h2 id="mhmprokit-lic-u-title">{ t( 'unverifiedTitle' ) }</h2>
			</div>
			<p>{ t( 'unverifiedText' ) }</p>
			{ Array.isArray( steps ) && steps.length ? (
				<ol>
					{ steps.map( ( step ) => (
						<li key={ step }>{ step }</li>
					) ) }
				</ol>
			) : null }
			<div className="mhmprokit-lic-actions">
				<CheckButton
					label={ t( 'checkNow' ) }
					onCheck={ onCheck }
					busy={ busy }
					primary
				/>
				{ product.supportUrl ? (
					<LinkButton
						href={ product.supportUrl }
						newTab={ t( 'newTab' ) }
					>
						{ t( 'contactSupport' ) }
					</LinkButton>
				) : null }
			</div>
		</section>
	);
}

export function OfflineCard( { t, format, license, busy, onCheck } ) {
	const left = format.daysUntil( license.grace_until );
	const days = Math.max( 0, Math.min( left || 0, GRACE_DAYS ) );
	return (
		<section
			className="mhmprokit-lic-card mhmprokit-lic-help"
			aria-labelledby="mhmprokit-lic-o-title"
		>
			<div className="mhmprokit-lic-eyebrow">
				{ t( 'offlineEyebrow' ) }
			</div>
			<div className="mhmprokit-lic-help__head">
				<span className="mhmprokit-lic-badge mhmprokit-lic-badge--warn">
					<Icon name="offline" size={ 28 } />
				</span>
				<h2 id="mhmprokit-lic-o-title">{ t( 'offlineTitle' ) }</h2>
			</div>
			<p>
				{ left === null
					? t( 'offlineLong' )
					: t( 'offlineStays', left ) }
			</p>
			<div
				role="progressbar"
				aria-label={ t( 'graceLabel' ) }
				aria-valuemin="0"
				aria-valuemax={ GRACE_DAYS }
				aria-valuenow={ days }
				className="mhmprokit-lic-bar mhmprokit-lic-bar--thick"
			>
				<div
					className="mhmprokit-lic-bar__fill mhmprokit-lic-bar__fill--warn"
					style={ { width: `${ ( days / GRACE_DAYS ) * 100 }%` } }
				/>
			</div>
			<div className="mhmprokit-lic-help__meta">
				<span
					title={
						format.dateTime( license.last_check_at ) || undefined
					}
				>
					{ t(
						'lastSuccessful',
						format.relative( license.last_check_at ) || '—'
					) }
				</span>
				<span>{ t( 'graceDays' ) }</span>
			</div>
			<div className="mhmprokit-lic-actions">
				<CheckButton
					label={ t( 'checkNow' ) }
					onCheck={ onCheck }
					busy={ busy }
				/>
			</div>
		</section>
	);
}
