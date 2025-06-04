import React, { FunctionComponent, PropsWithChildren, ReactNode } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { ThumbnailPlaceholder } from 'ui/components/InfoHeader/ThumbnailPlaceHolder'
import { Typo, getSpacing } from 'ui/theme'

type InfoHeaderProps = PropsWithChildren<{
  defaultThumbnailSize: number
  title?: string
  subtitle?: string
  thumbnailComponent?: ReactNode
  placeholderIcon?: ReactNode
  rightComponent?: ReactNode
  style?: StyleProp<ViewStyle>
}>

export const InfoHeader: FunctionComponent<InfoHeaderProps> = ({
  title,
  subtitle,
  rightComponent,
  defaultThumbnailSize,
  thumbnailComponent,
  placeholderIcon,
  children,
  style,
}) => {
  const subtitleComponent = title ? (
    <Subtitle testID="subtitileWithTitle">{subtitle}</Subtitle>
  ) : (
    <SubtitleWithoutTitle testID="subtitleWithoutTitle">{subtitle}</SubtitleWithoutTitle>
  )

  return (
    <StyledView style={style}>
      {thumbnailComponent || (
        <ThumbnailPlaceholder
          width={defaultThumbnailSize}
          height={defaultThumbnailSize}
          testID="VenuePreviewPlaceholder"
          icon={placeholderIcon}
        />
      )}
      <RightContainer>
        {children}
        {title ? (
          <TitleContainer testID="titleContainer">
            <Title>{title}</Title>
            {rightComponent || null}
          </TitleContainer>
        ) : null}
        {subtitle ? subtitleComponent : null}
      </RightContainer>
    </StyledView>
  )
}

const StyledView = styled.View({
  flexShrink: 1,
  flexDirection: 'row',
  alignItems: 'center',
  columnGap: getSpacing(2),
})

const RightContainer = styled.View({
  flexShrink: 1,
  justifyContent: 'center',
})

const TitleContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  columnGap: getSpacing(1),
})

const Title = styled(Typo.BodyAccent).attrs({ numberOfLines: 1 })({
  flexShrink: 1,
})

const Subtitle = styled(Typo.BodyAccentXs).attrs({
  numberOfLines: 2,
})(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))

const SubtitleWithoutTitle = styled(Typo.BodyAccentS).attrs({
  numberOfLines: 2,
})({})
