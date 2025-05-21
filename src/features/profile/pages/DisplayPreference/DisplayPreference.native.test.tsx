import React from 'react'

import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { act, render, screen } from 'tests/utils'

import { DisplayPreference } from './DisplayPreference'

describe('DisplayPreference', () => {
  beforeEach(() => setFeatureFlags([RemoteStoreFeatureFlags.WIP_ENABLE_DARK_MODE]))

  it('should render correctly', () => {
    render(<DisplayPreference />)

    expect(screen).toMatchSnapshot()
  })

  it('should display correct subtitle', async () => {
    render(<DisplayPreference />)

    const subtitle = screen.getByText('L’affichage en mode paysage peut être moins optimal')
    await act(() => expect(subtitle).toBeOnTheScreen())
  })

  it('should display dark mode section when feature flag is enable', async () => {
    render(<DisplayPreference />)

    const subtitle = screen.getByText('Thème')
    await act(() => expect(subtitle).toBeOnTheScreen())
  })

  it('should not display dark mode section when feature flag is disable', async () => {
    setFeatureFlags()
    render(<DisplayPreference />)

    const subtitle = screen.queryByText('Thème')
    await act(() => expect(subtitle).not.toBeOnTheScreen())
  })
})
