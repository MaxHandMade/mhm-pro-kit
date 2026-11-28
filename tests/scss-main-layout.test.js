/**
 * @jest-environment node
 *
 * First-run view layout (0.2.2). Two columns (key card + 380px "what a license
 * unlocks") used to switch on at a 783px VIEWPORT; between 783 and ~1060px the
 * key field then shrank to 51-168px and a standard XXXX-XXXX-XXXX-XXXX key did
 * not fit (break-ui, Chrome, 2026-11-28; 1024px and 1920px at 200% zoom land
 * there). The panel is now its own inline-size container and the two columns
 * need 900px of PANEL width; below that the view stacks.
 */
const { join } = require( 'node:path' );
// eslint-disable-next-line import/no-extraneous-dependencies -- dev-only, ships with @wordpress/scripts.
const sass = require( 'sass' );

const css = sass.compile(
	join( __dirname, '..', 'src-react', 'license-panel.scss' )
).css;

// Top-level blocks: "@media …", "@container …" or a plain selector, with body.
function blocks( source ) {
	const out = [];
	let depth = 0;
	let start = 0;
	let head = '';
	for ( let i = 0; i < source.length; i++ ) {
		if ( source[ i ] === '{' ) {
			if ( depth === 0 ) {
				head = source.slice( start, i ).trim();
				start = i + 1;
			}
			depth++;
		} else if ( source[ i ] === '}' ) {
			depth--;
			if ( depth === 0 ) {
				out.push( { head, body: source.slice( start, i ) } );
				start = i + 1;
			}
		}
	}
	return out;
}

// Sass keeps /* */ comments; drop them so a block head is only its selector.
const all = blocks( css.replace( /\/\*[\s\S]*?\*\//g, '' ) );
const rulesFor = ( body, selector ) =>
	[ ...body.matchAll( /([^{}]+)\{([^{}]*)\}/g ) ]
		.filter( ( m ) =>
			m[ 1 ]
				.split( ',' )
				.map( ( s ) => s.trim() )
				.includes( selector )
		)
		.map( ( m ) => m[ 2 ] )
		.join( ';' );

test( 'the panel root is an inline-size container', () => {
	const root = all
		.filter( ( b ) => b.head === '.mhmprokit-license' )
		.map( ( b ) => b.body )
		.join( ';' );
	expect( root ).toMatch( /container-type:\s*inline-size/ );
	expect( root ).toMatch( /container-name:\s*mhmprokit-license/ );
} );

test( 'the two-column first-run grid needs 900px of panel width, not a viewport query', () => {
	const grid = all.filter( ( b ) =>
		/display:\s*grid/.test( rulesFor( b.body, '.mhmprokit-lic-main' ) )
	);
	expect( grid.map( ( b ) => b.head ) ).toEqual( [
		'@container mhmprokit-license (min-width: 900px)',
	] );
} );

test( 'below that the first-run view stacks at every viewport width', () => {
	const base = all
		.filter( ( b ) => b.head === '.mhmprokit-lic-main' )
		.map( ( b ) => b.body )
		.join( ';' );
	expect( base ).toMatch( /display:\s*flex/ );
	expect( base ).toMatch( /flex-direction:\s*column/ );
	const inMedia = all
		.filter( ( b ) => b.head.startsWith( '@media' ) )
		.map( ( b ) => rulesFor( b.body, '.mhmprokit-lic-main' ) )
		.join( '' );
	expect( inMedia ).toBe( '' );
} );
