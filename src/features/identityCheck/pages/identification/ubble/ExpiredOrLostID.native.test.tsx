import React from 'react'

import { ExpiredOrLostID } from 'features/identityCheck/pages/identification/ubble/ExpiredOrLostID'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import * as useGoBack from 'features/navigation/useGoBack'
import { env } from 'libs/environment/env'
import { BatchEvent, BatchProfile } from 'libs/react-native-batch'
import { render, screen, userEvent, waitFor } from 'tests/utils'

jest.mock('features/navigation/navigationRef')
const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: jest.fn(),
  canGoBack: jest.fn(() => true),
})

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})
const user = userEvent.setup()
jest.useFakeTimers()

describe('ExpiredOrLostID', () => {
  it('should render correctly', () => {
    render(<ExpiredOrLostID />)

    expect(screen).toMatchSnapshot()
  })

  it('should open ants url on press "Aller sur demarche.numerique.gouv.fr"', async () => {
    render(<ExpiredOrLostID />)

    await user.press(screen.getByText('Aller sur demarche.numerique.gouv.fr'))

    expect(openUrl).toHaveBeenCalledWith(env.DMS_FRENCH_CITIZEN_URL, undefined, true)
  })

  it('should send a batch event when the screen is mounted', async () => {
    render(<ExpiredOrLostID />)

    await waitFor(() =>
      expect(BatchProfile.trackEvent).toHaveBeenNthCalledWith(
        1,
        BatchEvent.screenViewExpiredOrLostId
      )
    )
  })
})
