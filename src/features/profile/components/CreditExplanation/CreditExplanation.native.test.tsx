import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { setSettings } from 'features/auth/tests/setSettings'
import { CreditExplanation } from 'features/profile/components/CreditExplanation/CreditExplanation'
import { analytics } from 'libs/analytics/provider'
import { render, screen, userEvent } from 'tests/utils'

const user = userEvent.setup()
jest.useFakeTimers()

describe('<CreditExplanation/>', () => {
  it('should render correctly for expired deposit', () => {
    render(<CreditExplanation isDepositExpired age={18} />)

    expect(screen.getByText('Mon crédit est expiré, que faire ?')).toBeOnTheScreen()
  })

  it('should render correctly for valid credit', () => {
    render(<CreditExplanation isDepositExpired={false} age={18} />)

    expect(screen.getByText('Comment ça marche ?')).toBeOnTheScreen()
  })

  describe('With modal', () => {
    it('should not display modal if button is not triggered', () => {
      render(<CreditExplanation isDepositExpired age={18} />)

      expect(screen.queryByTestId('modalHeader')).not.toBeOnTheScreen()
    })

    it('should display modal when button is triggered', async () => {
      render(<CreditExplanation isDepositExpired age={18} />)
      const explanationButton = screen.getByTestId('Mon crédit est expiré, que\u00a0faire\u00a0?')
      await user.press(explanationButton)

      expect(screen.getByTestId('modalHeader')).toBeOnTheScreen()
    })
  })

  describe('With redirection to tutorial', () => {
    beforeEach(() => {
      setSettings()
    })

    it('should navigate to tutorial when button is triggered', async () => {
      render(<CreditExplanation isDepositExpired={false} age={18} />)
      const explanationButton = screen.getByTestId('Comment ça marche\u00a0?')
      await user.press(explanationButton)

      expect(navigate).toHaveBeenCalledWith('ProfileTutorialAgeInformation', { age: 18 })
    })

    it('should navigate to tutorial CreditV3 when button is triggered and enableCreditV3 is true', async () => {
      setSettings({ wipEnableCreditV3: true })

      render(<CreditExplanation isDepositExpired={false} age={18} />)
      const explanationButton = screen.getByTestId('Comment ça marche\u00a0?')
      await user.press(explanationButton)

      expect(navigate).toHaveBeenCalledWith('ProfileTutorialAgeInformationCreditV3', undefined)
    })

    it('should navigate to 17 years old tutorial when button is triggered and user is 17', async () => {
      render(<CreditExplanation isDepositExpired={false} age={17} />)
      const explanationButton = screen.getByTestId('Comment ça marche\u00a0?')
      await user.press(explanationButton)

      expect(navigate).toHaveBeenCalledWith('ProfileTutorialAgeInformation', { age: 17 })
    })
  })

  describe('Analytics', () => {
    it('should log logConsultModalExpiredGrant analytics when expired deposit and press the button "Mon crédit est expiré, que faire ?"', async () => {
      render(<CreditExplanation isDepositExpired age={18} />)

      const explanationButton = screen.getByText('Mon crédit est expiré, que faire ?')
      await user.press(explanationButton)

      expect(analytics.logConsultModalExpiredGrant).toHaveBeenCalledTimes(1)
    })

    it('should log logConsultTutorial analytics when pressing the button "Comment ça marche ?"', async () => {
      render(<CreditExplanation isDepositExpired={false} age={18} />)

      const explanationButton = screen.getByText('Comment ça marche ?')
      await user.press(explanationButton)

      expect(analytics.logConsultTutorial).toHaveBeenCalledWith({ from: 'CreditBlock', age: 18 })
    })
  })
})
