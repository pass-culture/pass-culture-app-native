import React, { FunctionComponent, PropsWithChildren } from 'react'
import { ViewProps } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { Image } from 'libs/resizing-image-on-demand/Image'
import { All } from 'ui/svg/icons/bicolor/All'
import { RightFilled } from 'ui/svg/icons/RightFilled'
import { Spacer, TypoDS } from 'ui/theme'

type Props = PropsWithChildren<{
  venueName: string
  address: string
  withRightArrow?: boolean
  bannerUrl?: string | null
  imageHeight: number
  imageWidth: number
}>

export const VenuePreview: FunctionComponent<Props> = ({
  address,
  bannerUrl,
  withRightArrow,
  venueName,
  children,
  imageHeight,
  imageWidth,
}) => (
  <StyledView>
    {bannerUrl ? (
      <VenueThumbnail
        height={imageHeight}
        width={imageWidth}
        url={bannerUrl}
        testID="VenuePreviewImage"
      />
    ) : (
      <ImagePlaceholder height={imageHeight} width={imageWidth} testID="VenuePreviewPlaceholder" />
    )}
    <Spacer.Row numberOfSpaces={2} />
    <VenueRightContainer>
      {children}
      <VenueTitleContainer>
        <VenueName>{venueName}</VenueName>
        {withRightArrow ? (
          <React.Fragment>
            <Spacer.Row numberOfSpaces={1} />
            <RightIcon testID="RightFilled" />
          </React.Fragment>
        ) : null}
      </VenueTitleContainer>
      <Address>{address}</Address>
    </VenueRightContainer>
  </StyledView>
)

const StyledView = styled.View({
  flexShrink: 1,
  flexDirection: 'row',
})

const VenueRightContainer = styled.View({
  flexShrink: 1,
  justifyContent: 'center',
})

const VenueTitleContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
})

const VenueName = styled(TypoDS.BodyAccent).attrs({ numberOfLines: 1 })({
  flexShrink: 1,
})

const RightIcon = styled(RightFilled).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
}))({
  flexShrink: 0,
})

const Address = styled(TypoDS.BodyAccentXs).attrs({ numberOfLines: 2 })(({ theme }) => ({
  color: theme.colors.greyDark,
}))

const VenueThumbnail = styled(Image)<{ height: number; width: number }>(({ height, width }) => ({
  borderRadius: 4,
  height,
  width,
}))

const ImagePlaceholderContainer = styled(LinearGradient).attrs(({ theme }) => ({
  colors: [theme.colors.greyLight, theme.colors.greyMedium],
}))<{ height: number; width: number }>(({ theme, height, width }) => ({
  borderRadius: theme.borderRadius.radius,
  height,
  width,
  alignItems: 'center',
  justifyContent: 'center',
}))

const ImagePlaceholderIcon = styled(All).attrs(({ theme }) => ({
  size: theme.icons.sizes.standard,
  color: theme.colors.greyMedium,
}))``

type ImagePlaceholderProps = ViewProps & {
  height: number
  width: number
}

const ImagePlaceholder = ({ height, width, ...props }: ImagePlaceholderProps) => (
  <ImagePlaceholderContainer height={height} width={width} {...props}>
    <ImagePlaceholderIcon />
  </ImagePlaceholderContainer>
)
