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
  isBusinessModule,
  isCategoryListModule,
  isExclusivityModule,
  isHighlightOfferModule,
  isOffersModule,
  isRecommendedOffersModule,
  isThematicHighlightModule,
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

  if (isOffersModule(item)) {
    return (
      <OffersModule
        moduleId={item.id}
        search={item.offersModuleParameters}
        display={item.displayParameters}
        cover={item.cover ?? null}
        index={index}
        homeEntryId={homeEntryId}
        data={data}
      />
    )
  }

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

  if (isRecommendedOffersModule(item)) {
    return (
      <RecommendationModule
        moduleId={item.id}
        index={index}
        displayParameters={item.displayParameters}
        recommendationParameters={item.recommendationParameters}
        homeEntryId={homeEntryId}
      />
    )
  }
  if (isExclusivityModule(item) && !enableNewExclusivityBlock) {
    return (
      <ExclusivityModule
        moduleId={item.id}
        title={item.title}
        alt={item.alt}
        image={item.image}
        offerId={item.offerId}
        display={item.displayParameters}
        homeEntryId={homeEntryId}
        index={index}
        url={item.url}
      />
    )
  }

  if (isHighlightOfferModule(item) && enableNewExclusivityBlock) {
    return <HighlightOfferModule {...item} />
  }

  if (isBusinessModule(item)) {
    return <BusinessModule {...item} homeEntryId={homeEntryId} index={index} moduleId={item.id} />
  }

  if (isThematicHighlightModule(item)) {
    return <ThematicHighlightModule {...item} homeEntryId={homeEntryId} index={index} />
  }

  if (isCategoryListModule(item)) {
    return <CategoryListModule {...item} homeEntryId={homeEntryId} index={index} />
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

  return <React.Fragment></React.Fragment>
}

export const HomeModule = memo(UnmemoizedModule)
