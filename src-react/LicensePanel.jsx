/**
 * The shared Pro license page body (below the consumer's PageHeader and notices).
 * Extracted from Slotiva 1.0.2 (af37f05): one view per state, chosen by the pure
 * `viewFor()`; layout, icons and styles live here, everything product-specific
 * arrives as data.
 *
 * Contract (spec §9):
 * - `license`: the license REST body as Slotiva returns it -- state, reason,
 *   days_left, expires_at, last_check_at, grace_until, key_masked (already masked
 *   on the server with mhmprokit_mask_license_key()), latest_version, current_version.
 * - `product`: name, accountUrl, supportUrl, buyUrl, renewHelpUrl, downloadUrl,
 *   gives[{icon,title,text}], worksWithout{title,text}, stillWorking, paused,
 *   features[] (optional chips on the active/expiring card).
 * - `text`: every visible string, translated by the consumer (this package has no
 *   text domain). Functions for strings with a number or a date. Keys:
 *   newTab, checkNow, timeLeft, dayUnit(n), periodLabel, noEndDate, endsOn(date),
 *   latestTitle(name, version), latestText(installed), download(version),
 *   activeTitle, activePill, activeText, featuresLabel, keyFact, lastCheckFact,
 *   accountFact, accountButton, expiringTitle(n), expiringPill(n), expiringText(date),
 *   manageSubscription, renewHelp, updatesStayOn, whenItEnds, whenItEndsText,
 *   expiredTitle, notActiveTitle, expiredPill, expiredText(date), notActiveText,
 *   renew, renewedCheck, stillWorking, paused, otherKeyTitle, newKeyLabel, activate,
 *   activateTitle, activateBadge, activateText, keyLabel, activateHero, keyHelp (node),
 *   noLicense, seePlans, givesTitle, unverifiedEyebrow, unverifiedTitle,
 *   unverifiedText, unverifiedSteps (string[]), contactSupport, offlineEyebrow,
 *   offlineTitle, offlineLong, offlineStays(days) (node), graceLabel,
 *   lastSuccessful(relative), graceDays, moveTitle, moveText, moveTextShort,
 *   deactivate, deactivateConfirm, deactivateYes, cancel, deactivating.
 *   A missing key prints nothing.
 * - `form`: { value, onChange, onSubmit, busy } for the key field.
 * - `busy`, `onCheck`, `onDeactivate`: the consumer's requests.
 * - `format` (optional): { date, dateTime, relative, daysUntil }; defaults use
 *   the WordPress date package (wp-date) in the site's language and timezone.
 */
import * as dates from './license/dates';
import { OfflineCard, UnverifiedCard } from './license/HelpCards';
import MainView from './license/MainView';
import MoveCard from './license/MoveCard';
import StatusCard, { Latest } from './license/StatusCard';
import { reader } from './license/text';
import { viewFor } from './license/viewFor';
import './license-panel.scss';

export { viewFor };

const DEFAULT_FORMAT = {
	date: dates.formatDate,
	dateTime: dates.formatDateTime,
	relative: dates.relativeTime,
	daysUntil: dates.daysUntil,
};

export default function LicensePanel( {
	license,
	product = {},
	text,
	form = {},
	busy = false,
	onCheck,
	onDeactivate,
	format,
} ) {
	const t = reader( text );
	const fmt = { ...DEFAULT_FORMAT, ...( format || {} ) };
	const view = viewFor( license || {} );
	const shared = { t, format: fmt, license, product, busy, onCheck };

	if ( view === 'main' ) {
		return (
			<div className="mhmprokit-license">
				<MainView t={ t } product={ product } form={ form } />
			</div>
		);
	}

	let card;
	if ( view === 'unverified' ) {
		card = (
			<div className="mhmprokit-lic-pair">
				<UnverifiedCard { ...shared } />
			</div>
		);
	} else if ( view === 'offline' ) {
		card = (
			<div className="mhmprokit-lic-pair">
				<OfflineCard { ...shared } />
			</div>
		);
	} else {
		card = <StatusCard view={ view } form={ form } { ...shared } />;
	}

	// Every view with a stored key: new-version strip on top, move card below.
	return (
		<div className="mhmprokit-license">
			<div className="mhmprokit-lic-stack">
				<Latest t={ t } license={ license } product={ product } />
				{ card }
				<MoveCard t={ t } busy={ busy } onDeactivate={ onDeactivate } />
			</div>
		</div>
	);
}
