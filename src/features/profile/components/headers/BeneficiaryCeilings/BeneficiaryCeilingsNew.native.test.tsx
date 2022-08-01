import React from 'react'

import { BeneficiaryCeilingsNew } from 'features/profile/components/headers/BeneficiaryCeilings/BeneficiaryCeilingsNew'
import { render, waitFor } from 'tests/utils'

const domains_credit_v1 = {
  all: { initial: 50000, remaining: 40000 },
  physical: { initial: 30000, remaining: 10000 },
  digital: { initial: 30000, remaining: 20000 },
}

const domains_credit_v2 = {
  all: { initial: 30000, remaining: 10000 },
  digital: { initial: 20000, remaining: 5000 },
}

const domains_credit_underage = {
  all: { initial: 3000, remaining: 1000 },
}

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
