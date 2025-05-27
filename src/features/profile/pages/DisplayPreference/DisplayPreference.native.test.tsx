import React from 'react'

import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { render, screen, waitFor } from 'tests/utils'

import { DisplayPreference } from './DisplayPreference'

jest.mock('libs/firebase/analytics/analytics')

describe('DisplayPreference', () => {
  beforeEach(() => setFeatureFlags([RemoteStoreFeatureFlags.WIP_ENABLE_DARK_MODE]))

  it('should render correctly', () => {
    render(<DisplayPreference />)

    expect(screen).toMatchSnapshot()
  })

  it('should display dark mode section when feature flag is enable', async () => {
    render(<DisplayPreference />)

    await screen.findByText('Préférences d’affichage')

    const subtitle = screen.getByText('Thème')
    await waitFor(() => {
      expect(subtitle).toBeOnTheScreen()
    })
  })

  // TODO(PC-35459): Fix this flaky test
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('should not display dark mode section when feature flag is disable', async () => {
    setFeatureFlags()
    render(<DisplayPreference />)

    await screen.findByText('Préférences d’affichage')

    const subtitle = screen.queryByText('Thème')
    await waitFor(() => {
      expect(subtitle).not.toBeOnTheScreen()
    })
  })
})
