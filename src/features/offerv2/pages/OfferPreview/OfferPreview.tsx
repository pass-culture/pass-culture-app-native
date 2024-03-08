import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { useGoBack } from 'features/navigation/useGoBack'
import { useOffer } from 'features/offer/api/useOffer'
import { PinchableBox } from 'features/offerv2/components/PinchableBox/PinchableBox'
import { PageHeaderWithoutPlaceholder } from 'ui/components/headers/PageHeaderWithoutPlaceholder'

export const OfferPreview: FunctionComponent = () => {
  const { params } = useRoute<UseRouteType<'OfferPreview'>>()
  const { goBack } = useGoBack('Offer', params)
  const { data: offer } = useOffer({ offerId: params.id })

  if (!offer?.image) return null

  return (
    <Container>
      <PageHeaderWithoutPlaceholder title="1/1" onGoBack={goBack} />
      <PinchableBox imageUrl={offer.image.url} />
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.white,
}))
