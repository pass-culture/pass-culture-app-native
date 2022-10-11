import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { DMSIntroduction } from 'features/identityCheck/pages/identification/dms/DMSIntroduction'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { env } from 'libs/environment'
import { analytics } from 'libs/firebase/analytics'
import { fireEvent, render, waitFor } from 'tests/utils'

const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

describe('DMSIntroduction', () => {
  it('should render french version correctly', () => {
    useRoute.mockReturnValueOnce({
      params: {
        isForeignDMSInformation: false,
      },
    })
    const DMSIntroductionFR = render(<DMSIntroduction />)
    expect(DMSIntroductionFR).toMatchSnapshot()
  })

  it('should render foreign version correctly', () => {
    useRoute.mockReturnValueOnce({
      params: {
        isForeignDMSInformation: true,
      },
    })
    const DMSIntroductionFR = render(<DMSIntroduction />)
    expect(DMSIntroductionFR).toMatchSnapshot()
  })

  it('should open foreign dms link on press "Aller sur demarches-simplifiees.fr" when foreign route param is true', async () => {
    useRoute.mockReturnValueOnce({
      params: {
        isForeignDMSInformation: true,
      },
    })
    const { getByText } = render(<DMSIntroduction />)
    const button = getByText('Aller sur demarches-simplifiees.fr')

    fireEvent.press(button)

    await waitFor(() => {
      expect(openUrl).toHaveBeenCalledWith(env.DMS_FOREIGN_CITIZEN_URL, undefined)
    })
  })

  it('should open french dms link on press "Aller sur demarches-simplifiees.fr" when foreign route param is false', async () => {
    useRoute.mockReturnValueOnce({
      params: {
        isForeignDMSInformation: false,
      },
    })
    const { getByText } = render(<DMSIntroduction />)
    const button = getByText('Aller sur demarches-simplifiees.fr')

    fireEvent.press(button)

    await waitFor(() => {
      expect(openUrl).toHaveBeenCalledWith(env.DMS_FRENCH_CITIZEN_URL, undefined)
    })
  })

  it('should log event on french version when pressing "Aller sur demarches-simplifiees.fr" button', async () => {
    useRoute.mockReturnValueOnce({
      params: {
        isForeignDMSInformation: false,
      },
    })
    const { getByText } = render(<DMSIntroduction />)

    const button = getByText('Aller sur demarches-simplifiees.fr')
    fireEvent.press(button)

    expect(analytics.logOpenDMSFrenchCitizenURL).toHaveBeenCalled()
  })

  it('should log event on foreign version when pressing "Aller sur demarches-simplifiees.fr" button', async () => {
    useRoute.mockReturnValueOnce({
      params: {
        isForeignDMSInformation: true,
      },
    })
    const { getByText } = render(<DMSIntroduction />)

    const button = getByText('Aller sur demarches-simplifiees.fr')
    fireEvent.press(button)

    expect(analytics.logOpenDMSForeignCitizenURL).toHaveBeenCalled()
  })
})
