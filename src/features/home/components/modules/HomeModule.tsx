import React, { memo, useCallback } from 'react'
import { ViewToken } from 'react-native'

import { BusinessModule } from 'features/home/components/modules/business/BusinessModule'
import { CategoryListModule } from 'features/home/components/modules/categories/CategoryListModule'
import { HighlightOfferModule } from 'features/home/components/modules/HighlightOfferModule'
import { OffersModule } from 'features/home/components/modules/OffersModule'
import { RecommendationModule } from 'features/home/components/modules/RecommendationModule'
import { ThematicHighlightModule } from 'features/home/components/modules/ThematicHighlightModule'
import { TrendsModule } from 'features/home/components/modules/TrendsModule'
import { VenueMapModule } from 'features/home/components/modules/VenueMapModule'
import { VenuesModule } from 'features/home/components/modules/venues/VenuesModule'
import { VideoCarouselModule } from 'features/home/components/modules/video/VideoCarouselModule'
import { VideoModule } from 'features/home/components/modules/video/VideoModule'
import {
  HomepageModule,
  HomepageModuleType,
  ModuleData,
  ModuleViewableItemsChangedHandler,
} from 'features/home/types'

const modules = {
  [HomepageModuleType.BusinessModule]: BusinessModule,
  [HomepageModuleType.CategoryListModule]: CategoryListModule,
  [HomepageModuleType.HighlightOfferModule]: HighlightOfferModule,
  [HomepageModuleType.OffersModule]: OffersModule,
  [HomepageModuleType.RecommendedOffersModule]: RecommendationModule,
  [HomepageModuleType.ThematicHighlightModule]: ThematicHighlightModule,
  [HomepageModuleType.TrendsModule]: TrendsModule,
  [HomepageModuleType.VenueMapModule]: VenueMapModule,
  [HomepageModuleType.VideoModule]: VideoModule,
  [HomepageModuleType.VenuesModule]: VenuesModule,
  [HomepageModuleType.VideoCarouselModule]: VideoCarouselModule,
}

const UnmemoizedModule = ({
  item,
  index,
  homeEntryId,
  data,
  videoModuleId,
  onModuleViewableItemsChanged,
}: {
  item: HomepageModule
  index: number
  homeEntryId: string
  data?: ModuleData
  videoModuleId?: string
  onModuleViewableItemsChanged?: ModuleViewableItemsChangedHandler
}) => {
  const handleOnViewableItemsChanged = useCallback(
    (viewableItems: Pick<ViewToken, 'key' | 'index'>[]) => {
      onModuleViewableItemsChanged?.({
        index,
        moduleId: item.id,
        moduleType: item.type,
        viewableItems,
        homeEntryId,
      })
    },
    // Changing onViewableItemsChanged on the fly is not supported
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const ComponentModule: any = modules[item.type]
  if (!ComponentModule) return null

  return (
    <ComponentModule
      {...item}
      homeEntryId={homeEntryId}
      index={index}
      moduleId={item.id}
      data={data}
      shouldShowModal={item.id === videoModuleId}
      onViewableItemsChanged={handleOnViewableItemsChanged}
    />
  )
}

export const HomeModule = memo(UnmemoizedModule)
