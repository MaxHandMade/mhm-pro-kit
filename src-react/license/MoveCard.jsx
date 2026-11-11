/**
 * "Move the license to another site": the deactivate action, shown for every
 * view where a key is stored. The long and short texts are both printed; CSS
 * picks one with disjoint width queries (782/783), as in Slotiva af37f05.
 */
import ConfirmButton from '../../../ui-core/src-react/components/ConfirmButton';

export default function MoveCard( { t, busy, onDeactivate } ) {
	return (
		<section
			className="mhmprokit-lic-card mhmprokit-lic-move"
			aria-labelledby="mhmprokit-lic-move-title"
		>
			<div>
				<h2 id="mhmprokit-lic-move-title">{ t( 'moveTitle' ) }</h2>
				<p className="mhmprokit-lic-move__long">{ t( 'moveText' ) }</p>
				<p className="mhmprokit-lic-move__short">
					{ t( 'moveTextShort' ) }
				</p>
			</div>
			<ConfirmButton
				label={ t( 'deactivate' ) }
				confirmText={ t( 'deactivateConfirm' ) }
				confirmLabel={ t( 'deactivateYes' ) }
				cancelLabel={ t( 'cancel' ) }
				busyText={ t( 'deactivating' ) }
				variant="danger"
				disabled={ busy }
				onConfirm={ onDeactivate }
			/>
		</section>
	);
}
