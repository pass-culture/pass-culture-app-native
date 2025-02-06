import React, { FunctionComponent, PropsWithChildren, useRef } from 'react'
import { useSharedValue } from 'react-native-reanimated'
import styled, { useTheme } from 'styled-components/native'

import { CategoryIdEnum } from 'api/gen'
import { OfferImageRenderer } from 'features/offer/components/OfferImageContainer/OfferImageRenderer'
import {
  offerImageContainerMarginTop,
  useOfferImageContainerDimensions,
} from 'features/offer/helpers/useOfferImageContainerDimensions'
import { ImageWithCredit } from 'shared/types'
import { useGetHeaderHeight } from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { getSpacing } from 'ui/theme'

import { OfferImageHeaderWrapper } from './OfferImageHeaderWrapper'

type Props = {
  categoryId: CategoryIdEnum | null
  images?: ImageWithCredit[]
  onPress?: (defaultIndex?: number) => void
  placeholderImage?: string
}

export const OfferImageContainer: FunctionComponent<Props> = ({
  images = [],
  onPress,
  categoryId,
  placeholderImage,
}) => {
  const { backgroundHeight } = useOfferImageContainerDimensions()
  const { isDesktopViewport } = useTheme()
  const headerHeight = useGetHeaderHeight()

  const progressValue = useSharedValue<number>(0)

  const Wrapper = useRef(({ children }: PropsWithChildren) =>
    isDesktopViewport ? (
      <React.Fragment>{children}</React.Fragment>
    ) : (
      <OfferImageHeaderWrapper
        imageHeight={backgroundHeight}
        imageUrl={placeholderImage}
        paddingTop={getSpacing(offerImageContainerMarginTop)}>
        {children}
      </OfferImageHeaderWrapper>
    )
  ).current

  return (
    <Wrapper>
      <StyledOfferImageRenderer
        offerImages={images}
        headerHeight={headerHeight}
        placeholderImage={placeholderImage}
        progressValue={progressValue}
        onPress={onPress}
        categoryId={categoryId}
      />
    </Wrapper>
  )
}

const StyledOfferImageRenderer = styled(OfferImageRenderer)<{
  headerHeight: number
}>(({ headerHeight, theme }) => ({
  ...(theme.isDesktopViewport && !theme.isNative
    ? { position: 'sticky', top: 48 + headerHeight, alignSelf: 'flex-start' }
    : {}),
}))
