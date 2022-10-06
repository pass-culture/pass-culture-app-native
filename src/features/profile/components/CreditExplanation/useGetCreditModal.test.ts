import {
  domains_credit_v1,
  domains_exhausted_credit_v1,
} from 'features/profile/fixtures/domainsCredit'
import * as ProfileUtils from 'features/profile/utils'

import { useGetCreditModal } from './useGetCreditModal'

const mockUseIsUserUnderageBeneficiary = jest
  .spyOn(ProfileUtils, 'useIsUserUnderageBeneficiary')
  .mockReturnValue(false)

describe('useGetCreditModal()', () => {
  it('should return ExpiredCreditModal if deposit is expired', async () => {
    const { creditModal } = useGetCreditModal({
      domainsCredit: domains_credit_v1,
      isDepositExpired: true,
    })

    expect(creditModal?.name).toBe('ExpiredCreditModal')
  })

  it('should return ExhaustedCreditModal if deposit is exhausted', async () => {
    const { creditModal } = useGetCreditModal({
      domainsCredit: domains_exhausted_credit_v1,
      isDepositExpired: false,
    })

    expect(creditModal?.name).toBe('ExhaustedCreditModal')
  })

  it('should return ExpiredCreditModal if deposit is expired AND deposit is exhausted', async () => {
    const { creditModal } = useGetCreditModal({
      domainsCredit: domains_exhausted_credit_v1,
      isDepositExpired: true,
    })

    expect(creditModal?.name).toBe('ExpiredCreditModal')
  })

  it('should return CreditCeilingsModal if deposit is not expired and not exhausted', async () => {
    const { creditModal } = useGetCreditModal({
      domainsCredit: domains_credit_v1,
      isDepositExpired: false,
    })

    expect(creditModal?.name).toBe('CreditCeilingsModal')
  })

  it('should return null for creditModal if deposit is not expired and not exhausted and beneficiary is underage', async () => {
    mockUseIsUserUnderageBeneficiary.mockReturnValueOnce(true)
    const { creditModal } = useGetCreditModal({
      domainsCredit: domains_credit_v1,
      isDepositExpired: false,
    })

    expect(creditModal).toBeNull()
  })
})
