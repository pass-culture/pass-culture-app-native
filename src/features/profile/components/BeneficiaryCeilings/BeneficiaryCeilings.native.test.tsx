import React from 'react'

import { BeneficiaryCeilings } from 'features/profile/components/BeneficiaryCeilings/BeneficiaryCeilings'
import {
  domains_credit_underage,
  domains_credit_v1,
  domains_credit_v2,
  domains_exhausted_credit_v1,
} from 'features/profile/fixtures/domainsCredit'
import * as ProfileUtils from 'features/profile/helpers/useIsUserUnderageBeneficiary'
import { render, waitFor, screen } from 'tests/utils'

const mockUseIsUserUnderageBeneficiary = jest
  .spyOn(ProfileUtils, 'useIsUserUnderageBeneficiary')
  .mockReturnValue(false)

describe('BeneficiaryCeilings', () => {
  it('should not return credits if credit is exhausted', () => {
    render(<BeneficiaryCeilings domainsCredit={domains_exhausted_credit_v1} />)
    expect(screen.toJSON()).not.toBeOnTheScreen()
  })

  describe('Domains credit v1', () => {
    it('should return physical and digital credits', async () => {
      render(<BeneficiaryCeilings domainsCredit={domains_credit_v1} />)

      const digitalCredit = screen.queryByTestId('domains-credit-digital')
      const physicalCredit = screen.queryByTestId('domains-credit-physical')

      await waitFor(() => {
        expect(digitalCredit).toBeOnTheScreen()
        expect(physicalCredit).toBeOnTheScreen()
      })
    })
  })

  describe('Domains credit v2', () => {
    it('should return only digital credits', async () => {
      render(<BeneficiaryCeilings domainsCredit={domains_credit_v2} />)

      const digitalCredit = screen.queryByTestId('domains-credit-digital')
      const physicalCredit = screen.queryByTestId('domains-credit-physical')

      await waitFor(() => {
        expect(digitalCredit).toBeOnTheScreen()
        expect(physicalCredit).not.toBeOnTheScreen()
      })
    })
  })

  describe('Domains credit underage', () => {
    it('should not return credits if domains credit underage and is not user underage beneficiary', () => {
      render(<BeneficiaryCeilings domainsCredit={domains_credit_underage} />)
      expect(screen.toJSON()).not.toBeOnTheScreen()
    })
  })

  it('should not return credits if user underage beneficiary', () => {
    mockUseIsUserUnderageBeneficiary.mockReturnValueOnce(true)
    render(<BeneficiaryCeilings domainsCredit={domains_credit_v1} />)
    expect(screen.toJSON()).not.toBeOnTheScreen()
  })
})
