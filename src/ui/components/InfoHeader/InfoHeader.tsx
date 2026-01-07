import React, { FunctionComponent, PropsWithChildren, ReactNode } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { useFontScaleValue } from 'shared/accessibility/useFontScaleValue'
import { ThumbnailPlaceholder } from 'ui/components/InfoHeader/ThumbnailPlaceHolder'
import { Typo } from 'ui/theme'

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
  const titleNumberOfLines = useFontScaleValue({ default: 1, at200PercentZoom: undefined })
  const subtitleNumberOfLines = useFontScaleValue({ default: 2, at200PercentZoom: undefined })

  const subtitleComponent = title ? (
    <Subtitle testID="subtitileWithTitle" numberOfLines={subtitleNumberOfLines}>
      {subtitle}
    </Subtitle>
  ) : (
    <SubtitleWithoutTitle testID="subtitleWithoutTitle" numberOfLines={subtitleNumberOfLines}>
      {subtitle}
    </SubtitleWithoutTitle>
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
            <Title numberOfLines={titleNumberOfLines}>{title}</Title>
            {rightComponent || null}
          </TitleContainer>
        ) : null}
        {subtitle ? subtitleComponent : null}
      </RightContainer>
    </StyledView>
  )
}

const StyledView = styled.View(({ theme }) => ({
  flexShrink: 1,
  flexDirection: 'row',
  alignItems: 'center',
  columnGap: theme.designSystem.size.spacing.s,
}))

const RightContainer = styled.View({
  flexShrink: 1,
  justifyContent: 'center',
})

const TitleContainer = styled.View(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  columnGap: theme.designSystem.size.spacing.xs,
}))

const Title = styled(Typo.BodyAccent)(({ theme }) => ({
  color: theme.designSystem.color.text.default,
  flexShrink: 1,
}))

const Subtitle = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))

const SubtitleWithoutTitle = styled(Typo.BodyAccentS)(({ theme }) => ({
  color: theme.designSystem.color.text.default,
}))
