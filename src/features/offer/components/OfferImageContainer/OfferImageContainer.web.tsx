import React, { FunctionComponent, PropsWithChildren, useRef } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { CategoryIdEnum } from 'api/gen'
import { OfferImageRenderer } from 'features/offer/components/OfferImageContainer/OfferImageRenderer'
import { offerImageContainerMarginTop } from 'features/offer/helpers/useOfferImageContainerDimensions'
import { OfferImageContainerDimensions } from 'features/offer/types'
import { useGetHeaderHeight } from 'shared/header/useGetHeaderHeight'
import { ImageWithCredit } from 'shared/types'
import { getSpacing } from 'ui/theme'

import { OfferImageHeaderWrapper } from './OfferImageHeaderWrapper'

type Props = {
  categoryId: CategoryIdEnum | null
  imageDimensions: OfferImageContainerDimensions
  images?: ImageWithCredit[]
  onPress?: (defaultIndex?: number) => void
  placeholderImage?: string
  onSeeVideoPress: VoidFunction
}

export const OfferImageContainer: FunctionComponent<Props> = ({
  images = [],
  onPress,
  categoryId,
  placeholderImage,
  imageDimensions,
  onSeeVideoPress,
}) => {
  const { isDesktopViewport } = useTheme()
  const headerHeight = useGetHeaderHeight()

  const progressValue = 0

  const Wrapper = useRef(({ children }: PropsWithChildren) =>
    isDesktopViewport ? (
      <React.Fragment>{children}</React.Fragment>
    ) : (
      <OfferImageHeaderWrapper
        imageHeight={imageDimensions.backgroundHeight}
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
        imageDimensions={imageDimensions}
        onSeeVideoPress={onSeeVideoPress}
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
