import React, { memo } from 'react'

import { BusinessModule } from 'features/home/components/modules/BusinessModule'
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
  isVenuesModule,
  isVideoModule,
  ModuleData,
} from 'features/home/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'

const UnmemoizedModule = ({
  item,
  index,
  homeEntryId,
  videoModuleId,
  data,
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

  if (isVenuesModule(item)) {
    return (
      <VenuesModule
        moduleId={item.id}
        display={item.displayParameters}
        homeEntryId={homeEntryId}
        index={index}
        data={data}
      />
    )
  }

  if (isVideoModule(item)) {
    return (
      <VideoModule
        {...item}
        homeEntryId={homeEntryId}
        index={index}
        shouldShowModal={item.id === videoModuleId}
      />
    )
  }

  if (
    (isHighlightOfferModule(item) && !enableNewExclusivityBlock) ||
    (isExclusivityModule(item) && enableNewExclusivityBlock)
  )
    return <React.Fragment></React.Fragment>

  const modules = {
    [HomepageModuleType.BusinessModule]: BusinessModule,
    [HomepageModuleType.CategoryListModule]: CategoryListModule,
    [HomepageModuleType.ExclusivityModule]: ExclusivityModule,
    [HomepageModuleType.HighlightOfferModule]: HighlightOfferModule,
    [HomepageModuleType.OffersModule]: OffersModule,
    [HomepageModuleType.RecommendedOffersModule]: RecommendationModule,
    [HomepageModuleType.ThematicHighlightModule]: ThematicHighlightModule,
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const ComponentModule: any = modules[item.type]
  return (
    <ComponentModule
      {...item}
      homeEntryId={homeEntryId}
      index={index}
      moduleId={item.id}
      data={data}
    />
  )
}

export const HomeModule = memo(UnmemoizedModule)
