import { reader } from './text';

test( 'missing_or_null_key_reads_as_empty_string', () => {
	const t = reader( { a: 'A', n: null } );
	expect( t( 'a' ) ).toBe( 'A' );
	expect( t( 'missing' ) ).toBe( '' );
	expect( t( 'n' ) ).toBe( '' );
	expect( reader( undefined )( 'x' ) ).toBe( '' );
} );

test( 'function_values_get_the_arguments', () => {
	const t = reader( { days: ( n, d ) => `${ n } / ${ d }` } );
	expect( t( 'days', 3, 'x' ) ).toBe( '3 / x' );
} );
