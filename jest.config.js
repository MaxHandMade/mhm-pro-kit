/**
 * Jest, kept on purpose after @wordpress/scripts 37 moved `test-unit-js` to
 * Vitest. 37 no longer ships config/jest-unit.config.js or a bundled Jest;
 * this is the "tested legacy combination" from its docs/vitest-migration.md
 * (Keep an existing Jest suite): the published WordPress preset plus
 * babel-jest with the WordPress Babel preset. Same recipe as mhm-ui-core.
 */
module.exports = {
	preset: '@wordpress/jest-preset-default',
	transform: {
		'\.[jt]sx?$': [
			'babel-jest',
			{ presets: [ '@wordpress/babel-preset-default' ] },
		],
	},
	rootDir: __dirname,
	testMatch: [
		'<rootDir>/src-react/**/*.test.js',
		'<rootDir>/src-react/**/*.test.jsx',
		'<rootDir>/tests/**/*.test.js',
		'<rootDir>/tests/**/*.test.jsx',
	],
	moduleNameMapper: {
		// In a consumer this package sits next to ui-core under vendor/mhm/, so the
		// source imports ui-core by a sibling path ('../../ui-core/...', deeper
		// files add one '../' per level). Here ui-core is this repo's own
		// composer dependency, so the same specifier resolves to vendor/mhm/ui-core.
		'^(?:\.\./)+ui-core/(.*)$': '<rootDir>/vendor/mhm/ui-core/$1',
		'\.s?css$': '<rootDir>/tests/style-stub.js',
	},
};
