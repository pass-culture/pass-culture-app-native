import React from 'react'

import { SubscriptionTheme } from 'features/subscription/types'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { render, screen } from 'tests/utils'

import { UnsubscribingConfirmationModal } from './UnsubscribingConfirmationModal'

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('<UnsubscribingConfirmationModal />', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should render correctly', () => {
    render(
      <UnsubscribingConfirmationModal
        visible
        theme={SubscriptionTheme.MUSIQUE}
        dismissModal={jest.fn()}
        onUnsubscribePress={jest.fn()}
      />
    )

    expect(screen).toMatchSnapshot()
  })

  it('should display remote illustration when new vision UI FF activated', async () => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_NEW_VISION_UI])

    render(
      <UnsubscribingConfirmationModal
        visible
        theme={SubscriptionTheme.MUSIQUE}
        dismissModal={jest.fn()}
        onUnsubscribePress={jest.fn()}
      />
    )

    expect(screen.getByTestId('app-modal-remote-illustration')).toBeOnTheScreen()
  })
})
