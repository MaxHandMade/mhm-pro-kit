/**
 * @jest-environment node
 *
 * Hover contrast on primary link buttons. The base rule
 * `.mhmprokit-lic-btn:hover:not(:disabled)` (specificity 0,3,0) turns text
 * dark blue; a primary link button's own hover must match that specificity
 * or it loses, and the text sits dark-on-dark: measured in Chrome on 0.1.1's
 * first cut (color = background = rgb(19, 94, 150)), found by Fable. Jest
 * stubs styles and the SCSS gates read colours, not cascades, so this test
 * compiles the SCSS and checks the selector the fix depends on.
 */
const { join } = require( 'node:path' );
// eslint-disable-next-line import/no-extraneous-dependencies -- dev-only, ships with @wordpress/scripts.
const sass = require( 'sass' );

const css = sass.compile(
	join( __dirname, '..', 'src-react', 'license-panel.scss' )
).css;

function rulesFor( selector ) {
	return [ ...css.matchAll( /([^{}]+)\{([^{}]*)\}/g ) ]
		.filter( ( m ) =>
			m[ 1 ]
				.split( ',' )
				.map( ( s ) => s.trim() )
				.includes( selector )
		)
		.map( ( m ) => m[ 2 ] );
}

test( 'primary link button keeps light text on hover at the base rule specificity', () => {
	const rules = rulesFor(
		'.mhmprokit-lic-btn--link-primary:hover:not(:disabled)'
	).join( ';' );
	expect( rules ).toContain( 'color: var(--lic-on-primary)' );
	expect( rules ).toContain( 'background: var(--lic-primary-dark)' );
} );
