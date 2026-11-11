/**
 * Which license view to show (pure; state/reason in, view id out). Kept apart from rendering; extracted from Slotiva af37f05 into mhm/pro-kit,
 * where Rentiva Pro produces the same body from its own state.
 *
 * @param {Object} license GET /license body.
 * @return {'main'|'active'|'expiring'|'expired'|'unverified'|'offline'} View id.
 */
export function viewFor( license ) {
	switch ( license.state ) {
		case 'active':
			return 'active';
		case 'expiring':
			return 'expiring';
		case 'grace':
			return 'offline';
		case 'expired':
			if ( license.reason === 'unverified' ) {
				return 'unverified';
			}
			return license.reason === 'offline' ? 'offline' : 'expired';
		default:
			return 'main';
	}
}
