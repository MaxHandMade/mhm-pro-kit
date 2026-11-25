/**
 * @jest-environment node
 *
 * Shell rhythm (0.2.1). Rentiva Pro draws the panel as a DIRECT child of
 * ui-core's shell (`.mhmui-admin-page`) under a PageHeader; ui-core spaces only
 * its own members there (0,2,0, --mhmui-space-3), so the panel sat 0px under
 * the header (measured in Chrome, 1280px, 2026-11-25). The panel joins the
 * rhythm at the same specificity and token. Outside the shell, or nested in a
 * wrapper (Slotiva Pro's root div), the rule does not match: unchanged there.
 */
const { join } = require( 'node:path' );
// eslint-disable-next-line import/no-extraneous-dependencies -- dev-only, ships with @wordpress/scripts.
const sass = require( 'sass' );

const css = sass.compile(
	join( __dirname, '..', 'src-react', 'license-panel.scss' )
).css;

const SELECTOR = '.mhmui-admin-page > * + .mhmprokit-license';

test( 'the panel is a member of the shell rhythm (same selector shape and token as ui-core)', () => {
	const rules = [ ...css.matchAll( /([^{}]+)\{([^{}]*)\}/g ) ]
		.filter( ( m ) =>
			m[ 1 ]
				.split( ',' )
				.map( ( s ) => s.trim() )
				.includes( SELECTOR )
		)
		.map( ( m ) => m[ 2 ] )
		.join( ';' );
	expect( rules ).toMatch(
		/margin-block-start:\s*var\(--mhmui-space-3(?:,\s*12px)?\)/
	);
} );

test( 'the panel root itself sets no outer margin (the shell spaces it)', () => {
	const own = [ ...css.matchAll( /([^{}]+)\{([^{}]*)\}/g ) ]
		.filter( ( m ) => m[ 1 ].trim() === '.mhmprokit-license' )
		.map( ( m ) => m[ 2 ] )
		.join( ';' );
	expect( own ).not.toMatch( /(?:^|[;\s])margin(?:-[a-z-]+)?\s*:/ );
} );
