/**
 * LicensePanel, extracted from Slotiva af37f05. The scenarios are Slotiva's own
 * license.test.js, moved from App + mocked REST to the component + props, plus
 * the Rentiva additions (features chips, Lite badge) and the text-map contract.
 */
import { act, render, screen, fireEvent } from '@testing-library/react';

import LicensePanel, { viewFor } from './LicensePanel';

const TEXT = {
	newTab: '(opens in a new tab)',
	checkNow: 'Check now',
	timeLeft: 'Time left',
	dayUnit: ( n ) => ( n === 1 ? 'day' : 'days' ),
	periodLabel: 'License period',
	noEndDate: 'No end date',
	endsOn: ( d ) => `Ends on ${ d }`,
	latestTitle: ( name, v ) => `${ name } ${ v } is out.`,
	latestText: ( v ) => `You have ${ v }.`,
	download: ( v ) => `Download ${ v }`,
	activeTitle: 'License active',
	activePill: 'Updates on',
	activeText: 'This site gets updates and support. Nothing for you to do.',
	featuresLabel: 'On this site',
	keyFact: 'Key',
	lastCheckFact: 'Last check',
	accountFact: 'Account',
	accountButton: 'Your WP Alemi account',
	expiringTitle: 'License ending soon',
	expiringPill: ( n ) => `${ n } days left`,
	expiringText: ( d ) => `Ends on ${ d }.`,
	manageSubscription: 'Manage subscription',
	renewHelp: 'How does renewal work?',
	updatesStayOn: 'Updates stay on for now',
	whenItEnds: 'When it ends',
	whenItEndsText: 'Booking keeps working; only updates and support stop.',
	expiredTitle: 'License expired',
	notActiveTitle: 'License not active',
	expiredPill: 'Updates stopped',
	expiredText: ( d ) => `Ended on ${ d }.`,
	notActiveText: 'This license is not active on this site.',
	renew: 'Renew license',
	stillWorking: 'Still working',
	paused: 'Paused',
	otherKeyTitle: 'Have a different key?',
	newKeyLabel: 'New license key',
	activate: 'Activate',
	activateTitle: 'Activate your license',
	activateText: 'Enter your key to get updates and support.',
	keyLabel: 'License key',
	activateHero: 'Activate license',
	keyHelp: 'The key is in your purchase email.',
	noLicense: 'No license yet?',
	seePlans: 'See plans and pricing',
	givesTitle: 'What a license unlocks',
	unverifiedEyebrow: 'Could not verify',
	unverifiedTitle:
		'The key was accepted but could not be verified on this site',
	unverifiedText: 'Updates are off for now. Booking is not affected.',
	unverifiedSteps: [
		'Press “Check now”.',
		'Deactivate and activate.',
		'Contact support.',
	],
	contactSupport: 'Contact support',
	offlineEyebrow: 'Offline grace period',
	offlineTitle: 'The license server can’t be reached',
	offlineLong:
		'The license server has not been reached for more than 7 days.',
	offlineStays: ( n ) => `Updates stay on for ${ n } more days.`,
	graceLabel: 'Grace period',
	lastSuccessful: ( rel ) => `Last successful check: ${ rel }`,
	graceDays: '7-day grace period',
	moveTitle: 'Move the license to another site',
	moveText:
		'A license works on one site. If you release it here, you can activate the key on another site.',
	moveTextShort:
		'A license works on one site. Leave it here and booking keeps working.',
	deactivate: 'Deactivate on this site',
	deactivateConfirm: 'Remove the license from this site?',
	deactivateYes: 'Yes, deactivate',
	cancel: 'Cancel',
	deactivating: 'Deactivating…',
};

const PRODUCT = {
	name: 'Slotiva',
	accountUrl: 'https://wpalemi.com/account/',
	supportUrl: 'https://wpalemi.com/account/',
	buyUrl: '',
	renewHelpUrl: '',
	downloadUrl: 'https://wpalemi.com/download/mhm-slotiva',
	gives: [ { icon: 'refresh', title: 'Updates', text: 'New versions.' } ],
	worksWithout: {
		title: 'Booking works without a license.',
		text: 'All screens stay open.',
	},
	stillWorking: 'Booking, payments, emails.',
	paused: 'New version notices, downloads and support.',
};

const NONE = {
	state: 'none',
	reason: null,
	key_masked: null,
	expires_at: null,
	days_left: null,
	last_check_at: null,
	latest_version: null,
	current_version: '1.0.0',
	grace_until: null,
};

const ACTIVE = {
	...NONE,
	state: 'active',
	key_masked: 'ABCD-****-****-****',
	expires_at: '2027-06-01T00:00:00Z',
	days_left: 200,
	last_check_at: '2026-11-16T06:00:00Z',
};

const FORMAT = {
	date: ( iso ) => ( iso ? iso.slice( 0, 10 ) : '' ),
	dateTime: ( iso ) => ( iso ? `abs ${ iso }` : '' ),
	relative: ( iso ) => ( iso ? '2 hours ago' : '' ),
	daysUntil: ( iso ) => ( iso ? 5 : null ),
};

function panel( license, extra = {} ) {
	const props = {
		license,
		product: PRODUCT,
		text: TEXT,
		format: FORMAT,
		form: {
			value: '',
			onChange: jest.fn(),
			onSubmit: jest.fn(),
			busy: false,
		},
		onCheck: jest.fn(),
		onDeactivate: jest.fn(),
		...extra,
	};
	const utils = render( <LicensePanel { ...props } /> );
	return { ...utils, props };
}

const headingText = () =>
	screen.getAllByRole( 'heading' ).map( ( h ) => h.textContent );

test( 'view_for_maps_state_and_reason', () => {
	expect( viewFor( NONE ) ).toBe( 'main' );
	expect( viewFor( { state: 'active' } ) ).toBe( 'active' );
	expect( viewFor( { state: 'expiring' } ) ).toBe( 'expiring' );
	expect( viewFor( { state: 'grace' } ) ).toBe( 'offline' );
	expect( viewFor( { state: 'expired', reason: 'unverified' } ) ).toBe(
		'unverified'
	);
	expect( viewFor( { state: 'expired', reason: 'offline' } ) ).toBe(
		'offline'
	);
	expect( viewFor( { state: 'expired', reason: 'expired' } ) ).toBe(
		'expired'
	);
	expect( viewFor( { state: 'expired', reason: 'other' } ) ).toBe(
		'expired'
	);
	expect( viewFor( { state: 'weird' } ) ).toBe( 'main' );
} );

test( 'none_shows_form_and_buy_line_only_with_url_and_no_price', () => {
	const a = panel( NONE );
	expect( screen.getByLabelText( 'License key' ) ).not.toBeNull();
	expect( screen.queryByText( 'No license yet?' ) ).toBeNull();
	expect( screen.queryByText( 'Deactivate on this site' ) ).toBeNull();
	a.unmount();
	const b = panel( NONE, {
		product: { ...PRODUCT, buyUrl: 'https://wpalemi.com/slotiva/' },
	} );
	const plans = screen.getByRole( 'link', { name: /See plans and pricing/ } );
	expect( plans.getAttribute( 'href' ) ).toBe(
		'https://wpalemi.com/slotiva/'
	);
	expect( b.container.textContent ).not.toMatch( /[$€₺]\s?\d/ );
} );

test( 'activate_form_submits_through_the_consumer', () => {
	const { props } = panel( NONE );
	fireEvent.change( screen.getByLabelText( 'License key' ), {
		target: { value: 'ABCD-EFGH-IJKL-MNOP' },
	} );
	expect( props.form.onChange ).toHaveBeenCalledWith( 'ABCD-EFGH-IJKL-MNOP' );
	fireEvent.submit(
		screen.getByLabelText( 'License key' ).closest( 'form' )
	);
	expect( props.form.onSubmit ).toHaveBeenCalled();
} );

test( 'active_with_latest_version_progress_account_and_deactivate', async () => {
	const { props } = panel( { ...ACTIVE, latest_version: '1.2.0' } );
	expect( screen.getByText( 'Slotiva 1.2.0 is out.' ) ).not.toBeNull();
	expect(
		screen
			.getByRole( 'link', { name: /^Download 1.2.0/ } )
			.getAttribute( 'href' )
	).toBe( 'https://wpalemi.com/download/mhm-slotiva' );
	expect(
		screen.getByRole( 'progressbar' ).getAttribute( 'aria-valuenow' )
	).toBe( '200' );
	expect(
		screen
			.getByRole( 'link', { name: /Your WP Alemi account/ } )
			.getAttribute( 'href' )
	).toBe( 'https://wpalemi.com/account/' );
	fireEvent.click(
		screen.getByRole( 'button', { name: 'Deactivate on this site' } )
	);
	expect( props.onDeactivate ).not.toHaveBeenCalled();
	await act( async () => {
		fireEvent.click(
			screen.getByRole( 'button', { name: 'Yes, deactivate' } )
		);
	} );
	expect( props.onDeactivate ).toHaveBeenCalled();
} );

test( 'active_check_now_calls_the_consumer', () => {
	const { props } = panel( ACTIVE );
	fireEvent.click( screen.getByRole( 'button', { name: 'Check now' } ) );
	expect( props.onCheck ).toHaveBeenCalled();
} );

test( 'expiring_shows_manage_subscription_as_new_tab_primary_button', () => {
	panel( { ...ACTIVE, state: 'expiring', days_left: 9 } );
	expect( screen.getByText( '9 days left' ) ).not.toBeNull();
	const manage = screen.getByRole( 'link', {
		name: /^Manage subscription\s*\(opens in a new tab\)/,
	} );
	expect( manage.getAttribute( 'href' ) ).toBe(
		'https://wpalemi.com/account/'
	);
	expect( manage.className ).toContain( 'mhmprokit-lic-btn--link-primary' );
	expect(
		screen.queryByRole( 'link', { name: /How does renewal work/ } )
	).toBeNull();
} );

test( 'expiring_renewal_help_only_when_configured', () => {
	panel(
		{ ...ACTIVE, state: 'expiring', days_left: 9 },
		{
			product: { ...PRODUCT, renewHelpUrl: 'https://wpalemi.com/renew/' },
		}
	);
	expect(
		screen.getByRole( 'link', { name: /How does renewal work/ } )
	).not.toBeNull();
} );

test( 'expired_renew_check_split_and_other_key', () => {
	const { props } = panel( {
		...ACTIVE,
		state: 'expired',
		reason: 'expired',
	} );
	expect( headingText() ).toContain( 'License expired' );
	expect( screen.getByText( 'Updates stopped' ) ).not.toBeNull();
	expect(
		screen
			.getByRole( 'link', {
				name: /^Renew license\s*\(opens in a new tab\)/,
			} )
			.getAttribute( 'href' )
	).toBe( 'https://wpalemi.com/account/' );
	expect( screen.getByText( 'Still working' ) ).not.toBeNull();
	expect( screen.getByText( 'Paused' ) ).not.toBeNull();
	expect( screen.getByLabelText( 'New license key' ) ).not.toBeNull();
	fireEvent.click( screen.getByRole( 'button', { name: 'Check now' } ) );
	expect( props.onCheck ).toHaveBeenCalled();
} );

test( 'expired_for_another_reason_says_not_active', () => {
	panel( { ...ACTIVE, state: 'expired', reason: 'revoked' } );
	expect( headingText() ).toContain( 'License not active' );
	expect(
		screen.getByText( 'This license is not active on this site.' )
	).not.toBeNull();
} );

test( 'unverified_lists_the_steps_and_support', () => {
	panel( { ...ACTIVE, state: 'expired', reason: 'unverified' } );
	expect( headingText() ).toContain(
		'The key was accepted but could not be verified on this site'
	);
	expect( screen.getAllByRole( 'listitem' ) ).toHaveLength( 3 );
	expect(
		screen.getByRole( 'button', { name: 'Check now' } )
	).not.toBeNull();
} );

test( 'grace_shows_remaining_days_and_last_successful_check', () => {
	panel( { ...ACTIVE, state: 'grace', grace_until: '2026-11-20T00:00:00Z' } );
	expect( headingText() ).toContain( 'The license server can’t be reached' );
	expect(
		screen.getByText( 'Updates stay on for 5 more days.' )
	).not.toBeNull();
	expect(
		screen.getByRole( 'progressbar' ).getAttribute( 'aria-valuenow' )
	).toBe( '5' );
	expect(
		screen.getByText( 'Last successful check: 2 hours ago' )
	).not.toBeNull();
} );

test( 'offline_after_grace_has_no_date_so_long_text_and_empty_bar', () => {
	panel(
		{ ...ACTIVE, state: 'expired', reason: 'offline' },
		{
			format: { ...FORMAT, daysUntil: () => null },
		}
	);
	expect( screen.getByText( /more than 7 days/ ) ).not.toBeNull();
	expect(
		screen.getByRole( 'progressbar' ).getAttribute( 'aria-valuenow' )
	).toBe( '0' );
} );

test.each( [
	[ 'expired', { state: 'expired', reason: 'expired' } ],
	[ 'unverified', { state: 'expired', reason: 'unverified' } ],
	[ 'offline', { state: 'grace', grace_until: '2026-11-20T00:00:00Z' } ],
	[ 'offline_after_grace', { state: 'expired', reason: 'offline' } ],
	[ 'expiring', { state: 'expiring', days_left: 9 } ],
] )( 'deactivate_reachable_in_%s', async ( name, over ) => {
	const { props } = panel( { ...ACTIVE, ...over } );
	fireEvent.click(
		screen.getByRole( 'button', { name: 'Deactivate on this site' } )
	);
	await act( async () => {
		fireEvent.click(
			screen.getByRole( 'button', { name: 'Yes, deactivate' } )
		);
	} );
	expect( props.onDeactivate ).toHaveBeenCalled();
} );

test( 'new_version_strip_shown_in_grace', () => {
	panel( {
		...ACTIVE,
		state: 'grace',
		grace_until: '2026-11-20T00:00:00Z',
		latest_version: '1.3.0',
	} );
	expect( screen.getByText( 'Slotiva 1.3.0 is out.' ) ).not.toBeNull();
	expect(
		screen.getByRole( 'link', { name: /^Download 1.3.0/ } )
	).not.toBeNull();
} );

test( 'last_check_is_relative_with_absolute_title', () => {
	panel( ACTIVE );
	const rel = screen.getByText( '2 hours ago' );
	expect( rel.getAttribute( 'title' ) ).toBe( 'abs 2026-11-16T06:00:00Z' );
} );

test( 'no_end_date_hides_number_and_bar', () => {
	panel( { ...ACTIVE, days_left: null, expires_at: null } );
	expect( screen.getAllByText( 'No end date' ).length ).toBeGreaterThan( 0 );
	expect( screen.queryByRole( 'progressbar' ) ).toBeNull();
	expect( screen.queryByText( 'Time left' ) ).toBeNull();
} );

test( 'move_card_prints_both_texts', () => {
	panel( ACTIVE );
	expect(
		screen.getByText( /If you release it here, you can activate the key/ )
	).not.toBeNull();
	expect(
		screen.getByText( /Leave it here and booking keeps working/ )
	).not.toBeNull();
} );

test( 'navigation_actions_are_new_tab_buttons_without_arrows', () => {
	const { container } = panel( {
		...ACTIVE,
		state: 'expired',
		reason: 'unverified',
	} );
	const support = screen.getByRole( 'link', { name: /Contact support/ } );
	expect( support.getAttribute( 'target' ) ).toBe( '_blank' );
	expect( support.getAttribute( 'rel' ) ).toBe( 'noopener noreferrer' );
	expect( support.className ).toContain( 'mhmprokit-lic-btn' );
	expect( support.textContent ).toContain( '(opens in a new tab)' );
	expect( container.textContent ).not.toMatch( /→/ );
} );

test( 'account_fact_is_the_same_small_button_as_check_now', () => {
	panel( ACTIVE );
	const account = screen.getByRole( 'link', {
		name: /Your WP Alemi account/,
	} );
	const check = screen.getByRole( 'button', { name: 'Check now' } );
	expect( account.className ).toContain( 'mhmprokit-lic-btn--small' );
	expect( check.className ).toContain( 'mhmprokit-lic-btn--small' );
} );

// Rentiva additions.

test( 'features_chips_only_when_the_product_lists_them', () => {
	const a = panel( ACTIVE );
	expect( a.container.querySelector( '.mhmprokit-lic-features' ) ).toBeNull();
	a.unmount();
	const b = panel( ACTIVE, {
		product: { ...PRODUCT, features: [ 'Transfer', 'Messages' ] },
	} );
	const chips = b.container.querySelectorAll( '.mhmprokit-lic-features li' );
	expect( Array.from( chips ).map( ( li ) => li.textContent ) ).toEqual( [
		'Transfer',
		'Messages',
	] );
	expect( screen.getByText( 'On this site' ) ).not.toBeNull();
} );

test( 'activate_badge_only_when_given', () => {
	const a = panel( NONE );
	expect(
		a.container.querySelector( '.mhmprokit-lic-hero .mhmprokit-lic-pill' )
	).toBeNull();
	a.unmount();
	panel( NONE, { text: { ...TEXT, activateBadge: 'Lite is running' } } );
	expect( screen.getByText( 'Lite is running' ) ).not.toBeNull();
} );

test( 'a_missing_text_key_prints_nothing', () => {
	const { container } = panel( ACTIVE, {
		text: { activeTitle: 'Only this' },
	} );
	expect( container.textContent ).toContain( 'Only this' );
	expect( container.textContent ).not.toMatch( /undefined|null|\[object/ );
} );

test( 'progress_is_clamped_to_the_period', () => {
	const a = panel( { ...ACTIVE, days_left: 400 } );
	expect(
		screen.getByRole( 'progressbar' ).getAttribute( 'aria-valuenow' )
	).toBe( '365' );
	a.unmount();
	panel( { ...ACTIVE, days_left: -3 } );
	expect(
		screen.getByRole( 'progressbar' ).getAttribute( 'aria-valuenow' )
	).toBe( '0' );
} );

test( 'gives_icon_may_be_a_node_for_product_specific_icons', () => {
	const { container } = panel( NONE, {
		product: {
			...PRODUCT,
			gives: [
				{
					icon: <svg data-testid="own-icon" aria-hidden="true" />,
					title: 'Transfer',
					text: 'Airport transfers.',
				},
			],
		},
	} );
	expect(
		container.querySelector(
			'.mhmprokit-lic-gives__icon [data-testid="own-icon"]'
		)
	).not.toBeNull();
} );

test( 'account_hint_under_the_account_button_only_when_given', () => {
	const a = panel( ACTIVE );
	expect(
		a.container.querySelector( '.mhmprokit-lic-facts__hint' )
	).toBeNull();
	a.unmount();
	const b = panel( ACTIVE, {
		text: { ...TEXT, accountHint: 'Payment method, plan, renewal' },
	} );
	expect(
		b.container.querySelector( '.mhmprokit-lic-facts__hint' ).textContent
	).toBe( 'Payment method, plan, renewal' );
} );

test( 'typing_without_a_form_prop_does_not_throw', () => {
	render(
		<LicensePanel license={ NONE } product={ PRODUCT } text={ TEXT } />
	);
	expect( () =>
		fireEvent.change( screen.getByLabelText( 'License key' ), {
			target: { value: 'X' },
		} )
	).not.toThrow();
} );

test( 'grace_bar_never_goes_below_zero', () => {
	panel(
		{ ...ACTIVE, state: 'grace', grace_until: '2026-11-20T00:00:00Z' },
		{
			format: { ...FORMAT, daysUntil: () => -2 },
		}
	);
	expect(
		screen.getByRole( 'progressbar' ).getAttribute( 'aria-valuenow' )
	).toBe( '0' );
} );

test( 'download_in_the_new_version_strip_is_a_primary_new_tab_button', () => {
	panel( { ...ACTIVE, latest_version: '1.2.0' } );
	const link = screen.getByRole( 'link', { name: /^Download 1\.2\.0/ } );
	expect( link.className ).toContain( 'mhmprokit-lic-btn--link-primary' );
	expect( link.getAttribute( 'target' ) ).toBe( '_blank' );
	expect( link.getAttribute( 'rel' ) ).toBe( 'noopener noreferrer' );
	expect( link.textContent ).toContain( '(opens in a new tab)' );
} );
