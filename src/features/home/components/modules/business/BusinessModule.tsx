import React from 'react'

import { NewBusinessModule } from 'features/home/components/modules/business/NewBusinessModule'
import { OldBusinessModule } from 'features/home/components/modules/business/OldBusinessModule'
import { LocationCircleArea } from 'features/home/types'
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
}
export type NewBusinessModuleProps = BusinessModuleProps & { wordingCTA: string }

const isNewBusinessModule = (
  props: BusinessModuleProps | NewBusinessModuleProps
): props is NewBusinessModuleProps => {
  return 'wordingCTA' in props && !!props.wordingCTA
}
//TODO(PC-30046): Clean one or the other BusinessModule
export const BusinessModule = (props: BusinessModuleProps | NewBusinessModuleProps) => {
  const enableNewBusinessModule = useFeatureFlag(RemoteStoreFeatureFlags.WIP_APP_V2_BUSINESS_BLOCK)
  return enableNewBusinessModule && isNewBusinessModule(props) ? (
    <NewBusinessModule {...props} />
  ) : (
    <OldBusinessModule {...props} />
  )
}
