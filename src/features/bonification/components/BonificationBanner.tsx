import React from 'react'

import { QFBonificationStatus } from 'api/gen'
import { DefaultBonificationBanner } from 'features/bonification/components/DefaultBonificationBanner'
import { ErrorBonificationBanner } from 'features/bonification/components/ErrorBonificationBanner'
import { PendingBonificationBanner } from 'features/bonification/components/PendingBonificationBanner'
import { BonificationRefusedType } from 'features/bonification/pages/BonificationRefused'
import { useBonificationBonusAmount, usePacificFrancToEuroRate } from 'queries/settings/useSettings'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'

const STATUS_TO_REFUSED_TYPE: Record<string, BonificationRefusedType> = {
  [QFBonificationStatus.custodian_not_found]: BonificationRefusedType.CUSTODIAN_NOT_FOUND,
  [QFBonificationStatus.too_many_retries]: BonificationRefusedType.TOO_MANY_RETRIES,
  [QFBonificationStatus.not_in_tax_household]: BonificationRefusedType.NOT_IN_TAX_HOUSEHOLD,
  [QFBonificationStatus.quotient_familial_too_high]:
    BonificationRefusedType.QUOTIENT_FAMILY_TOO_HIGH,
}

type BonificationBannerProps = {
  bonificationStatus: QFBonificationStatus | undefined | null
  onCloseCallback: () => void
}

export const BonificationBanner = ({
  bonificationStatus,
  onCloseCallback,
}: BonificationBannerProps) => {
  const currency = useGetCurrencyToDisplay()
  const { data: euroToPacificFrancRate } = usePacificFrancToEuroRate()
  const { data: bonificationBonusAmount } = useBonificationBonusAmount()
  const formatedBonificationAmount = formatCurrencyFromCents(
    bonificationBonusAmount,
    currency,
    euroToPacificFrancRate
  )

  const refusedType = bonificationStatus && STATUS_TO_REFUSED_TYPE[bonificationStatus]
  const noRefusedType = !refusedType
  const onClose = () => onCloseCallback()

  switch (bonificationStatus) {
    case QFBonificationStatus.started:
      return <PendingBonificationBanner amount={formatedBonificationAmount} onClose={onClose} />

    case QFBonificationStatus.not_in_tax_household:
    case QFBonificationStatus.too_many_retries:
    case QFBonificationStatus.custodian_not_found:
    case QFBonificationStatus.quotient_familial_too_high:
      if (noRefusedType) return null
      return (
        <ErrorBonificationBanner
          amount={formatedBonificationAmount}
          refusedType={refusedType}
          onClose={onClose}
        />
      )

    case QFBonificationStatus.eligible:
    default:
      return <DefaultBonificationBanner amount={formatedBonificationAmount} onClose={onClose} />
  }
}
