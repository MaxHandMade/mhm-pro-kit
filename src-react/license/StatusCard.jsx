/**
 * Status card for a license the site holds: active (green), expiring (amber),
 * expired (red). Extracted from Slotiva af37f05; every string comes from `t`,
 * product links from `product`. `product.features` (optional, Rentiva) draws
 * the "on this site" chips on the active and expiring cards.
 */
import ActivateForm from './ActivateForm';
import CheckButton from './CheckButton';
import Icon from './Icon';
import LinkButton from './LinkButton';

export const PERIOD_DAYS = 365; // Sold yearly only.

function Fact( { label, children } ) {
	return (
		<div className="mhmprokit-lic-facts__item">
			<dt>{ label }</dt>
			<dd>{ children }</dd>
		</div>
	);
}

function Remaining( { t, tone, days, caption } ) {
	if ( days === null || days === undefined ) {
		// No end date known: no number, no bar.
		return (
			<div className="mhmprokit-lic-remaining">
				<div className="mhmprokit-lic-remaining__caption">
					{ t( 'noEndDate' ) }
				</div>
			</div>
		);
	}
	const value = Math.max( 0, Math.min( days, PERIOD_DAYS ) );
	return (
		<div className="mhmprokit-lic-remaining">
			<div className="mhmprokit-lic-remaining__head">
				<div className="mhmprokit-lic-remaining__label">
					{ t( 'timeLeft' ) }
				</div>
				<div className="mhmprokit-lic-remaining__value">
					<span>{ days }</span>{ ' ' }
					<small>{ t( 'dayUnit', days ) }</small>
				</div>
			</div>
			<div
				role="progressbar"
				aria-label={ t( 'periodLabel' ) }
				aria-valuemin="0"
				aria-valuemax={ PERIOD_DAYS }
				aria-valuenow={ value }
				className="mhmprokit-lic-bar"
			>
				<div
					className={ `mhmprokit-lic-bar__fill mhmprokit-lic-bar__fill--${ tone }` }
					style={ { width: `${ ( value / PERIOD_DAYS ) * 100 }%` } }
				/>
			</div>
			<div className="mhmprokit-lic-remaining__caption">{ caption }</div>
		</div>
	);
}

function LastCheck( { format, iso } ) {
	return (
		<span title={ format.dateTime( iso ) || undefined }>
			{ format.relative( iso ) || '—' }
		</span>
	);
}

function Features( { t, items } ) {
	if ( ! Array.isArray( items ) || ! items.length ) {
		return null;
	}
	return (
		<div className="mhmprokit-lic-features">
			<span className="mhmprokit-lic-features__label">
				{ t( 'featuresLabel' ) }
			</span>
			<ul>
				{ items.map( ( item ) => (
					<li key={ item }>
						<Icon name="check" size={ 12 } />
						{ item }
					</li>
				) ) }
			</ul>
		</div>
	);
}

export function Latest( { t, license, product } ) {
	if ( ! license.latest_version ) {
		return null;
	}
	return (
		<div className="mhmprokit-lic-latest" role="status">
			<Icon name="download" size={ 22 } />
			<div className="mhmprokit-lic-latest__text">
				<strong>
					{ t( 'latestTitle', product.name, license.latest_version ) }
				</strong>{ ' ' }
				<span>{ t( 'latestText', license.current_version ) }</span>
			</div>
			<a
				className="mhmprokit-lic-btn mhmprokit-lic-btn--primary mhmprokit-lic-btn--link"
				href={ product.downloadUrl }
				target="_blank"
				rel="noopener noreferrer"
			>
				{ t( 'download', license.latest_version ) }
			</a>
		</div>
	);
}

function ActiveCard( { t, format, license, product, busy, onCheck } ) {
	return (
		<section
			className="mhmprokit-lic-card mhmprokit-lic-status mhmprokit-lic-status--ok"
			aria-labelledby="mhmprokit-lic-title"
		>
			<div className="mhmprokit-lic-status__top">
				<div className="mhmprokit-lic-status__main">
					<span className="mhmprokit-lic-badge mhmprokit-lic-badge--ok">
						<Icon name="shield" size={ 32 } />
					</span>
					<div>
						<div className="mhmprokit-lic-status__titlerow">
							<h2 id="mhmprokit-lic-title">
								{ t( 'activeTitle' ) }
							</h2>
							<span className="mhmprokit-lic-pill mhmprokit-lic-pill--ok">
								{ t( 'activePill' ) }
							</span>
						</div>
						<p>{ t( 'activeText' ) }</p>
					</div>
				</div>
				<Remaining
					t={ t }
					tone="ok"
					days={ license.days_left }
					caption={
						license.expires_at
							? t( 'endsOn', format.date( license.expires_at ) )
							: t( 'noEndDate' )
					}
				/>
			</div>
			<Features t={ t } items={ product.features } />
			<dl className="mhmprokit-lic-facts">
				<Fact label={ t( 'keyFact' ) }>
					<code>{ license.key_masked }</code>
				</Fact>
				<Fact label={ t( 'lastCheckFact' ) }>
					<LastCheck
						format={ format }
						iso={ license.last_check_at }
					/>
					<CheckButton
						label={ t( 'checkNow' ) }
						onCheck={ onCheck }
						busy={ busy }
						small
					/>
				</Fact>
				<Fact label={ t( 'accountFact' ) }>
					<LinkButton
						href={ product.accountUrl }
						newTab={ t( 'newTab' ) }
					>
						{ t( 'accountButton' ) }
					</LinkButton>
					{ t( 'accountHint' ) ? (
						<span className="mhmprokit-lic-facts__hint">
							{ t( 'accountHint' ) }
						</span>
					) : null }
				</Fact>
			</dl>
		</section>
	);
}

function ExpiringCard( { t, format, license, product, busy, onCheck } ) {
	const days = license.days_left || 0;
	return (
		<section
			className="mhmprokit-lic-card mhmprokit-lic-status mhmprokit-lic-status--warn"
			aria-labelledby="mhmprokit-lic-title"
		>
			<div className="mhmprokit-lic-status__top">
				<div className="mhmprokit-lic-status__main">
					<span className="mhmprokit-lic-badge mhmprokit-lic-badge--warn">
						<Icon name="clock" size={ 30 } />
					</span>
					<div>
						<div className="mhmprokit-lic-status__titlerow">
							<h2 id="mhmprokit-lic-title">
								{ t( 'expiringTitle', days ) }
							</h2>
							<span className="mhmprokit-lic-pill mhmprokit-lic-pill--warn">
								{ t( 'expiringPill', days ) }
							</span>
						</div>
						<p>
							{ t(
								'expiringText',
								format.date( license.expires_at )
							) }
						</p>
						<div className="mhmprokit-lic-actions">
							<LinkButton
								href={ product.accountUrl }
								variant="primary"
								newTab={ t( 'newTab' ) }
							>
								{ t( 'manageSubscription' ) }
							</LinkButton>
							{ product.renewHelpUrl ? (
								<LinkButton
									href={ product.renewHelpUrl }
									newTab={ t( 'newTab' ) }
								>
									{ t( 'renewHelp' ) }
								</LinkButton>
							) : null }
							<CheckButton
								label={ t( 'checkNow' ) }
								onCheck={ onCheck }
								busy={ busy }
								small
							/>
						</div>
					</div>
				</div>
				<Remaining
					t={ t }
					tone="warn"
					days={ days }
					caption={ t( 'updatesStayOn' ) }
				/>
			</div>
			<Features t={ t } items={ product.features } />
			<dl className="mhmprokit-lic-facts">
				<Fact label={ t( 'keyFact' ) }>
					<code>{ license.key_masked }</code>
				</Fact>
				<Fact label={ t( 'lastCheckFact' ) }>
					<LastCheck
						format={ format }
						iso={ license.last_check_at }
					/>
				</Fact>
				<Fact label={ t( 'whenItEnds' ) }>
					<span className="mhmprokit-lic-facts__note">
						{ t( 'whenItEndsText' ) }
					</span>
				</Fact>
			</dl>
		</section>
	);
}

function ExpiredCard( { t, format, license, product, busy, onCheck, form } ) {
	const ended = license.reason === 'expired';
	return (
		<>
			<section
				className="mhmprokit-lic-card mhmprokit-lic-status mhmprokit-lic-status--bad"
				aria-labelledby="mhmprokit-lic-title"
			>
				<div className="mhmprokit-lic-expired__top">
					<span className="mhmprokit-lic-badge mhmprokit-lic-badge--bad">
						<Icon name="clockAlert" size={ 30 } />
					</span>
					<div className="mhmprokit-lic-expired__text">
						<div className="mhmprokit-lic-status__titlerow">
							<h2 id="mhmprokit-lic-title">
								{ ended
									? t( 'expiredTitle' )
									: t( 'notActiveTitle' ) }
							</h2>
							<span className="mhmprokit-lic-pill mhmprokit-lic-pill--bad">
								{ t( 'expiredPill' ) }
							</span>
						</div>
						<p>
							{ ended && license.expires_at
								? t(
										'expiredText',
										format.date( license.expires_at )
								  )
								: t( 'notActiveText' ) }
						</p>
					</div>
					<div className="mhmprokit-lic-expired__actions">
						<LinkButton
							href={ product.accountUrl }
							variant="primary"
							newTab={ t( 'newTab' ) }
						>
							{ t( 'renew' ) }
						</LinkButton>
						<CheckButton
							label={ t( 'renewedCheck' ) || t( 'checkNow' ) }
							onCheck={ onCheck }
							busy={ busy }
							small
						/>
					</div>
				</div>
				<div className="mhmprokit-lic-split">
					<div className="mhmprokit-lic-split__item mhmprokit-lic-split__item--ok">
						<Icon name="check" size={ 20 } />
						<div>
							<strong>{ t( 'stillWorking' ) }</strong>
							<span>{ product.stillWorking }</span>
						</div>
					</div>
					<div className="mhmprokit-lic-split__item">
						<Icon name="pause" size={ 20 } />
						<div>
							<strong>{ t( 'paused' ) }</strong>
							<span>{ product.paused }</span>
						</div>
					</div>
				</div>
			</section>
			<section
				className="mhmprokit-lic-card mhmprokit-lic-other"
				aria-labelledby="mhmprokit-lic-other-title"
			>
				<h2 id="mhmprokit-lic-other-title">{ t( 'otherKeyTitle' ) }</h2>
				<ActivateForm t={ t } variant="compact" { ...form } />
			</section>
		</>
	);
}

/**
 * @param {Object} props
 * @param {string} props.view active | expiring | expired.
 */
export default function StatusCard( { view, ...rest } ) {
	return (
		<>
			{ view === 'active' && <ActiveCard { ...rest } /> }
			{ view === 'expiring' && <ExpiringCard { ...rest } /> }
			{ view === 'expired' && <ExpiredCard { ...rest } /> }
		</>
	);
}
