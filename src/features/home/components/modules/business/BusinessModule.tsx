import React from 'react'

import { NewBusinessModule } from 'features/home/components/modules/business/NewBusinessModule'
import { OldBusinessModule } from 'features/home/components/modules/business/OldBusinessModule'
import { BusinessModuleCTAWording, LocationCircleArea } from 'features/home/types'
import { useHasGraphicRedesign } from 'libs/contentful/useHasGraphicRedesign'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'

export interface BusinessModuleProps {
  homeEntryId: string | undefined
  moduleId: string
  analyticsTitle: string
  title?: string
  subtitle?: string
  index: number
  image: string
  imageWeb?: string
  url?: string
  shouldTargetNotConnectedUsers?: boolean
  localizationArea?: LocationCircleArea
  callToAction?: BusinessModuleCTAWording
  date?: string
}

//TODO(PC-30046): Clean one or the other BusinessModule
export const BusinessModule = (props: BusinessModuleProps) => {
  const enableNewBusinessModule = useFeatureFlag(RemoteStoreFeatureFlags.WIP_APP_V2_BUSINESS_BLOCK)
  const hasGraphicRedesign = useHasGraphicRedesign({
    isFeatureFlagActive: enableNewBusinessModule,
    homeId: props.homeEntryId ?? '',
  })

  return hasGraphicRedesign ? <NewBusinessModule {...props} /> : <OldBusinessModule {...props} />
}
