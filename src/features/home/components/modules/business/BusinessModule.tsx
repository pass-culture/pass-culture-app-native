import React from 'react'

import { NewBusinessModule } from 'features/home/components/modules/business/NewBusinessModule'
import { OldBusinessModule } from 'features/home/components/modules/business/OldBusinessModule'
import { BusinessModuleProps } from 'features/home/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'

//TODO(PC-30046): Clean one or the other BusinessModule
export const BusinessModule = (props: BusinessModuleProps) => {
  const enableNewBusinessModule = useFeatureFlag(RemoteStoreFeatureFlags.WIP_APP_V2_BUSINESS_BLOCK)

  return enableNewBusinessModule ? (
    <NewBusinessModule {...props} />
  ) : (
    <OldBusinessModule {...props} />
  )
}
