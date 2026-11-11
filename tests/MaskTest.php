<?php
declare(strict_types=1);

namespace MHMProKit\Tests;

use PHPUnit\Framework\TestCase;

/**
 * tests/Fixtures/license-key-mask.json was produced by running the license
 * server's own MHMLicenseServer\Admin\KeyMasking::mask() (1.13.0) on each
 * input (2026-11-11), so this copy cannot drift from what the server shows.
 * The server's test suite should run the same file.
 */
final class MaskTest extends TestCase {

	/** @return array<string, array{0: string, 1: string}> */
	public function vectors(): array {
		$rows = json_decode( (string) file_get_contents( __DIR__ . '/Fixtures/license-key-mask.json' ), true );
		$out  = array();
		foreach ( (array) $rows as $i => $row ) {
			$out[ $i . ': "' . $row['in'] . '"' ] = array( (string) $row['in'], (string) $row['out'] );
		}
		return $out;
	}

	/** @dataProvider vectors */
	public function test_vectors_match_the_license_server( string $key, string $expected ): void {
		self::assertSame( $expected, \mhmprokit_mask_license_key( $key ) );
	}

	public function test_all_ten_vectors_are_read(): void {
		self::assertCount( 10, $this->vectors() );
	}

	/**
	 * Two Pro plugins on one site both autoload this file (composer "files"):
	 * the second include must not redeclare the function.
	 */
	public function test_including_the_file_twice_is_safe(): void {
		require __DIR__ . '/../src/mask.php';
		require __DIR__ . '/../src/mask.php';
		self::assertTrue( function_exists( 'mhmprokit_mask_license_key' ) );
	}
}
