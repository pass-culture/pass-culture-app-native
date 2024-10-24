import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { DMSIntroduction } from 'features/identityCheck/pages/identification/dms/DMSIntroduction'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import * as useGoBack from 'features/navigation/useGoBack'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

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

describe('DMSIntroduction', () => {
  it('should log screen view when the screen is mounted', async () => {
    render(<DMSIntroduction />)

    await waitFor(() => expect(analytics.logScreenViewDMSIntroduction).toHaveBeenCalledTimes(1))
  })

  describe('french version', () => {
    beforeEach(() => {
      useRoute.mockReturnValueOnce({
        params: {
          isForeignDMSInformation: false,
        },
      })
    })

    it('should render correctly', () => {
      render(<DMSIntroduction />)

      expect(screen).toMatchSnapshot()
    })

    it('should open french dms link when pressing "Aller sur demarches-simplifiees.fr" button', async () => {
      render(<DMSIntroduction />)
      const button = screen.getByText('Aller sur demarches-simplifiees.fr')

      fireEvent.press(button)

      await waitFor(() => {
        expect(openUrl).toHaveBeenCalledWith(env.DMS_FRENCH_CITIZEN_URL, undefined, true)
      })
    })

    it('should log french DMS event when pressing "Aller sur demarches-simplifiees.fr" button', () => {
      render(<DMSIntroduction />)

      const button = screen.getByText('Aller sur demarches-simplifiees.fr')
      fireEvent.press(button)

      expect(analytics.logOpenDMSFrenchCitizenURL).toHaveBeenCalledTimes(1)
    })
  })

  describe('foreign version', () => {
    beforeEach(() => {
      useRoute.mockReturnValueOnce({
        params: {
          isForeignDMSInformation: true,
        },
      })
    })

    it('should render correctly', () => {
      render(<DMSIntroduction />)

      expect(screen).toMatchSnapshot()
    })

    it('should open foreign dms link when pressing "Aller sur demarches-simplifiees.fr" button', async () => {
      render(<DMSIntroduction />)
      const button = screen.getByText('Aller sur demarches-simplifiees.fr')

      fireEvent.press(button)

      await waitFor(() => {
        expect(openUrl).toHaveBeenCalledWith(env.DMS_FOREIGN_CITIZEN_URL, undefined, true)
      })
    })

    it('should log foreign DMS event when pressing "Aller sur demarches-simplifiees.fr" button', () => {
      render(<DMSIntroduction />)

      const button = screen.getByText('Aller sur demarches-simplifiees.fr')
      fireEvent.press(button)

      expect(analytics.logOpenDMSForeignCitizenURL).toHaveBeenCalledTimes(1)
    })
  })
})
