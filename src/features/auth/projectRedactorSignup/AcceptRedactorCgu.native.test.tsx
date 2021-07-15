import React from 'react'
import { Linking } from 'react-native'
import waitForExpect from 'wait-for-expect'

import { goBack, useRoute } from '__mocks__/@react-navigation/native'
import { AcceptRedactorCgu } from 'features/auth/projectRedactorSignup/AcceptRedactorCgu'
import { contactSupport } from 'features/auth/support.services'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { fireEvent, render } from 'tests/utils'
import { ColorsEnum } from 'ui/theme'

afterEach(jest.clearAllMocks)

describe('AcceptCgu Page', () => {
  jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(true)
  beforeAll(() => {
    useRoute.mockImplementation(() => ({
      params: {
        email: 'john.doe@example.com',
        password: 'user@AZERTY123',
      },
    }))
  })

  it('should navigate to the previous page on back navigation', () => {
    const { getByTestId } = renderAcceptRedactorCgu()
    const leftIcon = getByTestId('leftIcon')
    fireEvent.press(leftIcon)

    expect(goBack).toBeCalledTimes(1)
  })

  it('should open mail app when clicking on contact support button', async () => {
    const { findByText } = renderAcceptRedactorCgu()

    const contactSupportButton = await findByText('Contacter le support')
    fireEvent.press(contactSupportButton)

    await waitForExpect(() => {
      expect(contactSupport.forGenericQuestion).toBeCalledTimes(1)
    })
  })

  it('should redirect to the "CGU" page', async () => {
    const { getByTestId } = renderAcceptRedactorCgu()

    const link = getByTestId('external-link-cgu')
    fireEvent.press(link)

    await waitForExpect(() => {
      expect(Linking.openURL).toHaveBeenCalledWith(env.CGU_LINK)
    })
  })

  it('should redirect to the "Politique de confidentialité" page', async () => {
    const { getByTestId } = renderAcceptRedactorCgu()

    const link = getByTestId('external-link-privacy-policy')
    fireEvent.press(link)

    await waitForExpect(() => {
      expect(Linking.openURL).toHaveBeenCalledWith(env.PRIVACY_POLICY_LINK)
    })
  })

  it('should open quit signup modal', () => {
    const { getByTestId, queryByText } = renderAcceptRedactorCgu()

    const rightIcon = getByTestId('rightIcon')
    fireEvent.press(rightIcon)

    const title = queryByText("Voulez-vous abandonner l'inscription ?")
    expect(title).toBeTruthy()
  })

  it('should display 3 step dots with the last one as current step', () => {
    const { getAllByTestId } = renderAcceptRedactorCgu()
    const dots = getAllByTestId('dot-icon')
    expect(dots.length).toBe(3)
    expect(dots[2].props.fill).toEqual(ColorsEnum.PRIMARY)
  })

  describe('<AcceptRedactorCgu /> - Analytics', () => {
    it('should log CancelSignup when clicking on "Abandonner l\'inscription"', () => {
      const { getByTestId, getByText } = renderAcceptRedactorCgu()

      const rightIcon = getByTestId('rightIcon')
      fireEvent.press(rightIcon)

      const abandonButton = getByText("Abandonner l'inscription")
      fireEvent.press(abandonButton)

      expect(analytics.logCancelSignup).toHaveBeenCalledTimes(1)
      expect(analytics.logCancelSignup).toHaveBeenCalledWith('RedactorCGU')
    })
  })
})

function renderAcceptRedactorCgu() {
  return render(<AcceptRedactorCgu />)
}
