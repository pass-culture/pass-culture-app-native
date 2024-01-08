import { useRoute } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { useOffer } from 'features/offer/api/useOffer'
import { PinchableBox } from 'features/offer/components/OfferBody/PinchableBox'
import { OfferHeader } from 'features/offer/components/OfferHeader/OfferHeader'
import { OfferWebMetaHeader } from 'features/offer/components/OfferWebMetaHeader'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'

export function OfferPreview() {
  const { params } = useRoute<UseRouteType<'OfferPreview'>>()
  const { data: offer } = useOffer({ offerId: params.id })

  const { headerTransition } = useOpacityTransition()

  if (!offer?.image) return null

  return (
    <Container>
      <OfferWebMetaHeader offer={offer} />
      <OfferHeader title={offer.name} headerTransition={headerTransition} offer={offer} />
      <PinchableBox imageUrl={offer.image.url} />
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.white,
}))
