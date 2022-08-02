import React from 'react'

import { CreditExplanation } from 'features/profile/components/CreditExplanation/CreditExplanation'
import { domains_credit_v1 } from 'features/profile/components/headers/fixtures/domainsCredit'
import { fireEvent, render } from 'tests/utils'

const dateInPast = '2022-08-01T18:00:00'
const dateInFutur = new Date()
dateInFutur.setDate(dateInFutur.getDate() + 1)

const exhaustedCredit = { ...domains_credit_v1, all: { ...domains_credit_v1.all, remaining: 0 } }

describe('<CreditExplanation/>', () => {
  it('should render correctly for expired deposit', () => {
    const renderAPI = render(
      <CreditExplanation
        depositExpirationDate={dateInPast}
        isUserUnderageBeneficiary={false}
        domainsCredit={domains_credit_v1}
      />
    )
    expect(renderAPI).toMatchSnapshot()
  })

  it('should render correctly for exhausted credit', () => {
    const renderAPI = render(
      <CreditExplanation
        depositExpirationDate={dateInFutur.toISOString()}
        isUserUnderageBeneficiary={false}
        domainsCredit={exhaustedCredit}
      />
    )
    expect(renderAPI).toMatchSnapshot()
  })

  it('should render correctly for valid credit', () => {
    const renderAPI = render(
      <CreditExplanation
        depositExpirationDate={dateInFutur.toISOString()}
        isUserUnderageBeneficiary={false}
        domainsCredit={domains_credit_v1}
      />
    )
    expect(renderAPI).toMatchSnapshot()
  })

  it('should render nothing for valid credit and underage beneficiary', () => {
    const renderAPI = render(
      <CreditExplanation
        depositExpirationDate={dateInFutur.toISOString()}
        isUserUnderageBeneficiary={true}
        domainsCredit={domains_credit_v1}
      />
    )
    expect(renderAPI.toJSON()).toBeNull()
  })

  it('should not display modal if button is not triggered', () => {
    const { queryByTestId } = render(
      <CreditExplanation
        depositExpirationDate={dateInFutur.toISOString()}
        isUserUnderageBeneficiary={false}
        domainsCredit={domains_credit_v1}
      />
    )
    expect(queryByTestId('modalHeader')).toBeNull()
  })

  it('should display modal when button is triggered', () => {
    const { getByTestId, queryByTestId } = render(
      <CreditExplanation
        depositExpirationDate={dateInFutur.toISOString()}
        isUserUnderageBeneficiary={false}
        domainsCredit={domains_credit_v1}
      />
    )
    const explanationButton = getByTestId('explanationButton')
    fireEvent.press(explanationButton)
    expect(queryByTestId('modalHeader')).toBeTruthy()
  })
})
