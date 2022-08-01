import React from 'react'

import { BeneficiaryCeilingsNew } from 'features/profile/components/headers/BeneficiaryCeilings/BeneficiaryCeilingsNew'
import {
  domains_credit_underage,
  domains_credit_v1,
  domains_credit_v2,
} from 'features/profile/components/headers/fixtures/domainsCredit'
import { render, waitFor } from 'tests/utils'

describe('BeneficiaryCeilingsNew', () => {
  it('should not return credits if domainsCredit is undefined', () => {
    const renderAPI = render(<BeneficiaryCeilingsNew isUserUnderageBeneficiary={false} />)
    expect(renderAPI.toJSON()).toBeNull()
  })

  it('should not return credits if user underage beneficiary', () => {
    const renderAPI = render(
      <BeneficiaryCeilingsNew domainsCredit={domains_credit_v1} isUserUnderageBeneficiary={true} />
    )
    expect(renderAPI.toJSON()).toBeNull()
  })

  describe('Domains credit v1', () => {
    it('should return physical and digital credits', async () => {
      const { queryByTestId } = render(
        <BeneficiaryCeilingsNew
          domainsCredit={domains_credit_v1}
          isUserUnderageBeneficiary={false}
        />
      )

      const digitalCredit = queryByTestId('domains-credit-digital')
      const physicalCredit = queryByTestId('domains-credit-physical')

      await waitFor(() => {
        expect(digitalCredit).toBeTruthy()
        expect(physicalCredit).toBeTruthy()
      })
    })
  })

  describe('Domains credit v2', () => {
    it('should return only digital credits', async () => {
      const { queryByTestId } = render(
        <BeneficiaryCeilingsNew
          domainsCredit={domains_credit_v2}
          isUserUnderageBeneficiary={false}
        />
      )

      const digitalCredit = queryByTestId('domains-credit-digital')
      const physicalCredit = queryByTestId('domains-credit-physical')

      await waitFor(() => {
        expect(digitalCredit).toBeTruthy()
        expect(physicalCredit).toBeFalsy()
      })
    })
  })

  describe('Domains credit underage', () => {
    it('should not return credits if domains credit underage and is not user underage beneficiary', () => {
      const renderAPI = render(
        <BeneficiaryCeilingsNew
          domainsCredit={domains_credit_underage}
          isUserUnderageBeneficiary={false}
        />
      )
      expect(renderAPI.toJSON()).toBeNull()
    })
  })
})
