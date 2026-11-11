/**
 * @jest-environment node
 *
 * Visual harness: the six Rentiva boards ("Pro · Lisans sayfası", approved
 * 2026-11-11) rendered by the real LicensePanel with the boards' Turkish copy,
 * ui-core's admin.css and the compiled license-panel.scss, so the page can be
 * put next to each board at the same width. Writes build/visual/license-panel.html
 * only when MHMPROKIT_RENDER_OUT=1; otherwise it only proves every board renders.
 */
import { renderToStaticMarkup } from 'react-dom/server';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import LicensePanel from '../../src-react/LicensePanel';

const ROOT = join( __dirname, '..', '..' );

const ico = ( d ) => (
	<svg
		width="18"
		height="18"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		aria-hidden="true"
		focusable="false"
	>
		<path d={ d } />
	</svg>
);

const TEXT = {
	newTab: '(yeni sekmede açılır)',
	checkNow: 'Şimdi kontrol et',
	timeLeft: 'Kalan süre',
	dayUnit: () => 'gün',
	periodLabel: 'Lisans süresi',
	noEndDate: 'Bitiş tarihi yok',
	endsOn: ( d ) => `Bitiş: ${ d }`,
	latestTitle: ( name, v ) => `${ name } ${ v } yayında.`,
	latestText: ( v ) =>
		`Kurulu sürüm ${ v }. Hesabından indirip Eklentiler → Yeni ekle → Eklenti yükle ile kur.`,
	download: ( v ) => `${ v }'ü indir`,
	activeTitle: 'Pro lisansı etkin',
	activePill: 'Pro özellikleri açık',
	activeText:
		'Bu sitede Pro özellikleri, güncellemeler ve destek açık. Yapman gereken bir şey yok.',
	featuresLabel: 'Bu sitede açık',
	keyFact: 'Anahtar',
	lastCheckFact: 'Son kontrol',
	accountFact: 'Abonelik',
	accountButton: 'Aboneliği yönet',
	accountHint: 'Ödeme yöntemi, plan, yenileme',
	expiringTitle: ( n ) => `Lisansın ${ n } gün sonra bitiyor`,
	expiringPill: () => 'Yenileme zamanı',
	expiringText: ( d ) =>
		`${ d }'da biter. Şimdi yenilersen Pro özelliklerinde hiçbir şey kesilmez.`,
	manageSubscription: 'Aboneliği yenile',
	renewHelp: 'Otomatik yenileme açık mı?',
	updatesStayOn: 'Bitiş: 23 Kasım 2026',
	whenItEnds: 'Yenilemezsen',
	whenItEndsText:
		'Lite çalışmaya devam eder; Pro özellikleri ve güncellemeler durur.',
	expiredTitle: 'Lisansın süresi doldu',
	notActiveTitle: 'Lisans bu sitede etkin değil',
	expiredPill: 'Pro özellikleri kapandı',
	expiredText: ( d ) =>
		`${ d }'da bitti. Yenileyince Pro özellikleri ve güncellemeler hemen geri gelir; kayıtların olduğu gibi duruyor.`,
	notActiveText: 'Bu lisans bu sitede etkin değil.',
	renew: 'Lisansı yenile',
	renewedCheck: 'Yeniledim, şimdi kontrol et',
	stillWorking: 'Çalışmaya devam edenler',
	paused: 'Duranlar',
	otherKeyTitle: 'Başka bir anahtarın mı var?',
	newKeyLabel: 'Yeni lisans anahtarı',
	activate: 'Etkinleştir',
	activateTitle: "Rentiva Pro'yu etkinleştir",
	activateBadge: 'Şu an Lite çalışıyor',
	activateText:
		'Pro eklentisi kurulu. Anahtarını girince Pro özellikleri bu sitede açılır.',
	keyLabel: 'Lisans anahtarı',
	activateHero: 'Etkinleştir',
	keyHelp:
		'Anahtar, satın aldıktan sonra gelen e-postada ve WP Alemi hesabında. Bu sitede saklanır, ekranda tamamı bir daha gösterilmez.',
	noLicense: 'Lisansın yok mu?',
	seePlans: 'Paketleri ve fiyatları gör',
	givesTitle: 'Pro lisansıyla açılanlar',
	unverifiedEyebrow: 'Doğrulanamadı',
	unverifiedTitle: 'Lisans etkin ama Pro özellikleri bu sitede açılamadı',
	unverifiedText:
		'Pro özellikleri şimdilik kapalı. Araçlar ve rezervasyonlar Lite ile çalışmaya devam eder.',
	unverifiedSteps: [
		'“Şimdi kontrol et”e bas.',
		'Site adresini yakın zamanda değiştirdiysen ya da siteyi kopyaladıysan lisansı bu sitede devre dışı bırakıp yeniden etkinleştir.',
		'Sürüyorsa destekle iletişime geç.',
	],
	contactSupport: 'Destekle iletişime geç',
	offlineEyebrow: 'Çevrimdışı ek süre',
	offlineTitle: 'Lisans sunucusuna ulaşılamıyor',
	offlineLong: 'Lisans sunucusuna 7 günden uzun süredir ulaşılamadı.',
	offlineStays: ( n ) => (
		<>
			Pro özellikleri <strong>{ n } gün daha</strong> açık kalır; bu
			sürede bağlantı kurulursa hiçbir şey değişmez.
		</>
	),
	graceLabel: 'Ek süre',
	lastSuccessful: ( rel ) => `Son başarılı kontrol: ${ rel }`,
	graceDays: '7 günlük ek süre',
	moveTitle: 'Lisansı başka siteye taşı',
	moveText:
		'Lisans bir sitede çalışır. Bu sitede devre dışı bırakırsan Pro özellikleri burada kapanır; araçlar ve rezervasyonlar Lite ile çalışmaya devam eder, Pro kayıtların silinmez.',
	moveTextShort:
		'Bu sitede devre dışı bırakırsan Pro özellikleri burada kapanır; Lite çalışmaya devam eder.',
	deactivate: 'Bu sitede devre dışı bırak',
	deactivateConfirm: 'Lisans bu siteden kaldırılsın mı?',
	deactivateYes: 'Evet, devre dışı bırak',
	cancel: 'Vazgeç',
	deactivating: 'Devre dışı bırakılıyor…',
};

const PRODUCT = {
	name: 'Rentiva Pro',
	accountUrl: '#account',
	supportUrl: '#support',
	buyUrl: '#plans',
	renewHelpUrl: '#renew-help',
	downloadUrl: '#download',
	features: [
		'Bayi pazaryeri ve ödemeler',
		'Transfer',
		'Mesajlar',
		'Gelişmiş raporlar',
		'Dışa aktarma',
		'Kişisel veri araçları',
	],
	gives: [
		{
			icon: ico( 'M3 9l1.5-5h15L21 9M3 9v11h18V9M3 9h18M9 20v-6h6v6' ),
			title: 'Bayi pazaryeri ve ödemeler',
			text: 'Başka firmalar araçlarını sitende kiralar, komisyonun ve ödemeleri sen yönetirsin.',
		},
		{
			icon: ico( 'M8 18h7a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h7' ),
			title: 'Transfer',
			text: 'Havalimanı ve şehir içi transfer rezervasyonu, güzergâh fiyatlarıyla.',
		},
		{
			icon: 'chat',
			title: 'Mesajlar',
			text: "Müşterilerle rezervasyon üzerinden yazışma, Hesabım'da.",
		},
		{
			icon: ico( 'M4 20V10M10 20V4M16 20v-7M22 20H2' ),
			title: 'Gelişmiş raporlar ve dışa aktarma',
			text: 'Bayi ve şehir cirosu, CSV dışa aktarma.',
		},
		{
			icon: 'refresh',
			title: 'Güncellemeler ve destek',
			text: 'Lisans süresince çıkan her Pro sürümü, e-postayla destek.',
		},
	],
	worksWithout: {
		title: 'Rentiva lisanssız da çalışır.',
		text: 'Araçlar, rezervasyonlar, ödemeler ve takvim Lite ile açık kalır; lisans yalnız Pro özelliklerini, güncellemeleri ve desteği açar.',
	},
	stillWorking:
		"Rentiva Lite'ın tümü: araçlar, rezervasyonlar, ödemeler, takvim, e-postalar, Hesabım.",
	paused: 'Bayi pazaryeri ve ödemeler, transfer, mesajlar, gelişmiş raporlar, dışa aktarma; yeni sürüm bildirimi ve destek.',
};

const FORMAT = {
	date: ( iso ) =>
		( {
			'2027-10-18': '18 Ekim 2027',
			'2026-11-23': '23 Kasım 2026',
			'2026-11-10': '10 Kasım 2026',
		} )[ ( iso || '' ).slice( 0, 10 ) ] || '',
	dateTime: () => '11 Kas 2026 07:00',
	relative: () => '2 saat önce',
	daysUntil: ( iso ) => ( iso ? 5 : null ),
};

const BASE = {
	state: 'active',
	reason: null,
	key_masked: 'A7K2-****-****-****',
	expires_at: '2027-10-18T00:00:00Z',
	days_left: 342,
	last_check_at: '2026-11-11T05:00:00Z',
	latest_version: null,
	current_version: '6.4.2',
	grace_until: null,
};

const BOARDS = [
	[ 'Lisans-Yok', 1440, { ...BASE, state: 'none', key_masked: null } ],
	[ 'Lisans-Etkin', 1440, { ...BASE, latest_version: '6.4.3' } ],
	[
		'Lisans-Bitiyor',
		1440,
		{
			...BASE,
			state: 'expiring',
			days_left: 12,
			expires_at: '2026-11-23T00:00:00Z',
		},
	],
	[
		'Lisans-Doldu',
		1440,
		{
			...BASE,
			state: 'expired',
			reason: 'expired',
			days_left: 0,
			expires_at: '2026-11-10T00:00:00Z',
		},
	],
	[
		'Lisans-Dogrulanamadi (sol)',
		1440,
		{ ...BASE, state: 'expired', reason: 'unverified' },
	],
	[
		'Lisans-Dogrulanamadi (sağ)',
		1440,
		{ ...BASE, state: 'grace', grace_until: '2026-11-16T00:00:00Z' },
	],
	[ 'Lisans-Mobil', 390, { ...BASE, latest_version: '6.4.3' } ],
];

function section( [ name, width, license ] ) {
	const body = renderToStaticMarkup(
		<LicensePanel
			license={ license }
			product={ PRODUCT }
			text={ TEXT }
			format={ FORMAT }
			form={ {
				value: '',
				onChange: () => {},
				onSubmit: () => {},
				busy: false,
			} }
			onCheck={ () => {} }
			onDeactivate={ () => {} }
		/>
	);
	// Desktop boards: 160px admin menu + 32px main padding each side.
	const content = width === 390 ? 390 - 32 : width - 160 - 64;
	return `<section class="board" data-board="${ name }"><h3>${ name } · ${ width }</h3><div class="wrap mhmui-admin mhmui-admin-page" style="width:${ content }px"><h1 class="wp-heading-inline">Lisans</h1>${ body }</div></section>`;
}

test( 'every board renders', () => {
	const html = BOARDS.map( section ).join( '' );
	expect( html ).toContain( 'mhmprokit-license' );
	if ( process.env.MHMPROKIT_RENDER_OUT !== '1' ) {
		return;
	}
	// eslint-disable-next-line import/no-extraneous-dependencies -- dev-only harness.
	const sass = require( 'sass' );
	const css = sass.compile(
		join( ROOT, 'src-react', 'license-panel.scss' )
	).css;
	const kit = readFileSync(
		join(
			ROOT,
			'vendor',
			'mhm',
			'ui-core',
			'assets',
			'react',
			'admin.css'
		),
		'utf8'
	);
	const page = `<!doctype html><html lang="tr"><head><meta charset="utf-8"><title>LicensePanel harness</title><style>
body{margin:0;background:#f0f0f1;color:#1d2327;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;font-size:13px;line-height:1.5}
.board{padding:24px 32px 48px}.board>h3{margin:0 0 8px;font:600 12px monospace;color:#646970}
.wp-heading-inline{font-size:23px;font-weight:400;margin:0 0 16px}
.screen-reader-text{border:0;clip-path:inset(50%);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px;word-wrap:normal!important}
</style><style>${ kit }</style><style>${ css }</style></head><body>${ html }</body></html>`;
	mkdirSync( join( ROOT, 'build', 'visual' ), { recursive: true } );
	writeFileSync(
		join( ROOT, 'build', 'visual', 'license-panel.html' ),
		page
	);
} );
