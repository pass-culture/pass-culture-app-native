import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { DMSIntroduction } from 'features/identityCheck/pages/identification/dms/DMSIntroduction'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import * as useGoBack from 'features/navigation/useGoBack'
import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/env'
import { render, screen, userEvent } from 'tests/utils'

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

describe('DMSIntroduction', () => {
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

    it('should open french dms link when pressing "Aller sur demarche.numerique.gouv.fr" button', async () => {
      render(<DMSIntroduction />)

      await user.press(screen.getByText('Aller sur demarche.numerique.gouv.fr'))

      expect(openUrl).toHaveBeenCalledWith(env.DMS_FRENCH_CITIZEN_URL, undefined, true)
    })

    it('should log french DMS event when pressing "Aller sur demarche.numerique.gouv.fr" button', async () => {
      render(<DMSIntroduction />)

      await user.press(screen.getByText('Aller sur demarche.numerique.gouv.fr'))

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

    it('should open foreign dms link when pressing "Aller sur demarche.numerique.gouv.fr" button', async () => {
      render(<DMSIntroduction />)

      await user.press(screen.getByText('Aller sur demarche.numerique.gouv.fr'))

      expect(openUrl).toHaveBeenCalledWith(env.DMS_FOREIGN_CITIZEN_URL, undefined, true)
    })

    it('should log foreign DMS event when pressing "Aller sur demarche.numerique.gouv.fr" button', async () => {
      render(<DMSIntroduction />)

      await user.press(screen.getByText('Aller sur demarche.numerique.gouv.fr'))

      expect(analytics.logOpenDMSForeignCitizenURL).toHaveBeenCalledTimes(1)
    })
  })
})
