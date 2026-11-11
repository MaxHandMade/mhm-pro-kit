<?php
/**
 * License key mask shared by every Pro plugin's license page.
 *
 * @package MHMProKit
 */

declare(strict_types=1);

if ( ! function_exists( 'mhmprokit_mask_license_key' ) ) {
	/**
	 * A license key masked for display, with the license server's rule.
	 *
	 * Byte for byte the rule of MHMLicenseServer\Admin\KeyMasking::mask() (1.13.0):
	 * at most the first 4 bytes of the first segment stay visible, every other byte
	 * becomes '*', hyphens stay where they are, and a key of 8 bytes or fewer is
	 * masked whole. Bytes, not characters, exactly like the server, so the license
	 * page and the license server show the same string for the same key.
	 *
	 * PHP only, on purpose: mask before the key leaves the server (REST body,
	 * localized data, printed HTML), so a full key never reaches the browser.
	 *
	 * Guarded, not namespaced: two Pro plugins on one site both autoload this file
	 * (composer "files"); the first one loaded defines it, the rule is the same.
	 *
	 * @param string $key Raw key.
	 * @return string Masked key ('' stays '').
	 */
	function mhmprokit_mask_license_key( string $key ): string {
		if ( '' === $key ) {
			return $key;
		}
		if ( strlen( $key ) <= 8 ) {
			return str_repeat( '*', strlen( $key ) );
		}

		$parts = explode( '-', $key );
		if ( count( $parts ) <= 1 ) {
			return substr( $key, 0, 4 ) . str_repeat( '*', strlen( $key ) - 4 );
		}

		$parts[0] = substr( $parts[0], 0, 4 ) . str_repeat( '*', max( 0, strlen( $parts[0] ) - 4 ) );
		$count    = count( $parts );
		for ( $i = 1; $i < $count; $i++ ) {
			$parts[ $i ] = str_repeat( '*', strlen( $parts[ $i ] ) );
		}

		return implode( '-', $parts );
	}
}
