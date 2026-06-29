import { DisabilityBonificationStatus } from 'api/gen'
import { BonificationDisabilityRefusedType } from 'features/bonification/types/BonificationRefusedType'

const disabilityBonificationRefusedTypeMap: Partial<
  Record<DisabilityBonificationStatus, BonificationDisabilityRefusedType>
> = {
  [DisabilityBonificationStatus.too_many_retries]:
    BonificationDisabilityRefusedType.TOO_MANY_RETRIES,
  [DisabilityBonificationStatus.person_not_found]:
    BonificationDisabilityRefusedType.PERSON_NOT_FOUND,
  [DisabilityBonificationStatus.not_recipient]: BonificationDisabilityRefusedType.NOT_RECIPIENT,
  [DisabilityBonificationStatus.ko]: BonificationDisabilityRefusedType.KO,
  [DisabilityBonificationStatus.application_not_found]:
    BonificationDisabilityRefusedType.APPLICATION_NOT_FOUND,
}

export const getDisabilityBonificationRefusedType = (
  status?: DisabilityBonificationStatus | null
): BonificationDisabilityRefusedType | undefined => {
  if (!status) return undefined
  return disabilityBonificationRefusedTypeMap[status]
}
