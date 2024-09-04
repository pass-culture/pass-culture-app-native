import React from 'react'

import { ExpiredOrLostID } from 'features/identityCheck/pages/identification/ubble/ExpiredOrLostID'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import * as useGoBack from 'features/navigation/useGoBack'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { BatchEvent, BatchUser } from 'libs/react-native-batch'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

jest.mock('features/navigation/navigationRef')
const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: jest.fn(),
  canGoBack: jest.fn(() => true),
})

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('ExpiredOrLostID', () => {
  it('should render correctly', () => {
    render(<ExpiredOrLostID />)

    expect(screen).toMatchSnapshot()
  })

  it('should open ants url on press "Aller sur demarches-simplifiees.fr"', async () => {
    render(<ExpiredOrLostID />)

    fireEvent.press(screen.getByText('Aller sur demarches-simplifiees.fr'))

    expect(openUrl).toHaveBeenCalledWith(env.DMS_FRENCH_CITIZEN_URL, undefined, true)
  })

  it('should log screen view when the screen is mounted', async () => {
    render(<ExpiredOrLostID />)

    await waitFor(() => expect(analytics.logScreenViewExpiredOrLostId).toHaveBeenCalledTimes(1))
  })

  it('should send a batch event when the screen is mounted', async () => {
    render(<ExpiredOrLostID />)

    await waitFor(() =>
      expect(BatchUser.trackEvent).toHaveBeenNthCalledWith(1, BatchEvent.screenViewExpiredOrLostId)
    )
  })
})
