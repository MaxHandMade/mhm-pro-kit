/**
 * Reads one string from the consumer's `text` map. A function value is called with
 * the arguments (plurals and dates are the consumer's job: this package has no
 * text domain). A missing key prints nothing rather than an English fallback.
 *
 * @param {Object} text Consumer's translated strings.
 * @return {(key: string, ...args: unknown[]) => unknown} Reader: a string, a node, or the consumer function's result.
 */
export function reader( text ) {
	return ( key, ...args ) => {
		const value = text ? text[ key ] : undefined;
		if ( typeof value === 'function' ) {
			return value( ...args );
		}
		return value === undefined || value === null ? '' : value;
	};
}
