import { useRoute } from '@react-navigation/native'
import colorAlpha from 'color-alpha'
import React, { FunctionComponent } from 'react'
import { useWindowDimensions } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import Carousel from 'react-native-reanimated-carousel'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { useGoBack } from 'features/navigation/useGoBack'
import { useOffer } from 'features/offer/api/useOffer'
import { getImagesUrls } from 'shared/getImagesUrls/getImagesUrls'

export const OfferPreview: FunctionComponent = () => {
  const { params } = useRoute<UseRouteType<'OfferPreview'>>()
  const { goBack } = useGoBack('Offer', { id: params.id })
  const { data: offer } = useOffer({ offerId: params.id })
  const headerHeight = useGetHeaderHeight()
  const footerHeight = useGetFooterHeight(FOOTER_HEIGHT)

  const defaultIndex = params.defaultIndex ?? 0
  const progressValue = useSharedValue<number>(defaultIndex)
  const [index, setIndex] = React.useState(defaultIndex)
  const { height: screenHeight, width: screenWidth } = useWindowDimensions()

  if (!offer?.images) return null

  const images = getImagesUrls<OfferImageResponse>(offer.images)
