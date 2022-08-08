import React from 'react'

import { BeneficiaryCeilings } from 'features/profile/components/BeneficiaryCeilings/BeneficiaryCeilings'
import {
  domains_credit_underage,
  domains_credit_v1,
  domains_credit_v2,
  domains_exhausted_credit_v1,
} from 'features/profile/fixtures/domainsCredit'
import { render, waitFor } from 'tests/utils'

describe('BeneficiaryCeilings', () => {
  it('should not return credits if credit is exhausted', () => {
    const renderAPI = render(
      <BeneficiaryCeilings
        domainsCredit={domains_exhausted_credit_v1}
        isUserUnderageBeneficiary={false}
      />
    )
    expect(renderAPI.toJSON()).toBeNull()
  })

  it('should not return credits if user underage beneficiary', () => {
    const renderAPI = render(
      <BeneficiaryCeilings domainsCredit={domains_credit_v1} isUserUnderageBeneficiary={true} />
    )
    expect(renderAPI.toJSON()).toBeNull()
  })

  describe('Domains credit v1', () => {
    it('should return physical and digital credits', async () => {
      const { queryByTestId } = render(
        <BeneficiaryCeilings domainsCredit={domains_credit_v1} isUserUnderageBeneficiary={false} />
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
        <BeneficiaryCeilings domainsCredit={domains_credit_v2} isUserUnderageBeneficiary={false} />
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
        <BeneficiaryCeilings
          domainsCredit={domains_credit_underage}
          isUserUnderageBeneficiary={false}
        />
      )
      expect(renderAPI.toJSON()).toBeNull()
    })
  })
})
