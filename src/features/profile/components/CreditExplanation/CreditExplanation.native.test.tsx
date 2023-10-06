import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { CreditExplanation } from 'features/profile/components/CreditExplanation/CreditExplanation'
import {
  domains_credit_v1,
  domains_exhausted_credit_v1,
} from 'features/profile/fixtures/domainsCredit'
import { analytics } from 'libs/analytics'
import { fireEvent, render } from 'tests/utils'

describe('<CreditExplanation/>', () => {
  it('should render correctly for expired deposit', () => {
    const renderAPI = render(
      <CreditExplanation isDepositExpired domainsCredit={domains_credit_v1} age={18} />
    )
    expect(renderAPI).toMatchSnapshot()
  })

  it('should render correctly for exhausted credit', () => {
    const renderAPI = render(
      <CreditExplanation
        isDepositExpired={false}
        domainsCredit={domains_exhausted_credit_v1}
        age={18}
      />
    )
    expect(renderAPI).toMatchSnapshot()
  })

  it('should render correctly for valid credit', () => {
    const renderAPI = render(
      <CreditExplanation isDepositExpired={false} domainsCredit={domains_credit_v1} age={18} />
    )
    expect(renderAPI).toMatchSnapshot()
  })

  describe('With modal', () => {
    it('should not display modal if button is not triggered', () => {
      const { queryByTestId } = render(
        <CreditExplanation isDepositExpired domainsCredit={domains_credit_v1} age={18} />
      )
      expect(queryByTestId('modalHeader')).not.toBeOnTheScreen()
    })

    it('should display modal when button is triggered', () => {
      const { getByTestId, queryByTestId } = render(
        <CreditExplanation isDepositExpired domainsCredit={domains_credit_v1} age={18} />
      )
      const explanationButton = getByTestId('Mon crédit est expiré, que\u00a0faire\u00a0?')
      fireEvent.press(explanationButton)
      expect(queryByTestId('modalHeader')).toBeOnTheScreen()
    })
  })

  describe('With redirection to tutorial', () => {
    it('should navigate to tutorial when button is triggered', () => {
      const { getByTestId } = render(
        <CreditExplanation isDepositExpired={false} domainsCredit={domains_credit_v1} age={18} />
      )
      const explanationButton = getByTestId('Comment ça marche\u00a0?')
      fireEvent.press(explanationButton)
      expect(navigate).toHaveBeenCalledWith('ProfileTutorialAgeInformation', { age: 18 })
    })

    it('should navigate to 17 years old tutorial when button is triggered and user is 17', () => {
      const { getByTestId } = render(
        <CreditExplanation isDepositExpired={false} domainsCredit={domains_credit_v1} age={17} />
      )
      const explanationButton = getByTestId('Comment ça marche\u00a0?')
      fireEvent.press(explanationButton)
      expect(navigate).toHaveBeenCalledWith('ProfileTutorialAgeInformation', { age: 17 })
    })
  })

  describe('Analytics', () => {
    it('should log logConsultModalExpiredGrant analytics when expired deposit and press the button "Mon crédit est expiré, que faire ?"', () => {
      const { getByText } = render(
        <CreditExplanation isDepositExpired domainsCredit={domains_credit_v1} age={18} />
      )

      const explanationButton = getByText('Mon crédit est expiré, que faire ?')
      fireEvent.press(explanationButton)

      expect(analytics.logConsultModalExpiredGrant).toHaveBeenCalledTimes(1)
    })

    it('should log logConsultModalNoMoreCredit analytics when exhausted credit and press the button "J’ai dépensé tout mon crédit, que faire ?"', () => {
      const { getByText } = render(
        <CreditExplanation
          isDepositExpired={false}
          domainsCredit={domains_exhausted_credit_v1}
          age={18}
        />
      )

      const explanationButton = getByText('J’ai dépensé tout mon crédit, que faire ?')
      fireEvent.press(explanationButton)

      expect(analytics.logConsultModalNoMoreCredit).toHaveBeenCalledTimes(1)
    })
  })
})
