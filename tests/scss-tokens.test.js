/**
 * Colours in the license panel come from ui-core's tokens (the page's
 * .mhmui-admin scope). A hex may appear only as the fallback inside
 * var(--mhmui-..., #hex), the pattern Slotiva's styles use; rgb()/hsl()
 * literals are not allowed at all (rgba() in a token's shadow is ui-core's).
 */
const { readFileSync } = require( 'node:fs' );
const { join } = require( 'node:path' );

const FILE = join( __dirname, '..', 'src-react', 'license-panel.scss' );

function violations( source ) {
	const withoutFallbacks = source.replace(
		/var\(\s*--mhmui-[a-z0-9-]+\s*,\s*#[0-9a-fA-F]{3,8}\s*\)/g,
		'TOKEN'
	);
	return [
		...( withoutFallbacks.match( /#[0-9a-fA-F]{3,8}\b/g ) || [] ),
		...( withoutFallbacks.match( /\b(?:rgb|hsl)a?\(/g ) || [] ),
	];
}

test( 'the gate catches a bare colour and a bare rgb()', () => {
	expect( violations( '.a{color:#fff}' ) ).toEqual( [ '#fff' ] );
	expect( violations( '.a{color:rgb(0,0,0)}' ) ).toEqual( [ 'rgb(' ] );
	expect( violations( '.a{color:var(--mhmui-text, #1d2327)}' ) ).toEqual(
		[]
	);
} );

test( 'license-panel.scss uses tokens only', () => {
	expect( violations( readFileSync( FILE, 'utf8' ) ) ).toEqual( [] );
} );
