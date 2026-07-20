import { DisabilityBonificationStatus } from 'api/gen'
import { BonificationDisabilityRefusedType } from 'features/bonification/types/BonificationRefusedType'
import { getDisabilityBonificationRefusedType } from 'features/profile/helpers/getDisabilityBonificationRefusedType'

describe('getDisabilityBonificationRefusedType', () => {
  it.each([
    [
      DisabilityBonificationStatus.too_many_retries,
      BonificationDisabilityRefusedType.TOO_MANY_RETRIES,
    ],
    [
      DisabilityBonificationStatus.person_not_found,
      BonificationDisabilityRefusedType.PERSON_NOT_FOUND,
    ],
    [DisabilityBonificationStatus.not_recipient, BonificationDisabilityRefusedType.NOT_RECIPIENT],
    [DisabilityBonificationStatus.ko, BonificationDisabilityRefusedType.KO],
    [
      DisabilityBonificationStatus.application_not_found,
      BonificationDisabilityRefusedType.APPLICATION_NOT_FOUND,
    ],
  ])('should return %s for status %s', (status, expectedRefusedType) => {
    expect(getDisabilityBonificationRefusedType(status)).toBe(expectedRefusedType)
  })

  it('should return undefined when status is undefined', () => {
    expect(getDisabilityBonificationRefusedType()).toBeUndefined()
  })

  it('should return undefined when status is null', () => {
    expect(getDisabilityBonificationRefusedType(null)).toBeUndefined()
  })

  it('should return undefined when status is not a refused status', () => {
    expect(
      getDisabilityBonificationRefusedType(DisabilityBonificationStatus.eligible)
    ).toBeUndefined()
  })
})
