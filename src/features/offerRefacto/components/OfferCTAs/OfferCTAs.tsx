import React from 'react'
import { LayoutChangeEvent } from 'react-native'

import { OfferResponse } from 'api/gen'
import { OfferCTAsView } from 'features/offerRefacto/components/OfferCTAs/OfferCTAsView'
import { useOfferCTAs } from 'features/offerRefacto/components/OfferCTAs/useOfferCTAs'
import { FavoriteCTAProps } from 'features/offerRefacto/types'
import { Subcategory } from 'libs/subcategories/types'

type OfferCTAsProps = {
  offer: OfferResponse
  subcategory: Subcategory
  trackEventHasSeenOfferOnce: VoidFunction
  favoriteCTAProps: FavoriteCTAProps
  fullScreen?: boolean
  onLayout?: (params: LayoutChangeEvent) => void
}

export const OfferCTAs = ({
  offer,
  subcategory,
  trackEventHasSeenOfferOnce,
  favoriteCTAProps,
  fullScreen,
  onLayout,
}: Readonly<OfferCTAsProps>) => {
  const viewModel = useOfferCTAs({
    offer,
    subcategory,
    trackEventHasSeenOfferOnce,
    favoriteCTAProps,
  })

  return (
    <OfferCTAsView
      offer={offer}
      favoriteCTAProps={favoriteCTAProps}
      viewModel={viewModel}
      fullScreen={fullScreen}
      onLayout={onLayout}
    />
  )
}
