# mhm/pro-kit

Shared admin UI for MHM **Pro** plugins: the license page body every Pro plugin draws
the same way, and the license key mask the license server uses.

**Pro only.** A free plugin must never require this package. That is why it is not
part of [`mhm/ui-core`](https://github.com/MaxHandMade/mhm-ui-core): ui-core ships
inside free plugins published on WordPress.org, and its purity gate keeps license
code out of it.

## Install

```json
{
	"repositories": [
		{ "type": "vcs", "url": "https://github.com/MaxHandMade/mhm-ui-core" },
		{ "type": "vcs", "url": "https://github.com/MaxHandMade/mhm-pro-kit" }
	],
	"require": {
		"mhm/ui-core": "^0.23",
		"mhm/pro-kit": "^0.1"
	}
}
```

The package lands in `vendor/mhm/pro-kit`, next to `vendor/mhm/ui-core`.

## License key mask (PHP)

```php
$masked = mhmprokit_mask_license_key( $key ); // 'A7K2-9QXP-4LMN-RT8W' → 'A7K2-****-****-****'
```

Byte for byte the license server's rule (`KeyMasking::mask()`): at most the first 4
bytes of the first segment stay visible, everything else becomes `*`, hyphens stay,
and a key of 8 bytes or fewer is masked whole. Apply it **before** the key leaves PHP
(REST response, localized data, printed HTML), so the full key never reaches the
browser. There is deliberately no JavaScript version.

The function is loaded by Composer (`autoload.files`) and guarded with
`function_exists()`, so two Pro plugins on the same site do not collide.

The test vectors in `tests/Fixtures/license-key-mask.json` were produced by running
the license server's own function; the server should run the same file.

## License page (React)

Coming in 0.1.0: `LicensePanel`, imported by relative path from
`vendor/mhm/pro-kit/src-react/`, the same way consumers import ui-core.

## License

GPL-2.0-or-later.
