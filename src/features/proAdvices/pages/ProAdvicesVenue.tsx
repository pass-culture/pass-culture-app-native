import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useCallback } from 'react'

import { OFFER_ADVICE_THUMBNAIL_HEIGHT } from 'features/advices/constants'
import { useVenueProAdvicesInfiniteQuery } from 'features/advices/queries/useVenueProAdvicesInfiniteQuery'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { useGoBack } from 'features/navigation/useGoBack'
import { venueProAdvicesToAdviceCardData } from 'features/proAdvices/adapters/venueProAdvicesToAdviceCardData/venueProAdvicesToAdviceCardData'
import { ProAdvicesBase } from 'features/proAdvices/pages/ProAdvicesBase'
import { useVenueQuery } from 'features/venue/queries/useVenueQuery'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'

export const ProAdvicesVenue: FunctionComponent = () => {
  const route = useRoute<UseRouteType<'ProAdvicesVenue'>>()
  const { venueId, offerId } = route.params
  const enableProAdvices = useFeatureFlag(RemoteStoreFeatureFlags.WIP_PRO_REVIEWS_VENUE)

  const { data: venue } = useVenueQuery(venueId)
  const {
    data: advicesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useVenueProAdvicesInfiniteQuery({
    venueId,
    enableProAdvices,
  })
  const advices =
    advicesData?.pages.flatMap(({ proAdvices }) =>
      venueProAdvicesToAdviceCardData(proAdvices, venueId)
    ) ?? []
  const nbAdvices = advicesData?.pages[0]?.nbResults ?? advices.length

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  const { goBack } = useGoBack('Venue')

  if (!venue) return null

  const title = `${nbAdvices} avis par “${venue.name}”`

  return (
    <ProAdvicesBase
      title={title}
      advices={advices}
      nbAdvices={nbAdvices}
      goBack={goBack}
      id={offerId}
      onEndReached={handleEndReached}
      isFetchingNextPage={isFetchingNextPage}
      thumbnailHeight={OFFER_ADVICE_THUMBNAIL_HEIGHT}
    />
  )
}
