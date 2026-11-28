/**
 * @jest-environment node
 *
 * 0.2.3 (break-ui, Rentiva Pro German text, 320px). A: the help cards set the
 * icon beside a long title; at 320px "Der Schlüssel ist gespeichert, …" drew
 * in a 153px column, seven lines. The head wraps: the title keeps 12em or goes
 * under the icon. D: the key field (17px monospace, 0.08em tracking, ~11.5px a
 * character) ran a 30-character key 121px past a 211px field at 320px (a
 * 19-character one fitted); in a panel under 480px it uses a tighter type.
 */
const { join } = require( 'node:path' );
// eslint-disable-next-line import/no-extraneous-dependencies -- dev-only, ships with @wordpress/scripts.
const sass = require( 'sass' );

const css = sass.compile(
	join( __dirname, '..', 'src-react', 'license-panel.scss' )
).css;

const bodyOf = ( source, selector ) =>
	[ ...source.matchAll( /([^{}]+)\{([^{}]*)\}/g ) ]
		.filter( ( m ) =>
			m[ 1 ]
				.split( ',' )
				.map( ( s ) => s.trim() )
				.includes( selector )
		)
		.map( ( m ) => m[ 2 ] )
		.join( ';' );

test( 'help card head wraps and the title keeps 12em beside the icon or goes under it', () => {
	expect( bodyOf( css, '.mhmprokit-lic-help__head' ) ).toMatch(
		/flex-wrap:\s*wrap/
	);
	const title = bodyOf( css, '.mhmprokit-lic-help__head h2' );
	expect( title ).toMatch( /flex:\s*1 1 12em/ );
	expect( title ).toMatch( /min-width:\s*0/ );
} );

test( 'a narrow panel draws the key field in a tighter type', () => {
	const block = ( css.match(
		/@container mhmprokit-license \(max-width: 479px\)\s*\{([\s\S]*?)\n\}/
	) || [] )[ 1 ];
	expect( block ).toBeDefined();
	const input = bodyOf( block, '.mhmprokit-lic-form input[type=text]' );
	expect( input ).toMatch( /font-size:\s*15px/ );
	expect( input ).toMatch( /letter-spacing:\s*0/ );
} );
