import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { SuspensionChoiceExpiredLink } from 'features/trustedDevice/pages/SuspensionChoiceExpiredLink'
import { env } from 'libs/environment'
import { render, screen, fireEvent } from 'tests/utils'

const mockOpenUrl = jest.spyOn(NavigationHelpers, 'openUrl')

describe('<SuspensionChoiceExpiredLink/>', () => {
  it('should match snapshot', () => {
    render(<SuspensionChoiceExpiredLink />)

    expect(screen).toMatchSnapshot()
  })

  it('should redirect to home page when "Retourner à l’accueil" button is clicked', () => {
    render(<SuspensionChoiceExpiredLink />)

    const goHomeButton = screen.getByText('Retourner à l’accueil')
    fireEvent.press(goHomeButton)

    expect(navigate).toHaveBeenNthCalledWith(
      1,
      navigateToHomeConfig.screen,
      navigateToHomeConfig.params
    )
  })

  it('should open mail app when "Contacter le support" button is clicked', async () => {
    render(<SuspensionChoiceExpiredLink />)

    const contactFraudButton = screen.getByText('Contacter le support')
    fireEvent.press(contactFraudButton)

    expect(mockOpenUrl).toHaveBeenNthCalledWith(
      1,
      `mailto:${env.FRAUD_EMAIL_ADDRESS}`,
      undefined,
      true
    )
  })
})
