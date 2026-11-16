/**
 * Two packaging promises no other test sees.
 *
 * 1. Every stylesheet src-react/ imports for its side effect is listed in
 *    package.json "sideEffects". Without it webpack (in the CONSUMER's build)
 *    marks the file side-effect free and drops it: 0.1.0's first cut listed
 *    only "*.css", the panel imports a .scss, and a consumer-layout build
 *    emitted no CSS at all (Fable, 2026-11-11). Jest stubs styles and the
 *    visual harness compiles the SCSS directly, so only this test would notice.
 *
 * 2. The shipped surface is an ALLOWLIST: what `git archive` gives a consumer
 *    (composer installs it into vendor/mhm/pro-kit) is exactly this list. A
 *    new tracked file that is neither export-ignored nor listed here turns
 *    this red, so nothing reaches consumers by accident.
 */
const { execSync } = require( 'node:child_process' );
const { readFileSync, readdirSync, statSync } = require( 'node:fs' );
const { join } = require( 'node:path' );

const ROOT = join( __dirname, '..' );

function sourceFiles( dir ) {
	return readdirSync( dir ).flatMap( ( name ) => {
		const path = join( dir, name );
		return statSync( path ).isDirectory() ? sourceFiles( path ) : [ path ];
	} );
}

function sideEffectGlobsCover( globs, file ) {
	// webpack turns a slash-less glob into **/<glob>; only extension globs are used here.
	return globs.some(
		( g ) => g.startsWith( '*.' ) && file.endsWith( g.slice( 1 ) )
	);
}

function importedStyles( source ) {
	// Any `import '…'`, `import(…)`, `… from '…'` or `require(…)` naming a
	// .css/.scss/.sass/.less (any quote, optional ?query), anywhere on a line.
	// Comments are dropped first; a `//` right after ":" (a URL) is kept.
	const code = source
		.replace( /\/\*[\s\S]*?\*\//g, '' )
		.replace( /(^|[^:])\/\/.*$/gm, '$1' );
	const pattern =
		/(?:\bimport\s*\(?|\bfrom|\brequire\s*\()\s*(['"`])([^'"`?]+\.(?:css|s[ac]ss|less))(?:\?[^'"`]*)?\1/g;
	return [ ...code.matchAll( pattern ) ].map( ( m ) => m[ 2 ] );
}

test( 'the stylesheet finder sees every way a stylesheet is pulled in (0.2.0)', () => {
	// 0.1 saw only `import '….(s)css';`; any other spelling slipped past the gate.
	const source = [
		"import './a.scss';",
		'import "./b.css";',
		"import './c.sass'",
		"import styles from './d.module.css';",
		"require( './e.less' );",
		"const f = require('./f.scss');",
		"import Icon from './Icon';",
		"// import './commented.css';",
	].join( '\n' );
	expect( importedStyles( source ).sort() ).toEqual(
		[
			'./a.scss',
			'./b.css',
			'./c.sass',
			'./d.module.css',
			'./e.less',
			'./f.scss',
		].sort()
	);
} );

test( 'the stylesheet finder sees the spellings Fable found missing (0.2.0)', () => {
	const source = [
		"const lazy = import( './g.scss' );",
		"await import('./h.css');",
		"if ( x ) { require( './i.css' ); }",
		"const { a } = require( './j.scss' );",
		"export * from './k.scss';",
		"import a from './a'; import './l.scss';",
		"import './m.scss?inline';",
		'require( `./n.css` );',
		"/* import './block-comment.css'; */",
		'/*',
		" import './multi-line-comment.css';",
		' */',
		"const url = 'https://example.com/x'; // import './trailing.css';",
	].join( '\n' );
	expect( importedStyles( source ).sort() ).toEqual(
		[
			'./g.scss',
			'./h.css',
			'./i.css',
			'./j.scss',
			'./k.scss',
			'./l.scss',
			'./m.scss',
			'./n.css',
		].sort()
	);
} );

test( 'the sideEffects check itself: *.css does not cover a .scss import', () => {
	expect( sideEffectGlobsCover( [ '*.css' ], 'license-panel.scss' ) ).toBe(
		false
	);
	expect(
		sideEffectGlobsCover( [ '*.css', '*.scss' ], 'license-panel.scss' )
	).toBe( true );
} );

test( 'every stylesheet src-react imports is listed in sideEffects', () => {
	const globs = JSON.parse(
		readFileSync( join( ROOT, 'package.json' ), 'utf8' )
	).sideEffects;
	const imported = sourceFiles( join( ROOT, 'src-react' ) )
		.filter( ( f ) => /\.jsx?$/.test( f ) && ! /\.test\.jsx?$/.test( f ) )
		.flatMap( ( f ) => importedStyles( readFileSync( f, 'utf8' ) ) );
	expect( imported.length ).toBeGreaterThan( 0 );
	for ( const file of imported ) {
		expect( [ file, sideEffectGlobsCover( globs, file ) ] ).toEqual( [
			file,
			true,
		] );
	}
} );

const SHIPPED = [
	'LICENSE',
	'README.md',
	'composer.json',
	'package.json',
	'src/mask.php',
	'src-react/LicensePanel.jsx',
	'src-react/index.js',
	'src-react/license-panel.scss',
	'src-react/license/ActivateForm.jsx',
	'src-react/license/CheckButton.jsx',
	'src-react/license/HelpCards.jsx',
	'src-react/license/Icon.jsx',
	'src-react/license/LinkButton.jsx',
	'src-react/license/MainView.jsx',
	'src-react/license/MoveCard.jsx',
	'src-react/license/StatusCard.jsx',
	'src-react/license/dates.js',
	'src-react/license/text.js',
	'src-react/license/viewFor.js',
];

test( 'the shipped surface is exactly the allowlist', () => {
	// What Composer installs: `git archive` of the commit (export-ignore applied,
	// directory patterns included -- `git check-attr` does not apply those to the
	// files inside, so it cannot stand in). Measures HEAD: commit, then run.
	const shipped = execSync( 'git archive --format=tar HEAD | tar -t', {
		cwd: ROOT,
		encoding: 'utf8',
	} )
		.split( /\r?\n/ )
		.map( ( l ) => l.trim() )
		.filter( ( l ) => l && ! l.endsWith( '/' ) )
		.sort();
	expect( shipped.length ).toBeGreaterThan( 10 );
	expect( shipped ).toEqual( [ ...SHIPPED ].sort() );
} );
