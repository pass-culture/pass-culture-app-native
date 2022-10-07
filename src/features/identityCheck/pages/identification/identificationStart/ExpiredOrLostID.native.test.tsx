import React from 'react'

import { ExpiredOrLostID } from 'features/identityCheck/pages/identification/identificationStart/ExpiredOrLostID'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { navigateFromRef } from 'features/navigation/navigationRef'
import { fireEvent, render } from 'tests/utils'

jest.mock('features/navigation/navigationRef')
const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

describe('ExpiredOrLostID', () => {
  it('should render correctly', () => {
    const ExpiredOrLostIDPage = render(<ExpiredOrLostID />)
    expect(ExpiredOrLostIDPage).toMatchSnapshot()
  })

  it('should navigate to home on press "M\'identifier plus tard"', () => {
    const { getByText } = render(<ExpiredOrLostID />)

    const button = getByText('M’identifier plus tard')
    fireEvent.press(button)
    expect(navigateFromRef).toBeCalledWith(navigateToHomeConfig.screen, navigateToHomeConfig.params)
  })

  it('should open ants url on press "Demander un renouvellement"', async () => {
    const { getByText } = render(<ExpiredOrLostID />)

    fireEvent.press(getByText('Demander un renouvellement'))

    expect(openUrl).toHaveBeenCalledWith('https://ants.gouv.fr/', undefined)
  })
})
