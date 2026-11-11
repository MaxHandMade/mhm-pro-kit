module.exports = {
	extends: [ 'plugin:@wordpress/eslint-plugin/recommended' ],
	rules: {
		// ui-core is imported by its sibling path under the CONSUMER's vendor/mhm/
		// ('../../ui-core/...'); this repo has it one level down, in its own
		// vendor/. Only that prefix is exempt, and only from resolution: the Jest
		// mapper (jest.config.js) resolves it, and tests/ui-core-path.test.jsx
		// turns red if the mapping breaks.
		'import/no-unresolved': [ 'error', { ignore: [ '^(\.\./)+ui-core/' ] } ],
	},
	overrides: [
		{
			// Jest reads its per-file environment from a docblock pragma
			// (@jest-environment node), which the JSDoc rule takes for an
			// unknown tag. The visual harness needs node: react-dom/server's
			// browser build wants TextEncoder, which jsdom does not provide.
			files: [ 'tests/visual/**' ],
			rules: { 'jsdoc/check-tag-names': 'off' },
		},
		{
			// wp-scripts' default config gives jest globals to **/*.test.js but not to
			// .test.jsx, so a JSX test file fails on `describe` being undefined.
			files: [ '**/*.test.js', '**/*.test.jsx' ],
			env: { jest: true },
		},
		{
			// No text domain in this package: every string is a prop the
			// consumer translated 
			files: [ 'src-react/**/*.js', 'src-react/**/*.jsx' ],
			excludedFiles: [ '**/*.test.js', '**/*.test.jsx' ],
			rules: {
				'no-restricted-imports': [
					'error',
					{
						paths: [
							{
								name: '@wordpress/i18n',
								message: 'mhm-pro-kit has no text domain: take the translated string as a prop.',
							},
						],
					},
				],
				'no-restricted-globals': [
					'error',
					{
						name: 'wp',
						message: 'mhm-pro-kit has no text domain and no runtime globals: take the string as a prop.',
					},
				],
				'no-restricted-properties': [
					'error',
					{
						object: 'window',
						property: 'wp',
						message: 'mhm-pro-kit has no text domain and no runtime globals: take the string as a prop.',
					},
				],
			},
		},
	],
};
