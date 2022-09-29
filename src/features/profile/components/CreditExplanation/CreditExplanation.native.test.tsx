import React from 'react'

import { CreditExplanation } from 'features/profile/components/CreditExplanation/CreditExplanation'
import {
  domains_credit_v1,
  domains_exhausted_credit_v1,
} from 'features/profile/fixtures/domainsCredit'
import { analytics } from 'libs/firebase/analytics'
import { fireEvent, render } from 'tests/utils'

describe('<CreditExplanation/>', () => {
  it('should render correctly for expired deposit', () => {
    const renderAPI = render(
      <CreditExplanation
        isDepositExpired={true}
        isUserUnderageBeneficiary={false}
        domainsCredit={domains_credit_v1}
      />
    )
    expect(renderAPI).toMatchSnapshot()
  })

  it('should render correctly for exhausted credit', () => {
    const renderAPI = render(
      <CreditExplanation
        isDepositExpired={false}
        isUserUnderageBeneficiary={false}
        domainsCredit={domains_exhausted_credit_v1}
      />
    )
    expect(renderAPI).toMatchSnapshot()
  })

  it('should render correctly for valid credit', () => {
    const renderAPI = render(
      <CreditExplanation
        isDepositExpired={false}
        isUserUnderageBeneficiary={false}
        domainsCredit={domains_credit_v1}
      />
    )
    expect(renderAPI).toMatchSnapshot()
  })

  it('should render nothing for valid credit and underage beneficiary', () => {
    const renderAPI = render(
      <CreditExplanation
        isDepositExpired={false}
        isUserUnderageBeneficiary={true}
        domainsCredit={domains_credit_v1}
      />
    )
    expect(renderAPI.toJSON()).toBeNull()
  })

  it('should not display modal if button is not triggered', () => {
    const { queryByTestId } = render(
      <CreditExplanation
        isDepositExpired={false}
        isUserUnderageBeneficiary={false}
        domainsCredit={domains_credit_v1}
      />
    )
    expect(queryByTestId('modalHeader')).toBeNull()
  })

  it('should display modal when button is triggered', () => {
    const { getByTestId, queryByTestId } = render(
      <CreditExplanation
        isDepositExpired={false}
        isUserUnderageBeneficiary={false}
        domainsCredit={domains_credit_v1}
      />
    )
    const explanationButton = getByTestId('explanationButton')
    fireEvent.press(explanationButton)
    expect(queryByTestId('modalHeader')).toBeTruthy()
  })

  describe('Analytics', () => {
    it('should log logConsultModalBeneficiaryCeilings analytics and press the button "Pourquoi cette limite ?"', () => {
      const { getByText } = render(
        <CreditExplanation
          isDepositExpired={false}
          isUserUnderageBeneficiary={false}
          domainsCredit={domains_credit_v1}
        />
      )

      const explanationButton = getByText('Pourquoi cette limite ?')
      fireEvent.press(explanationButton)

      expect(analytics.logConsultModalBeneficiaryCeilings).toBeCalled()
    })

    it('should log logConsultModalExpiredGrant analytics when expired deposit and press the button "Mon crédit est expiré, que faire ?"', () => {
      const { getByText } = render(
        <CreditExplanation
          isDepositExpired={true}
          isUserUnderageBeneficiary={false}
          domainsCredit={domains_credit_v1}
        />
      )

      const explanationButton = getByText('Mon crédit est expiré, que faire ?')
      fireEvent.press(explanationButton)

      expect(analytics.logConsultModalExpiredGrant).toBeCalled()
    })

    it('should log logConsultModalNoMoreCredit analytics when exhausted credit and press the button "J’ai dépensé tout mon crédit, que faire ?"', () => {
      const { getByText } = render(
        <CreditExplanation
          isDepositExpired={false}
          isUserUnderageBeneficiary={false}
          domainsCredit={domains_exhausted_credit_v1}
        />
      )

      const explanationButton = getByText('J’ai dépensé tout mon crédit, que faire ?')
      fireEvent.press(explanationButton)

      expect(analytics.logConsultModalNoMoreCredit).toBeCalled()
    })
  })
})
