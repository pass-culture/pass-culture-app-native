import React, { memo } from 'react'

import {
  BusinessModule,
  ExclusivityModule,
  OffersModule,
  VenuesModule,
} from 'features/home/components'
import { CategoryListModule } from 'features/home/components/modules/categories/CategoryListModule'
import { RecommendationModule } from 'features/home/components/modules/RecommendationModule'
import { ThematicHighlightModule } from 'features/home/components/modules/ThematicHighlightModule'
import {
  HomepageModule,
  isBusinessModule,
  isCategoryListModule,
  isExclusivityModule,
  isOffersModule,
  isRecommendedOffersModule,
  isThematicHighlightModule,
  isVenuesModule,
} from 'features/home/types'

const UnmemoizedModule = ({
  item,
  index,
  homeEntryId,
}: {
  item: HomepageModule
  index: number
  homeEntryId: string | undefined
}) => {
  if (isOffersModule(item))
    return (
      <OffersModule
        moduleId={item.id}
        search={item.offersModuleParameters}
        display={item.displayParameters}
        cover={item.cover ?? null}
        index={index}
        homeEntryId={homeEntryId}
      />
    )

  if (isVenuesModule(item))
    return (
      <VenuesModule
        moduleId={item.id}
        display={item.displayParameters}
        search={item.venuesParameters}
        homeEntryId={homeEntryId}
        index={index}
      />
    )

  if (isRecommendedOffersModule(item))
    return (
      <RecommendationModule
        moduleId={item.id}
        index={index}
        displayParameters={item.displayParameters}
        recommendationParameters={item.recommendationParameters}
        homeEntryId={homeEntryId}
      />
    )

  if (isExclusivityModule(item))
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

  if (isBusinessModule(item))
    return <BusinessModule {...item} homeEntryId={homeEntryId} index={index} moduleId={item.id} />

  if (isThematicHighlightModule(item)) return <ThematicHighlightModule {...item} />

  if (isCategoryListModule(item))
    return <CategoryListModule {...item} homeEntryId={homeEntryId} index={index} />

  return <React.Fragment></React.Fragment>
}

export const HomeModule = memo(UnmemoizedModule)
