import React, { memo } from 'react'

import { BusinessModule } from 'features/home/components/modules/business/BusinessModule'
import { CategoryListModule } from 'features/home/components/modules/categories/CategoryListModule'
import { ExclusivityModule } from 'features/home/components/modules/exclusivity/ExclusivityModule'
import { HighlightOfferModule } from 'features/home/components/modules/HighlightOfferModule'
import { OffersModule } from 'features/home/components/modules/OffersModule'
import { RecommendationModule } from 'features/home/components/modules/RecommendationModule'
import { ThematicHighlightModule } from 'features/home/components/modules/ThematicHighlightModule'
import { VenuesModule } from 'features/home/components/modules/venues/VenuesModule'
import { VideoModule } from 'features/home/components/modules/video/VideoModule'
import {
  HomepageModule,
  HomepageModuleType,
  isExclusivityModule,
  isHighlightOfferModule,
  ModuleData,
} from 'features/home/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'

const modules = {
  [HomepageModuleType.BusinessModule]: BusinessModule,
  [HomepageModuleType.CategoryListModule]: CategoryListModule,
  [HomepageModuleType.ExclusivityModule]: ExclusivityModule,
  [HomepageModuleType.HighlightOfferModule]: HighlightOfferModule,
  [HomepageModuleType.OffersModule]: OffersModule,
  [HomepageModuleType.RecommendedOffersModule]: RecommendationModule,
  [HomepageModuleType.ThematicHighlightModule]: ThematicHighlightModule,
  [HomepageModuleType.VideoModule]: VideoModule,
  [HomepageModuleType.VenuesModule]: VenuesModule,
}

const UnmemoizedModule = ({
  item,
  index,
  homeEntryId,
  data,
  videoModuleId,
}: {
  item: HomepageModule
  index: number
  homeEntryId: string
  data?: ModuleData
  videoModuleId?: string
}) => {
  const enableNewExclusivityBlock = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_ENABLE_NEW_EXCLUSIVITY_BLOCK
  )

  if (
    (isHighlightOfferModule(item) && !enableNewExclusivityBlock) ||
    (isExclusivityModule(item) && enableNewExclusivityBlock)
  )
    return <React.Fragment />

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const ComponentModule: any = modules[item.type]
  if (!ComponentModule) return <React.Fragment />
  return (
    <ComponentModule
      {...item}
      homeEntryId={homeEntryId}
      index={index}
      moduleId={item.id}
      data={data}
      shouldShowModal={item.id === videoModuleId}
    />
  )
}

export const HomeModule = memo(UnmemoizedModule)
