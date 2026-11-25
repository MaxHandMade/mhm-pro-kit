/**
 * ESLint flat config. `@wordpress/scripts` 37 runs ESLint 10 and reads only an
 * eslint.config.* file; the old .eslintrc.js was ignored without an error, so
 * its overrides (jest globals, the i18n restrictions) were silently gone.
 * Ported from .eslintrc.js; base and Jest block follow scripts 37's
 * docs/vitest-migration.md, "Keep Jest lint rules" (same as mhm-ui-core).
 * package.json pins eslint and `@wordpress/eslint-plugin` to the versions
 * scripts 37 depends on, so the tree holds one copy of each.
 */
const wpPlugin = require( '@wordpress/eslint-plugin' );
const jestPlugin = require( 'eslint-plugin-jest' );

const TESTS = [ '**/*.test.js', '**/*.test.jsx' ];

const I18N_MESSAGE =
	'mhm-pro-kit has no text domain and no runtime globals: take the string as a prop.';

module.exports = [
	{ ignores: [ '**/build/**', '**/node_modules/**', '**/vendor/**' ] },
	...wpPlugin.configs.recommended,
	{
		languageOptions: {
			parserOptions: {
				requireConfigFile: false,
				babelOptions: {
					presets: [
						require.resolve( '@wordpress/babel-preset-default' ),
					],
				},
			},
		},
		rules: {
			// ui-core is imported by its sibling path under the CONSUMER's
			// vendor/mhm/ ('../../ui-core/...'); this repo has it one level
			// down, in its own vendor/. Only that prefix is exempt, and only
			// from resolution: the Jest mapper (jest.config.js) resolves it, and
			// tests/ui-core-path.test.jsx turns red if the mapping breaks.
			'import/no-unresolved': [
				'error',
				{ ignore: [ '^(\.\./)+ui-core/' ] },
			],
		},
	},
	{
		// Jest reads its per-file environment from a docblock pragma
		// (@jest-environment node), which the JSDoc rule takes for an unknown
		// tag. The visual harness and the SCSS hover and rhythm tests need node.
		files: [
			'tests/visual/**',
			'tests/scss-hover.test.js',
			'tests/scss-rhythm.test.js',
		],
		rules: { 'jsdoc/check-tag-names': 'off' },
	},
	{
		// .test.jsx as well as .test.js: a JSX test file must not fail on
		// `describe` being undefined. flat/recommended brings the jest/* rules
		// too, not only the globals the old `env: { jest: true }` gave.
		...jestPlugin.configs[ 'flat/recommended' ],
		files: TESTS,
	},
	{
		// No text domain in this package: every string is a prop the consumer
		// translated.
		files: [ 'src-react/**/*.js', 'src-react/**/*.jsx' ],
		ignores: TESTS,
		rules: {
			'no-restricted-imports': [
				'error',
				{
					paths: [
						{
							name: '@wordpress/i18n',
							message:
								'mhm-pro-kit has no text domain: take the translated string as a prop.',
						},
					],
				},
			],
			'no-restricted-globals': [
				'error',
				{ name: 'wp', message: I18N_MESSAGE },
			],
			'no-restricted-properties': [
				'error',
				{ object: 'window', property: 'wp', message: I18N_MESSAGE },
			],
		},
	},
];
