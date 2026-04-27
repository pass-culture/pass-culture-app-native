import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'

import { OFFER_ADVICE_THUMBNAIL_HEIGHT } from 'features/advices/constants'
import { useVenueProAdvicesQuery } from 'features/advices/queries/useVenueProAdvicesQuery'
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
  const { data: advices } = useVenueProAdvicesQuery({
    venueId,
    enableProAdvices,
    select: ({ proAdvices }) => venueProAdvicesToAdviceCardData(proAdvices, venueId),
  })
  const nbAdvices = advices?.length ?? 0

  const { goBack } = useGoBack('Venue')

  if (!venue) return null

  const title = `${nbAdvices} avis par “${venue.name}”`

  return (
    <ProAdvicesBase
      title={title}
      advices={advices ?? []}
      goBack={goBack}
      id={offerId}
      thumbnailHeight={OFFER_ADVICE_THUMBNAIL_HEIGHT}
    />
  )
}
