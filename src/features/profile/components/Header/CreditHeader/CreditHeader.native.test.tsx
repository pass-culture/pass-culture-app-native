import React from 'react'

import {
  CreditHeader,
  CreditHeaderProps,
} from 'features/profile/components/Header/CreditHeader/CreditHeader'
import {
  domains_credit_v1,
  domains_exhausted_credit_v1,
} from 'features/profile/fixtures/domainsCredit'
import * as ProfileUtils from 'features/profile/helpers/useIsUserUnderageBeneficiary'
import { formatToSlashedFrenchDate, setDateOneDayEarlier } from 'libs/dates'
import { render } from 'tests/utils'

jest.mock('features/profile/api/useResetRecreditAmountToShow')

const mockUseIsUserUnderageBeneficiary = jest
  .spyOn(ProfileUtils, 'useIsUserUnderageBeneficiary')
  .mockReturnValue(false)

const dateInPast = '2022-08-01T18:00:00'
const dateInFuture = '2100-02-09T11:17:14.786670'

describe('CreditHeader', () => {
  describe('Beneficiary is not underage', () => {
    it('should render correctly with valid non exhausted credit', () => {
      const renderAPI = renderCreditHeader()
      expect(renderAPI).toMatchSnapshot()
    })

    it('should render correctly with expired credit', () => {
      const renderAPI = renderCreditHeader({ depositExpirationDate: dateInPast })
      expect(renderAPI).toMatchSnapshot()
    })

    it('should render correctly with exhausted credit', () => {
      const renderAPI = renderCreditHeader({ domainsCredit: domains_exhausted_credit_v1 })
      expect(renderAPI).toMatchSnapshot()
    })

    it('should display user name', () => {
      const { queryByText } = renderCreditHeader()
      const name = queryByText('Rosa Bonheur')
      expect(name).toBeOnTheScreen()
    })

    it('should display deposit expiration date', () => {
      const { queryByText } = renderCreditHeader()
      const depositExpirationDate = queryByText(
        formatToSlashedFrenchDate(setDateOneDayEarlier(dateInFuture))
      )
      expect(depositExpirationDate).toBeOnTheScreen()
    })

    it('should display credit ceilings', () => {
      const { queryByTestId } = renderCreditHeader()
      const digitalCredit = queryByTestId('domains-credit-digital')
      const physicalCredit = queryByTestId('domains-credit-physical')
      expect(digitalCredit).toBeOnTheScreen()
      expect(physicalCredit).toBeOnTheScreen()
    })

    it('should display credit info', () => {
      const { queryByTestId } = renderCreditHeader()
      const creditInfo = queryByTestId('credit-info')
      expect(creditInfo).toBeOnTheScreen()
    })

    it('should display explanation button', () => {
      const { queryByTestId } = renderCreditHeader()
      const explanationButton = queryByTestId('Pourquoi cette limite ?')
      expect(explanationButton).toBeOnTheScreen()
    })

    it('should not display credit info and ceilings for expired credit', () => {
      const { queryByTestId } = renderCreditHeader({ depositExpirationDate: dateInPast })
      const creditInfo = queryByTestId('credit-info')
      const digitalCredit = queryByTestId('domains-credit-digital')
      const physicalCredit = queryByTestId('domains-credit-physical')
      expect(creditInfo).not.toBeOnTheScreen()
      expect(digitalCredit).not.toBeOnTheScreen()
      expect(physicalCredit).not.toBeOnTheScreen()
    })
  })

  describe('Beneficiary is underage', () => {
    beforeEach(() => {
      mockUseIsUserUnderageBeneficiary.mockReturnValueOnce(true)
    })

    it('should render correctly for underage beneficiary', () => {
      const renderAPI = renderCreditHeader()
      expect(renderAPI).toMatchSnapshot({})
    })

    it('should not display credit ceilings for underage beneficiary', () => {
      const { queryByTestId } = renderCreditHeader()
      const digitalCredit = queryByTestId('domains-credit-digital')
      const physicalCredit = queryByTestId('domains-credit-physical')
      expect(digitalCredit).not.toBeOnTheScreen()
      expect(physicalCredit).not.toBeOnTheScreen()
    })
  })
})

const renderCreditHeader = (props?: Partial<CreditHeaderProps>) => {
  return render(
    <CreditHeader
      firstName="Rosa"
      lastName="Bonheur"
      depositExpirationDate={dateInFuture}
      domainsCredit={domains_credit_v1}
      {...props}
    />
  )
}
