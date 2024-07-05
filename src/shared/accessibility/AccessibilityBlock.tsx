import React, { FC } from 'react'

import { ExternalAccessibilityDataModel, OfferAccessibilityResponse } from 'api/gen'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { BasicAccessibilityInfo } from 'ui/components/accessibility/BasicAccessibilityInfo'
import { DetailedAccessibilityInfo } from 'ui/components/accessibility/DetailedAccessibilityInfo'

type Props = {
  basicAccessibility?: OfferAccessibilityResponse
  detailedAccessibilityUrl?: string | null
  detailedAccessibilityData?: ExternalAccessibilityDataModel | null
  detailedAccessibilityId?: string | null
}

export const AccessibilityBlock: FC<Props> = ({
  basicAccessibility,
  detailedAccessibilityUrl,
  detailedAccessibilityData,
  detailedAccessibilityId,
}) => {
  const enableAccesLibre = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_ACCES_LIBRE)

  if (
    enableAccesLibre &&
    detailedAccessibilityUrl &&
    detailedAccessibilityData &&
    detailedAccessibilityId
  ) {
    return (
      <DetailedAccessibilityInfo
        url={detailedAccessibilityUrl}
        accessibilities={detailedAccessibilityData}
        acceslibreId={detailedAccessibilityId}
      />
    )
  }
  if (basicAccessibility) {
    return <BasicAccessibilityInfo accessibility={basicAccessibility} />
  }
  return null
}
