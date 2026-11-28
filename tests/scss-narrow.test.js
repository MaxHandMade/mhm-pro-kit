/**
 * @jest-environment node
 *
 * 0.2.3 (break-ui, Rentiva Pro German text, 320px). A: the help cards set the
 * icon beside a long title; at 320px "Der Schlüssel ist gespeichert, …" drew
 * in a 153px column, seven lines. The head wraps: the title keeps 10.5em
 * beside the icon or goes under it (12em pushed it under at 390px, Fable).
 * D: the key field (17px monospace, 0.08em tracking, ~11.5px a character)
 * ran a 30-character key 121px past a 211px field at 320px (a 19-character
 * one fitted); in a panel under 480px it uses 16px untracked type (not
 * less: iOS Safari zooms into a field under 16px).
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

test( 'help card head wraps and the title keeps 10.5em beside the icon or goes under it', () => {
	expect( bodyOf( css, '.mhmprokit-lic-help__head' ) ).toMatch(
		/flex-wrap:\s*wrap/
	);
	const title = bodyOf( css, '.mhmprokit-lic-help__head h2' );
	expect( title ).toMatch( /flex:\s*1 1 10\.5em/ );
	expect( title ).toMatch( /min-width:\s*0/ );
} );

test( 'a narrow panel draws the key field in a tighter type', () => {
	const block = ( css.match(
		/@container mhmprokit-license \(max-width: 479px\)\s*\{([\s\S]*?)\n\}/
	) || [] )[ 1 ];
	expect( block ).toBeDefined();
	const input = bodyOf( block, '.mhmprokit-lic-form input[type=text]' );
	// 16px: iOS Safari zooms into a field under 16px.
	expect( input ).toMatch( /font-size:\s*16px/ );
	expect( input ).toMatch( /letter-spacing:\s*0/ );
} );

/*
 * House rule (react-admin-ui.md §6b, user-approved 2026-11-28): a text field
 * never gets a font-size under 16px -- iOS Safari zooms the page into a field
 * under 16px on focus. Every compiled rule, inside @container/@media too,
 * whose selector targets a text field (input that is not a checkbox, radio,
 * range, button-like or hidden; textarea; select) is read.
 */
const TEXT_FIELD =
	/(^|[\s>+~(,])(input|textarea|select)(?=$|[\s.:#[>+~),])/;
const NOT_TEXT = /type=["']?(checkbox|radio|range|submit|button|reset|color|file|hidden|image)/;

test( 'no rule gives a text field a font-size under 16px', () => {
	const offenders = [];
	for ( const m of css.matchAll( /([^{}]+)\{([^{}]*)\}/g ) ) {
		const selectors = m[ 1 ]
			.split( ',' )
			.map( ( s ) => s.trim() )
			.filter( ( s ) => TEXT_FIELD.test( s ) && ! NOT_TEXT.test( s ) );
		const size = ( m[ 2 ].match( /font-size:\s*([^;]+)/ ) || [] )[ 1 ];
		if ( ! selectors.length || ! size ) {
			continue;
		}
		const px = /^(\d+(?:\.\d+)?)px$/.exec( size.trim() );
		// A non-px size (em, rem, %, var()) cannot be checked here: flag it.
		if ( ! px || parseFloat( px[ 1 ] ) < 16 ) {
			offenders.push( `${ selectors.join( ', ' ) } { font-size: ${ size } }` );
		}
	}
	expect( offenders ).toEqual( [] );
} );
