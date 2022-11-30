import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { DMSIntroduction } from 'features/identityCheck/pages/identification/dms/DMSIntroduction'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { amplitude } from 'libs/amplitude'
import { env } from 'libs/environment'
import { analytics } from 'libs/firebase/analytics'
import { fireEvent, render, waitFor } from 'tests/utils'

const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

describe('DMSIntroduction', () => {
  it('should send a amplitude event when the screen is mounted', async () => {
    render(<DMSIntroduction />)

    await waitFor(() =>
      expect(amplitude.logEvent).toHaveBeenNthCalledWith(1, 'screen_view_dms_introduction')
    )
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
      const DMSIntroductionFR = render(<DMSIntroduction />)
      expect(DMSIntroductionFR).toMatchSnapshot()
    })

    it('should open french dms link when pressing "Aller sur demarches-simplifiees.fr" button', async () => {
      const { getByText } = render(<DMSIntroduction />)
      const button = getByText('Aller sur demarches-simplifiees.fr')

      fireEvent.press(button)

      await waitFor(() => {
        expect(openUrl).toHaveBeenCalledWith(env.DMS_FRENCH_CITIZEN_URL, undefined)
      })
    })

    it('should log french DMS event when pressing "Aller sur demarches-simplifiees.fr" button', () => {
      const { getByText } = render(<DMSIntroduction />)

      const button = getByText('Aller sur demarches-simplifiees.fr')
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
      const DMSIntroductionFR = render(<DMSIntroduction />)
      expect(DMSIntroductionFR).toMatchSnapshot()
    })

    it('should open foreign dms link when pressing "Aller sur demarches-simplifiees.fr" button', async () => {
      const { getByText } = render(<DMSIntroduction />)
      const button = getByText('Aller sur demarches-simplifiees.fr')

      fireEvent.press(button)

      await waitFor(() => {
        expect(openUrl).toHaveBeenCalledWith(env.DMS_FOREIGN_CITIZEN_URL, undefined)
      })
    })

    it('should log foreign DMS event when pressing "Aller sur demarches-simplifiees.fr" button', () => {
      const { getByText } = render(<DMSIntroduction />)

      const button = getByText('Aller sur demarches-simplifiees.fr')
      fireEvent.press(button)

      expect(analytics.logOpenDMSForeignCitizenURL).toHaveBeenCalledTimes(1)
    })
  })
})
