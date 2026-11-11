const base = require( '@wordpress/scripts/config/jest-unit.config.js' );

module.exports = {
	...base,
	rootDir: __dirname,
	testMatch: [
		'<rootDir>/src-react/**/*.test.js',
		'<rootDir>/src-react/**/*.test.jsx',
		'<rootDir>/tests/**/*.test.js',
		'<rootDir>/tests/**/*.test.jsx',
	],
	moduleNameMapper: {
		...( base.moduleNameMapper || {} ),
		// In a consumer this package sits next to ui-core under vendor/mhm/, so the
		// source imports ui-core by a sibling path ('../../ui-core/...', deeper
		// files add one '../' per level). Here ui-core is this repo's own
		// composer dependency, so the same specifier resolves to vendor/mhm/ui-core.
		'^(?:\.\./)+ui-core/(.*)$': '<rootDir>/vendor/mhm/ui-core/$1',
		'\\.s?css$': '<rootDir>/tests/style-stub.js',
	},
};
