import React from 'react'

import { ExpiredOrLostID } from 'features/identityCheck/pages/identification/identificationStart/ExpiredOrLostID'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { amplitude } from 'libs/amplitude'
import { env } from 'libs/environment'
import { fireEvent, render, waitFor } from 'tests/utils'

jest.mock('features/navigation/navigationRef')
const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

describe('ExpiredOrLostID', () => {
  it('should render correctly', () => {
    const ExpiredOrLostIDPage = render(<ExpiredOrLostID />)
    expect(ExpiredOrLostIDPage).toMatchSnapshot()
  })

  it('should open ants url on press "Aller sur demarches-simplifiees.fr"', async () => {
    const { getByText } = render(<ExpiredOrLostID />)

    fireEvent.press(getByText('Aller sur demarches-simplifiees.fr'))

    expect(openUrl).toHaveBeenCalledWith(env.DMS_FRENCH_CITIZEN_URL, undefined, true)
  })

  it('should send a amplitude event when the screen is mounted', async () => {
    render(<ExpiredOrLostID />)

    await waitFor(() =>
      expect(amplitude.logEvent).toHaveBeenNthCalledWith(1, 'screen_view_expired_or_lost_id')
    )
  })
})
