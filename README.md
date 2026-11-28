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
		"mhm/pro-kit": "^0.2"
	}
}
```

The package lands in `vendor/mhm/pro-kit`, next to `vendor/mhm/ui-core`.

## License key mask (PHP)

```php
$masked = mhmprokit_mask_license_key( $key ); // 'ABCD-EFGH-JKLM-NPQR' → 'ABCD-****-****-****'
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
- **Ids are generated per panel** (`useId`), so two panels on one page do not
  collide (0.2.0; 0.1 had fixed ids and allowed one panel per page).
- **An empty URL draws no button** (`accountUrl`, `supportUrl`, `buyUrl`,
  `renewHelpUrl`, `downloadUrl`; blank or `"#"` counts as empty): never a link
  without an address. Without `accountUrl` the active card also drops its
  "Account" row.
- **`accountUrl` is required in practice.** It is the only way out of the
  expiring ("Manage subscription") and expired ("Renew license") views; leave it
  empty and the admin is left with "Check now" alone.
- **The expiring card turns urgent at 7 days or fewer** (`URGENT_DAYS`, exported):
  its pill and "Manage subscription" go red (0.2.1). The threshold is the
  package's, shared by every consumer; `days_left` drives it. The card also
  carries `mhmprokit-lic-status--urgent` as a hook (no styles of its own).
- **Inside ui-core's shell** (`.mhmui-admin-page`), render the panel as a direct
  child after your `PageHeader`/notices: it then gets the shell's
  `--mhmui-space-3` rhythm like ui-core's own members (0.2.1). Nested in your
  own wrapper, the wrapper spaces it.
- **The panel root is a CSS container** (`container-type: inline-size`, name
  `mhmprokit-license`, 0.2.2): the first-run view puts the key card and "what a
  license unlocks" side by side only when the PANEL is 900px wide, and stacks
  them below that. The root sets `width: 100%` (capped at 1040px), so it keeps
  its width in a column flex or grid parent that start-aligns its children.
  Only a parent that is itself shrink-to-fit (inline-block, float,
  `width: fit-content`, a flex row item with no width) still collapses it: an
  inline-size container takes no width from its content.
- **Grace without a usable count** (`daysUntil( grace_until )` 0 or less, or
  not a number) prints `offlineLong`, not `offlineStays( 0 )` (0.2.2).
- **The last day can say "today"** (0.2.3): give the optional text key
  `expiresTodayPill` ("Ends today") and the expiring card's pill uses it at
  `days_left` 0 instead of `expiringPill( 0 )` ("0 days left"). Without the key
  the pill is unchanged.
- **Missing data draws no broken line** (0.2.3): without `current_version` the
  new-version strip drops the `latestText` sentence ("You have ."); without
  `key_masked` the active and expiring cards drop the "Key" row; without
  `expires_at` the expiring card drops `expiringText` ("Ends on ."); an empty
  `product.stillWorking` or `product.paused` drops that item of the expired
  card's split, both drop the split.
- **Narrow panels** (0.2.3): the help cards' title (unverified, offline) goes
  under its icon when it cannot keep 12em beside it -- at 320px a German title
  drew seven lines in a 153px column, now four at full width. Under a 480px
  panel the key field uses 15px untracked type: a 30-character key ran 121px
  past the field at 320px, now 45px (a 19-character key fitted before and
  after).
- **Upgrading from 0.2.1:** between a 783 and ~1200px viewport the first-run
  view is now stacked (it was two columns with a 51-168px key field). Consumer
  CSS that set `.mhmprokit-lic-main` inside a 783px media query should move to
  `@container mhmprokit-license`.
- **Needs WordPress 6.2+** (React 18): ids come from `useId`, which
  `wp.element` exports from 6.2 on.
- **Styles** come from `src-react/license-panel.scss`, imported by the component.
  Your wp-scripts build compiles it into your bundle's CSS (`package.json`
  `sideEffects` keeps it from being tree-shaken); enqueue that CSS on the page.
  Colours are ui-core tokens, so render inside ui-core's `.mhmui-admin` scope.

## License

GPL-2.0-or-later.
