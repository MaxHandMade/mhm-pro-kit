/**
 * No license yet: key form, "what a license unlocks", "works without a license".
 * There is no price in the plugin: the plans button shows only when buyUrl is set.
 * `activateBadge` (optional) is Rentiva's "Lite is running" pill.
 */
import ActivateForm from './ActivateForm';
import Icon from './Icon';
import LinkButton from './LinkButton';

export default function MainView( { t, product, form } ) {
	const badge = t( 'activateBadge' );
	return (
		<div className="mhmprokit-lic-main">
			<section
				className="mhmprokit-lic-card mhmprokit-lic-hero"
				aria-labelledby="mhmprokit-lic-act-title"
			>
				<div className="mhmprokit-lic-hero__head">
					<span className="mhmprokit-lic-hero__icon">
						<Icon name="key" size={ 28 } />
					</span>
					<div>
						<div className="mhmprokit-lic-status__titlerow">
							<h2 id="mhmprokit-lic-act-title">
								{ t( 'activateTitle' ) }
							</h2>
							{ badge ? (
								<span className="mhmprokit-lic-pill">
									{ badge }
								</span>
							) : null }
						</div>
						<p>{ t( 'activateText' ) }</p>
					</div>
				</div>
				<ActivateForm t={ t } variant="hero" { ...form } />
				{ product.buyUrl ? (
					<div className="mhmprokit-lic-buy">
						<Icon name="cart" size={ 18 } />
						<span className="mhmprokit-lic-buy__text">
							{ t( 'noLicense' ) }
						</span>
						<LinkButton
							href={ product.buyUrl }
							newTab={ t( 'newTab' ) }
						>
							{ t( 'seePlans' ) }
						</LinkButton>
					</div>
				) : null }
			</section>
			<aside className="mhmprokit-lic-side">
				<section
					className="mhmprokit-lic-card mhmprokit-lic-gives"
					aria-labelledby="mhmprokit-lic-gives-title"
				>
					<h2 id="mhmprokit-lic-gives-title">
						{ t( 'givesTitle' ) }
					</h2>
					<ul>
						{ ( product.gives || [] ).map( ( item ) => (
							<li key={ item.title }>
								<span className="mhmprokit-lic-gives__icon">
									<Icon name={ item.icon } size={ 18 } />
								</span>
								<div>
									<strong>{ item.title }</strong>
									<span>{ item.text }</span>
								</div>
							</li>
						) ) }
					</ul>
				</section>
				{ product.worksWithout ? (
					<div className="mhmprokit-lic-free">
						<Icon name="check" size={ 18 } />
						<span>
							<strong>{ product.worksWithout.title }</strong>{ ' ' }
							{ product.worksWithout.text }
						</span>
					</div>
				) : null }
			</aside>
		</div>
	);
}
