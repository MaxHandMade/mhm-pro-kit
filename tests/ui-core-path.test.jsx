import { render } from '@testing-library/react';
// The specifier a consumer resolves next to vendor/mhm/ui-core; jest.config.js
// maps it to this repo's own vendor/mhm/ui-core. Red here = the mapping broke.
import Button from '../../ui-core/src-react/components/Button';

test( 'ui-core resolves through the sibling vendor path', () => {
	const { container } = render(
		<Button href="/a" target="_blank" rel="noopener noreferrer">
			Open
		</Button>
	);
	const a = container.querySelector( 'a.mhmui-button' );
	expect( a ).not.toBeNull();
	// ui-core 0.23.0's link props: pro-kit relies on them for external actions.
	expect( a.getAttribute( 'target' ) ).toBe( '_blank' );
} );
