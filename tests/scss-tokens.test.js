/**
 * Colours in the license panel come from ui-core's tokens (the page's
 * .mhmui-admin scope). A hex may appear only as the fallback inside
 * var(--mhmui-..., #hex), the pattern Slotiva's styles use; an rgba() only as
 * the fallback of a --mhmui-shadow-N token (that token's own value). Any other
 * hex, rgb(), rgba(), hsl() or hsla() literal fails.
 */
const { readFileSync } = require( 'node:fs' );
const { join } = require( 'node:path' );

const FILE = join( __dirname, '..', 'src-react', 'license-panel.scss' );

function violations( source ) {
	const withoutFallbacks = source
		.replace( /var\(\s*--mhmui-shadow-[0-9]+\s*,[^;]*\)\)/g, 'TOKEN' )
		.replace(
			/var\(\s*--mhmui-[a-z0-9-]+\s*,\s*#[0-9a-fA-F]{3,8}\s*\)/g,
			'TOKEN'
		);
	return [
		...( withoutFallbacks.match( /#[0-9a-fA-F]{3,8}\b/g ) || [] ),
		...( withoutFallbacks.match( /\b(?:rgb|hsl)a?\(/g ) || [] ),
	];
}

test( 'the gate catches bare colours and lets token fallbacks through', () => {
	expect( violations( '.a{color:#fff}' ) ).toEqual( [ '#fff' ] );
	expect( violations( '.a{color:rgb(0,0,0)}' ) ).toEqual( [ 'rgb(' ] );
	expect( violations( '.a{color:var(--mhmui-text, #1d2327)}' ) ).toEqual(
		[]
	);
	expect(
		violations(
			'.a{box-shadow:var(--mhmui-shadow-1, 0 1px 2px rgba(0, 0, 0, 0.06));}'
		)
	).toEqual( [] );
	expect( violations( '.a{box-shadow:0 1px 2px rgba(0,0,0,.1);}' ) ).toEqual(
		[ 'rgba(' ]
	);
} );

test( 'license-panel.scss uses tokens only', () => {
	expect( violations( readFileSync( FILE, 'utf8' ) ) ).toEqual( [] );
} );
