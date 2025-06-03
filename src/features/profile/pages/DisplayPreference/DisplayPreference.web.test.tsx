import React from 'react'

import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { checkAccessibilityFor, render, screen } from 'tests/utils/web'

import { DisplayPreference } from './DisplayPreference'

jest.mock('ui/theme/customFocusOutline/customFocusOutline')

describe('DisplayPreference', () => {
  beforeEach(() => setFeatureFlags([RemoteStoreFeatureFlags.WIP_ENABLE_DARK_MODE]))

  it('should not have basic accessibility issues', async () => {
    const { container } = renderDisplayPreference()
    const results = await checkAccessibilityFor(container)

    expect(results).toHaveNoViolations()
  })

  it('should not display orientation toggle', () => {
    renderDisplayPreference()

    const rotationTitle = screen.queryByText('Permettre l’orientation')

    expect(rotationTitle).not.toBeInTheDocument()
  })
})

const renderDisplayPreference = () => render(reactQueryProviderHOC(<DisplayPreference />))
