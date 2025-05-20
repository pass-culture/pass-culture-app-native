import React from 'react'

import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { checkAccessibilityFor, render, screen } from 'tests/utils/web'

import { DisplayPreference } from './DisplayPreference'

jest.mock('ui/theme/customFocusOutline/customFocusOutline')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

describe('DisplayPreference', () => {
  beforeEach(() => setFeatureFlags([RemoteStoreFeatureFlags.WIP_ENABLE_DARK_MODE]))

  it('should not have basic accessibility issues', async () => {
    const { container } = renderDisplayPreference()
    const results = await checkAccessibilityFor(container)

    expect(results).toHaveNoViolations()
  })

  it('should display correct subtitle', async () => {
    renderDisplayPreference()

    const webSubtitle = screen.getByText('L’affichage en mode paysage n’est pas disponible en web')

    expect(webSubtitle).toBeInTheDocument()
  })

  it('should disable phone rotation toggle', async () => {
    renderDisplayPreference()

    expect(screen.getByTestId('Interrupteur Rotation')).toHaveAttribute('aria-disabled', 'true')
  })
})

const renderDisplayPreference = () => render(reactQueryProviderHOC(<DisplayPreference />))
