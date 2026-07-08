import { QFBonificationStatus } from 'api/gen'
import { BonificationQFRefusedType } from 'features/bonification/types/BonificationRefusedType'

const qfBonificationRefusedTypeMap: Partial<
  Record<QFBonificationStatus, BonificationQFRefusedType>
> = {
  [QFBonificationStatus.application_not_found]: BonificationQFRefusedType.APPLICATION_NOT_FOUND,
  [QFBonificationStatus.custodian_not_found]: BonificationQFRefusedType.CUSTODIAN_NOT_FOUND,
  [QFBonificationStatus.ko]: BonificationQFRefusedType.KO,
  [QFBonificationStatus.not_in_tax_household]: BonificationQFRefusedType.NOT_IN_TAX_HOUSEHOLD,
  [QFBonificationStatus.quotient_familial_too_high]:
    BonificationQFRefusedType.QUOTIENT_FAMILY_TOO_HIGH,
  [QFBonificationStatus.too_many_retries]: BonificationQFRefusedType.TOO_MANY_RETRIES,
}

export const getQFBonificationRefusedType = (
  status?: QFBonificationStatus | null
): BonificationQFRefusedType | undefined => {
  if (!status) return undefined
  return qfBonificationRefusedTypeMap[status]
}
