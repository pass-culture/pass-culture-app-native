import { QFBonificationStatus } from 'api/gen'
import { BonificationQFRefusedType } from 'features/bonification/types/BonificationRefusedType'
import { getQFBonificationRefusedType } from 'features/profile/helpers/getQFBonificationRefusedType'

describe('getQFBonificationRefusedType', () => {
  it.each([
    [QFBonificationStatus.custodian_not_found, BonificationQFRefusedType.CUSTODIAN_NOT_FOUND],
    [QFBonificationStatus.application_not_found, BonificationQFRefusedType.APPLICATION_NOT_FOUND],
    [QFBonificationStatus.too_many_retries, BonificationQFRefusedType.TOO_MANY_RETRIES],
    [QFBonificationStatus.not_in_tax_household, BonificationQFRefusedType.NOT_IN_TAX_HOUSEHOLD],
    [
      QFBonificationStatus.quotient_familial_too_high,
      BonificationQFRefusedType.QUOTIENT_FAMILY_TOO_HIGH,
    ],
  ])('should return refused type for %s', (status, expected) => {
    expect(getQFBonificationRefusedType(status)).toBe(expected)
  })

  it('should return undefined when status is undefined', () => {
    expect(getQFBonificationRefusedType()).toBeUndefined()
  })

  it('should return undefined when status is not a refused status', () => {
    expect(getQFBonificationRefusedType(QFBonificationStatus.eligible)).toBeUndefined()
  })
})
