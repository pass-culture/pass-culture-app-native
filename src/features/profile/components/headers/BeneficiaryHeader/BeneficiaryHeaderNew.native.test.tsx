import React from 'react'

import {
  BeneficiaryHeaderNew,
  BeneficiaryHeaderProps,
} from 'features/profile/components/headers/BeneficiaryHeader/BeneficiaryHeaderNew'
import {
  domains_credit_v1,
  domains_exhausted_credit_v1,
} from 'features/profile/components/headers/fixtures/domainsCredit'
import * as ProfileUtils from 'features/profile/utils'
import { formatToSlashedFrenchDate } from 'libs/dates'
import { render } from 'tests/utils'

jest.mock('features/profile/api')

const dateInPast = '2022-08-01T18:00:00'
const dateInFuture = new Date()
dateInFuture.setDate(dateInFuture.getDate() + 1)

describe('BeneficiaryHeaderNew', () => {
  describe('Beneficiary is not underage', () => {
    it('should render correctly with valid non exhausted credit', () => {
      const renderAPI = renderBeneficiaryHeaderNew()
      expect(renderAPI).toMatchSnapshot()
    })

    it('should render correctly with expired credit', () => {
      const renderAPI = renderBeneficiaryHeaderNew({ depositExpirationDate: dateInPast })
      expect(renderAPI).toMatchSnapshot()
    })

    it('should render correctly with exhausted credit', () => {
      const renderAPI = renderBeneficiaryHeaderNew({ domainsCredit: domains_exhausted_credit_v1 })
      expect(renderAPI).toMatchSnapshot()
    })

    it('should display user name', () => {
      const { queryByText } = renderBeneficiaryHeaderNew()
      const name = queryByText('Rosa Bonheur')
      expect(name).toBeTruthy()
    })

    it('should display deposit expiration date', () => {
      const { queryByText } = renderBeneficiaryHeaderNew()
      const depositExpirationDate = queryByText(
        formatToSlashedFrenchDate(dateInFuture.toISOString())
      )
      expect(depositExpirationDate).toBeTruthy()
    })

    it('should display credit ceilings', () => {
      const { queryByTestId } = renderBeneficiaryHeaderNew()
      const digitalCredit = queryByTestId('domains-credit-digital')
      const physicalCredit = queryByTestId('domains-credit-physical')
      expect(digitalCredit).toBeTruthy()
      expect(physicalCredit).toBeTruthy()
    })

    it('should display credit info', () => {
      const { queryByTestId } = renderBeneficiaryHeaderNew()
      const creditInfo = queryByTestId('credit-info')
      expect(creditInfo).toBeTruthy()
    })

    it('should display explanation button', () => {
      const { queryByTestId } = renderBeneficiaryHeaderNew()
      const explanationButton = queryByTestId('explanationButton')
      expect(explanationButton).toBeTruthy()
    })

    it('should not display credit info and ceilings for expired credit', () => {
      const { queryByTestId } = renderBeneficiaryHeaderNew({ depositExpirationDate: dateInPast })
      const creditInfo = queryByTestId('credit-info')
      const digitalCredit = queryByTestId('domains-credit-digital')
      const physicalCredit = queryByTestId('domains-credit-physical')
      expect(creditInfo).toBeNull()
      expect(digitalCredit).toBeNull()
      expect(physicalCredit).toBeNull()
    })
  })

  describe('Beneficiary is not underage', () => {
    beforeAll(() => {
      jest.spyOn(ProfileUtils, 'useIsUserUnderageBeneficiary').mockReturnValue(true)
    })

    it('should render correctly for underage beneficiary', () => {
      const renderAPI = renderBeneficiaryHeaderNew()
      expect(renderAPI).toMatchSnapshot({})
    })

    it('should not display credit ceilings for underage beneficiary', () => {
      const { queryByTestId } = renderBeneficiaryHeaderNew()
      const digitalCredit = queryByTestId('domains-credit-digital')
      const physicalCredit = queryByTestId('domains-credit-physical')
      expect(digitalCredit).toBeNull()
      expect(physicalCredit).toBeNull()
    })
  })
})

const renderBeneficiaryHeaderNew = (props?: Partial<BeneficiaryHeaderProps>) => {
  return render(
    <BeneficiaryHeaderNew
      firstName="Rosa"
      lastName="Bonheur"
      depositExpirationDate={dateInFuture.toISOString()}
      domainsCredit={domains_credit_v1}
      {...props}
    />
  )
}
