import React from 'react'

import { QFBonificationStatus } from 'api/gen'
import { DefaultBonificationBanner } from 'features/bonification/components/DefaultBonificationBanner'
import { ErrorBonificationBanner } from 'features/bonification/components/ErrorBonificationBanner'
import { PendingBonificationBanner } from 'features/bonification/components/PendingBonificationBanner'
import { getQFBonificationRefusedType } from 'features/profile/helpers/getQFBonificationRefusedType'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useBonificationBonusAmount, usePacificFrancToEuroRate } from 'queries/settings/useSettings'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'

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

  const refusedType = getQFBonificationRefusedType(bonificationStatus)
  const onClose = () => onCloseCallback()
  const bannerProps = { amount: formatedBonificationAmount, onClose }

  if (refusedType) {
    return <ErrorBonificationBanner {...bannerProps} refusedType={refusedType} />
  }

  switch (bonificationStatus) {
    case QFBonificationStatus.started:
      return <PendingBonificationBanner {...bannerProps} />

    case QFBonificationStatus.eligible:
    default:
      if (disableQFBonificationManualRequest) return null
      return <DefaultBonificationBanner {...bannerProps} />
  }
}
