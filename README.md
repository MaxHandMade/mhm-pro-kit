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

If the rule ever changes, it ships under a **new function name**: with two Pro
plugins on one site the first loaded copy of this file wins, so a changed body
under the same name could be silently shadowed by an older copy.

## License page (React)

`LicensePanel` is the body of the license page every Pro plugin draws the same way
(approved boards: none · active · expiring · expired · unverified · offline grace,
desktop and mobile). Put your own `PageHeader` and notices above it.

```js
import { LicensePanel } from '../../vendor/mhm/pro-kit/src-react';

<LicensePanel
	license={ body }            // your license REST body (see below)
	product={ product }         // name, URLs, "what a license unlocks", …
	text={ text }               // every visible string, translated by you
	form={ { value, onChange, onSubmit, busy } }
	busy={ busy }
	onCheck={ checkNow }
	onDeactivate={ deactivate }
/>;
```

- **`license`**: `state` (`none|active|expiring|grace|expired`), `reason`
  (`expired|offline|unverified|…`), `days_left`, `expires_at`, `last_check_at`,
  `grace_until`, `key_masked` (already masked in PHP), `latest_version`,
  `current_version`. `viewFor( license )` (exported) is the pure state → view map.
- **`product`**: `name`, `accountUrl`, `supportUrl`, `buyUrl` (no price in the
  plugin: the plans button shows only when set), `renewHelpUrl`, `downloadUrl`,
  `gives[{ icon, title, text }]` (`icon` is a name from the shared set or your own
  SVG node), `worksWithout{ title, text }`, `stillWorking`, `paused`, optional
  `features[]` (chips on the active/expiring card).
- **`text`**: the full key list is in `src-react/LicensePanel.jsx`'s docblock.
  Strings with a number or a date are functions (`dayUnit( n )`, `endsOn( date )`…).
  This package has no text domain; a missing key prints nothing (and a missing
  `newTab`, `periodLabel` or `graceLabel` also drops an accessible name).
- Navigation actions are secondary buttons that open in a new tab with an icon
  and the `newTab` screen-reader text; the card's main action may be primary.

Things to know:

- **Do not render the panel until the license is loaded.** `license={ null }`
  draws the activation form (the "none" view); show your own loading line first.
- **`keyHelp` is a node you build** (a sentence with a link to the account): give
  that link `target="_blank" rel="noopener noreferrer"` yourself.
- **One panel per page.** Ids are fixed (`mhmprokit-license-key-hero`, …).
- **Styles** come from `src-react/license-panel.scss`, imported by the component.
  Your wp-scripts build compiles it into your bundle's CSS (`package.json`
  `sideEffects` keeps it from being tree-shaken); enqueue that CSS on the page.
  Colours are ui-core tokens, so render inside ui-core's `.mhmui-admin` scope.

## License

GPL-2.0-or-later.
