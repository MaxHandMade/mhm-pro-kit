/**
 * Colours in the license panel come from ui-core's tokens (the page's
 * .mhmui-admin scope). A hex may appear only as the fallback inside
 * var(--mhmui-..., #hex), the pattern Slotiva's styles use; an rgba() only as
 * the fallback of a --mhmui-shadow-N token inside a box-/text-shadow
 * declaration (that token's own value). Anything else fails: a hex, any colour
 * function (rgb/rgba/hsl/hsla/hwb/lab/lch/oklab/oklch/color, any case) or a
 * named colour. color-mix() itself is allowed; its arguments are checked.
 */
const { readFileSync } = require( 'node:fs' );
const { join } = require( 'node:path' );

const FILE = join( __dirname, '..', 'src-react', 'license-panel.scss' );

// CSS named colours (CSS Color 4), minus transparent/currentcolor (keywords).
const NAMED = (
	'aliceblue antiquewhite aqua aquamarine azure beige bisque black ' +
	'blanchedalmond blue blueviolet brown burlywood cadetblue chartreuse ' +
	'chocolate coral cornflowerblue cornsilk crimson cyan darkblue darkcyan ' +
	'darkgoldenrod darkgray darkgreen darkgrey darkkhaki darkmagenta ' +
	'darkolivegreen darkorange darkorchid darkred darksalmon darkseagreen ' +
	'darkslateblue darkslategray darkslategrey darkturquoise darkviolet ' +
	'deeppink deepskyblue dimgray dimgrey dodgerblue firebrick floralwhite ' +
	'forestgreen fuchsia gainsboro ghostwhite gold goldenrod gray green ' +
	'greenyellow grey honeydew hotpink indianred indigo ivory khaki lavender ' +
	'lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan ' +
	'lightgoldenrodyellow lightgray lightgreen lightgrey lightpink ' +
	'lightsalmon lightseagreen lightskyblue lightslategray lightslategrey ' +
	'lightsteelblue lightyellow lime limegreen linen magenta maroon ' +
	'mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen ' +
	'mediumslateblue mediumspringgreen mediumturquoise mediumvioletred ' +
	'midnightblue mintcream mistyrose moccasin navajowhite navy oldlace olive ' +
	'olivedrab orange orangered orchid palegoldenrod palegreen ' +
	'paleturquoise palevioletred papayawhip peachpuff peru pink plum ' +
	'powderblue purple rebeccapurple red rosybrown royalblue saddlebrown ' +
	'salmon sandybrown seagreen seashell sienna silver skyblue slateblue ' +
	'slategray slategrey snow springgreen steelblue tan teal thistle tomato ' +
	'turquoise violet wheat white whitesmoke yellow yellowgreen'
).split( ' ' );
const NAMED_RE = new RegExp(
	`(?<![\w-])(?:${ NAMED.join( '|' ) })(?![\w-])`,
	'gi'
);

function violations( source ) {
	const withoutFallbacks = source
		// In a box-/text-shadow declaration: lengths, then exactly one rgba();
		// nothing after it but the closing ")".
		.replace(
			/(?<=(?:box|text)-shadow\s*:[^;{}]*)var\(\s*--mhmui-shadow-[0-9]+\s*,\s*(?:-?[0-9.]+(?:px)?\s+){2,4}rgba\(\s*[0-9.,\s]+\)\s*\)/gi,
			'TOKEN'
		)
		.replace(
			/var\(\s*--mhmui-[a-z0-9-]+\s*,\s*#[0-9a-fA-F]{3,8}\s*\)/g,
			'TOKEN'
		);
	// Named colours count only in declaration values, never in selectors.
	const values = [
		...withoutFallbacks.matchAll(
			/(?<![\w-])[a-z-]+\s*:\s*([^;{}]+)(?=[;}])/gi
		),
	]
		.map( ( m ) => m[ 1 ] )
		.join( ';' );
	return [
		...( withoutFallbacks.match( /#[0-9a-fA-F]{3,8}\b/g ) || [] ),
		...( withoutFallbacks.match(
			/(?<![\w-])(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/gi
		) || [] ),
		...( values.match( NAMED_RE ) || [] ),
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

test( 'the shadow fallback hides one rgba(), not what follows it (0.2.0)', () => {
	// The 0.1 pattern ran greedily to the last "))" before ";" and so swallowed
	// a bare colour written after the token in the same declaration.
	expect(
		violations(
			'.a{box-shadow:var(--mhmui-shadow-1, 0 1px 2px rgba(0,0,0,.06)), 0 0 0 2px var(--x, rgba(255,0,0,1));}'
		)
	).toEqual( [ 'rgba(' ] );
	expect(
		violations(
			'.a{box-shadow:var(--mhmui-shadow-1, 0 1px 2px rgba(0,0,0,.06)), inset 0 0 0 1px #f00;}'
		)
	).toEqual( [ '#f00' ] );
	expect(
		violations( '.a{box-shadow:var(--mhmui-shadow-2, #000 0 1px 2px);}' )
	).toEqual( [ '#000' ] );
} );

test( 'the shadow fallback is excused only inside a shadow declaration (0.3)', () => {
	expect(
		violations( '.a{color:var(--mhmui-shadow-1, 0 0 rgba(255,0,0,1));}' )
	).toEqual( [ 'rgba(' ] );
	expect(
		violations(
			'.a{text-shadow:var(--mhmui-shadow-1, 0 1px 2px rgba(0,0,0,.1));}'
		)
	).toEqual( [] );
	expect(
		violations(
			'.a{box-shadow:inset 0 0 0 1px var(--x), var(--mhmui-shadow-2, 0 1px 2px rgba(0,0,0,.1));}'
		)
	).toEqual( [] );
} );

test( 'the gate sees every colour spelling, any case (0.3)', () => {
	expect( violations( '.a{color:RGBA(0,0,0,.5)}' ) ).toEqual( [ 'RGBA(' ] );
	expect( violations( '.a{color:HSL(0 0% 0%)}' ) ).toEqual( [ 'HSL(' ] );
	expect( violations( '.a{color:oklch(0.5 0.1 200)}' ) ).toEqual( [
		'oklch(',
	] );
	expect( violations( '.a{color:color(display-p3 1 0 0)}' ) ).toEqual( [
		'color(',
	] );
	expect( violations( '.a{color:hwb(0 0% 0%)}' ) ).toEqual( [ 'hwb(' ] );
	expect( violations( '.a{color:lab(50% 0 0)}' ) ).toEqual( [ 'lab(' ] );
	expect( violations( '.a{color:white}' ) ).toEqual( [ 'white' ] );
	expect( violations( '.a{border:1px solid Red;}' ) ).toEqual( [ 'Red' ] );
	expect(
		violations(
			'.a{--x:color-mix(in srgb, black 20%, var(--mhmui-text));}'
		)
	).toEqual( [ 'black' ] );
} );

test( 'the gate leaves token mixes, keywords and token names alone (0.3)', () => {
	expect(
		violations(
			'.a{--h:color-mix(in srgb, var(--lic-ok-soft) 35%, var(--lic-surface));}'
		)
	).toEqual( [] );
	expect(
		violations(
			'.a{color:currentColor;background:transparent;border-color:inherit;outline:none}'
		)
	).toEqual( [] );
	expect( violations( '.a{color:var(--mhmui-red-text, #b32d2e)}' ) ).toEqual(
		[]
	);
	expect( violations( '.a{color:var(--lic-white)}' ) ).toEqual( [] );
	expect( violations( '.a:hover{color:var(--mhmui-text, #000)}' ) ).toEqual(
		[]
	);
	expect( violations( '.tan-box .white-label{display:block}' ) ).toEqual(
		[]
	);
} );

test( 'license-panel.scss uses tokens only', () => {
	expect( violations( readFileSync( FILE, 'utf8' ) ) ).toEqual( [] );
} );

test( 'the gate is not blind on the real file: a planted colour is caught (0.3)', () => {
	// Plant a colour in each spelling inside the real SCSS's own nesting
	// (after the last `color: var(` and inside the first `&:hover`).
	const real = readFileSync( FILE, 'utf8' );
	const last = real.lastIndexOf( 'color: var(' );
	const hover = real.indexOf( '&:hover' );
	expect( last ).toBeGreaterThan( 0 );
	expect( hover ).toBeGreaterThan( 0 );
	const brace = real.indexOf( '{', hover ) + 1;
	const planted =
		real.slice( 0, brace ) +
		' border-color: Crimson; outline-color: oklch(0.5 0.1 20);' +
		real.slice( brace, last ) +
		'background: #123456; color: var(' +
		real.slice( last + 'color: var('.length );
	expect( violations( planted ).sort() ).toEqual(
		[ '#123456', 'Crimson', 'oklch(' ].sort()
	);
} );
