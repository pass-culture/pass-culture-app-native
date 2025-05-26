import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
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
    it('should navigate to tutorial when button is triggered', async () => {
      render(<CreditExplanation isDepositExpired={false} age={18} />)
      const explanationButton = screen.getByTestId('Comment ça marche\u00a0?')
      await user.press(explanationButton)

      expect(navigate).toHaveBeenCalledWith('ProfileStackNavigator', {
        screen: 'ProfileTutorialAgeInformationCredit',
        params: undefined,
      })
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
