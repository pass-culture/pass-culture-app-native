import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { DMSIntroduction } from 'features/identityCheck/pages/identification/dms/DMSIntroduction'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { fireEvent, render, waitFor, screen } from 'tests/utils'

const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

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
