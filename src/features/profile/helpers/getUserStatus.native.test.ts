import { EligibilityType } from 'api/gen'
import { beneficiaryUser, nonBeneficiaryUser } from 'fixtures/user'
import { getAge } from 'shared/user/getAge'

import { getUserStatus } from './getUserStatus'

jest.mock('shared/user/getAge')

const mockedGetAge = getAge as jest.Mock

describe('getUserStatus', () => {
  beforeEach(() => jest.clearAllMocks())

  it('should return FIFTEEN non beneficiary eligible (free)', () => {
    mockedGetAge.mockReturnValueOnce(15)
    const user = { ...nonBeneficiaryUser, eligibility: EligibilityType['free'] }
    const result = getUserStatus({ user })

    expect(result.FIFTEEN.NON_BENEFICIARY_ELIGIBLE).toBe(true)
    expect(result.GENERAL_PUBLIC).toBe(false)
  })

  it('should return SIXTEEN non beneficiary eligible (free)', () => {
    mockedGetAge.mockReturnValueOnce(16)
    const user = { ...nonBeneficiaryUser, eligibility: EligibilityType['free'] }
    const result = getUserStatus({ user })

    expect(result.SIXTEEN.NON_BENEFICIARY_ELIGIBLE).toBe(true)
  })

  it('should return SEVENTEEN eligible (age-17-18)', () => {
    mockedGetAge.mockReturnValueOnce(17)
    const user = { ...nonBeneficiaryUser, eligibility: EligibilityType['age-17-18'] }
    const result = getUserStatus({ user })

    expect(result.SEVENTEEN.NON_BENEFICIARY_ELIGIBLE).toBe(true)
  })

  it('should return EIGHTEEN eligible (age-17-18)', () => {
    mockedGetAge.mockReturnValueOnce(18)
    const user = { ...nonBeneficiaryUser, eligibility: EligibilityType['age-17-18'] }
    const result = getUserStatus({ user })

    expect(result.EIGHTEEN.NON_BENEFICIARY_ELIGIBLE).toBe(true)
  })

  it('should return GENERAL_PUBLIC for non beneficiary above 18', () => {
    mockedGetAge.mockReturnValueOnce(19)
    const result = getUserStatus({ user: nonBeneficiaryUser })

    expect(result.GENERAL_PUBLIC).toBe(true)
  })

  it('should not return GENERAL_PUBLIC if beneficiary', () => {
    mockedGetAge.mockReturnValueOnce(19)
    const user = { ...beneficiaryUser, isBeneficiary: true }
    const result = getUserStatus({ user })

    expect(result.GENERAL_PUBLIC).toBe(false)
  })

  it('should return empty status if conditions are not met', () => {
    mockedGetAge.mockReturnValueOnce(15)
    const user = { ...nonBeneficiaryUser, eligibility: EligibilityType['age-17-18'] }
    const result = getUserStatus({ user })

    expect(result.FIFTEEN.NON_BENEFICIARY_ELIGIBLE).toBe(false)
  })
})
