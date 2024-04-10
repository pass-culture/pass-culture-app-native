import { useRoute } from '@react-navigation/native'
import colorAlpha from 'color-alpha'
import React, { FunctionComponent } from 'react'
import { useWindowDimensions } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import Carousel from 'react-native-reanimated-carousel'
import styled from 'styled-components/native'

import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { useGoBack } from 'features/navigation/useGoBack'
import { useOffer } from 'features/offer/api/useOffer'
import { PinchableBox } from 'features/offer/components/PinchableBox/PinchableBox'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { BlurHeader } from 'ui/components/headers/BlurHeader'
import {
  PageHeaderWithoutPlaceholder,
  useGetHeaderHeight,
} from 'ui/components/headers/PageHeaderWithoutPlaceholder'

export const OfferPreview: FunctionComponent = () => {
  const { params } = useRoute<UseRouteType<'OfferPreview'>>()
  const { goBack } = useGoBack('Offer', params)
  const { data: offer } = useOffer({ offerId: params.id })
  const headerHeight = useGetHeaderHeight()

  const shouldDisplayCarousel = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_OFFER_PREVIEW_WITH_CAROUSEL
  )
  const progressValue = useSharedValue<number>(0)
  const [index, setIndex] = React.useState(0)
  const { height: screenHeight, width: screenWidth } = useWindowDimensions()

  if (!offer?.image) return null

  const images = [offer.image.url, offer.image.url, offer.image.url]

  return (
    <Container>
      <StyledHeader
        title={shouldDisplayCarousel ? `${index + 1}/${images.length}` : '1/1'}
        onGoBack={goBack}
      />

      {shouldDisplayCarousel ? (
        <Carousel
          vertical={false}
          height={screenHeight}
          width={screenWidth}
          loop={false}
          scrollAnimationDuration={500}
          onProgressChange={(_, absoluteProgress) => {
            progressValue.value = absoluteProgress
            setIndex(Math.round(absoluteProgress))
          }}
          data={images}
          renderItem={({ item: image }) => <PinchableBox imageUrl={image} />}
        />
      ) : (
        <PinchableBox imageUrl={offer.image.url} />
      )}

      <BlurHeader height={headerHeight} />
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.white,
}))

const StyledHeader = styled(PageHeaderWithoutPlaceholder)(({ theme }) => ({
  backgroundColor: colorAlpha(theme.colors.white, 0.6),
}))
