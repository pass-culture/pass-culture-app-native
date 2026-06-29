import React from 'react'

import { QFBonificationStatus } from 'api/gen'
import { DefaultBonificationBanner } from 'features/bonification/components/DefaultBonificationBanner'
import { ErrorBonificationBanner } from 'features/bonification/components/ErrorBonificationBanner'
import { PendingBonificationBanner } from 'features/bonification/components/PendingBonificationBanner'
import { BonificationQFRefusedType } from 'features/bonification/types/BonificationRefusedType'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useBonificationBonusAmount, usePacificFrancToEuroRate } from 'queries/settings/useSettings'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'

const STATUS_TO_REFUSED_TYPE: Record<string, BonificationQFRefusedType> = {
  [QFBonificationStatus.custodian_not_found]: BonificationQFRefusedType.CUSTODIAN_NOT_FOUND,
  [QFBonificationStatus.application_not_found]: BonificationQFRefusedType.APPLICATION_NOT_FOUND,
  [QFBonificationStatus.too_many_retries]: BonificationQFRefusedType.TOO_MANY_RETRIES,
  [QFBonificationStatus.not_in_tax_household]: BonificationQFRefusedType.NOT_IN_TAX_HOUSEHOLD,
  [QFBonificationStatus.quotient_familial_too_high]:
    BonificationQFRefusedType.QUOTIENT_FAMILY_TOO_HIGH,
}

type BonificationBannerProps = {
  bonificationStatus: QFBonificationStatus | undefined | null
  onCloseCallback: () => void
}

export const BonificationBanner = ({
  bonificationStatus,
  onCloseCallback,
}: BonificationBannerProps) => {
  const disableQFBonificationManualRequest = useFeatureFlag(
    RemoteStoreFeatureFlags.DISABLE_QF_BONIFICATION_MANUAL_REQUEST
  )

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
  const bannerProps = { amount: formatedBonificationAmount, onClose }

  switch (bonificationStatus) {
    case QFBonificationStatus.started:
      return <PendingBonificationBanner {...bannerProps} />

    case QFBonificationStatus.not_in_tax_household:
    case QFBonificationStatus.too_many_retries:
    case QFBonificationStatus.custodian_not_found:
    case QFBonificationStatus.application_not_found:
    case QFBonificationStatus.quotient_familial_too_high:
      if (noRefusedType) return null
      return <ErrorBonificationBanner {...bannerProps} refusedType={refusedType} />

    case QFBonificationStatus.eligible:
    default:
      if (disableQFBonificationManualRequest) return null
      return <DefaultBonificationBanner {...bannerProps} />
  }
}
