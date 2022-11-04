import React, { memo } from 'react'

import {
  BusinessModule,
  ExclusivityModule,
  OffersModule,
  VenuesModule,
} from 'features/home/components'
import { RecommendationModule } from 'features/home/components/modules/RecommendationModule'
import { BusinessPane, ExclusivityPane, OffersWithCover } from 'features/home/contentful'
import { ProcessedModule, RecommendationPane } from 'features/home/contentful/moduleTypes'
import { isOfferModuleTypeguard, isVenuesModuleTypeguard } from 'features/home/typeguards'

const UnmemoizedModule = ({
  item,
  index,
  homeEntryId,
}: {
  item: ProcessedModule
  index: number
  homeEntryId: string | undefined
}) => {
  if (isOfferModuleTypeguard(item))
    return (
      <OffersModule
        moduleId={item.moduleId}
        search={item.search}
        display={item.display}
        cover={item instanceof OffersWithCover ? item.cover : null}
        index={index}
        homeEntryId={homeEntryId}
      />
    )

  if (isVenuesModuleTypeguard(item))
    return (
      <VenuesModule
        moduleId={item.moduleId}
        display={item.display}
        search={item.search}
        homeEntryId={homeEntryId}
        index={index}
      />
    )

  if (item instanceof RecommendationPane)
    return (
      <RecommendationModule
        moduleId={item.moduleId}
        index={index}
        displayParameters={item.displayParameters}
        recommendationParameters={item.recommendationParameters}
        homeEntryId={homeEntryId}
      />
    )

  if (item instanceof ExclusivityPane)
    return (
      <ExclusivityModule
        moduleId={item.moduleId}
        title={item.title}
        alt={item.alt}
        image={item.image}
        offerId={item.offerId}
        display={item.display}
        homeEntryId={homeEntryId}
        index={index}
      />
    )

  if (item instanceof BusinessPane)
    return <BusinessModule {...item} homeEntryId={homeEntryId} index={index} />

  return <React.Fragment></React.Fragment>
}

export const HomeModule = memo(UnmemoizedModule)
