import { useRoute } from '@react-navigation/native'
import React from 'react'
import { Animated } from 'react-native'

import { UseRouteType } from 'features/navigation/RootNavigator'

import { useOffer } from '../api/useOffer'
import { OfferHeader } from '../components'
import { dehumanizeId } from '../services/dehumanizeId'

export const OfferDescription = () => {
  const {
    params: { id },
  } = useRoute<UseRouteType<'OfferDescription'>>()
  const { data: offerResponse } = useOffer({ offerId: dehumanizeId(id) })
  offerResponse

  return (
    <React.Fragment>
      <OfferHeader
        title="Description"
        headerTransition={new Animated.Value(1)}
        showRightIcons={false}
      />
    </React.Fragment>
  )
}
