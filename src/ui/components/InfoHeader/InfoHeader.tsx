import React, { FunctionComponent, PropsWithChildren, ReactNode } from 'react'
import styled from 'styled-components/native'

import { ThumbnailPlaceholder } from 'ui/components/InfoHeader/ThumbnailPlaceHolder'
import { TypoDS, getSpacing } from 'ui/theme'

type InfoHeaderProps = PropsWithChildren<{
  title: string
  defaultThumbnailSize: number
  subtitle?: string
  thumbnailComponent?: ReactNode
  rightComponent?: ReactNode
}>

export const InfoHeader: FunctionComponent<InfoHeaderProps> = ({
  title,
  subtitle,
  rightComponent,
  defaultThumbnailSize,
  thumbnailComponent,
  children,
}) => (
  <StyledView>
    {thumbnailComponent || (
      <ThumbnailPlaceholder
        width={defaultThumbnailSize}
        height={defaultThumbnailSize}
        testID="VenuePreviewPlaceholder"
      />
    )}
    <RightContainer>
      {children}
      <TitleContainer>
        <Title>{title}</Title>
        {rightComponent || null}
      </TitleContainer>
      {subtitle ? <Subtitle>{subtitle}</Subtitle> : null}
    </RightContainer>
  </StyledView>
)

const StyledView = styled.View({
  flexShrink: 1,
  flexDirection: 'row',
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

const Title = styled(TypoDS.BodyAccent).attrs({ numberOfLines: 1 })({
  flexShrink: 1,
})

const Subtitle = styled(TypoDS.BodyAccentXs).attrs({ numberOfLines: 2 })(({ theme }) => ({
  color: theme.colors.greyDark,
}))
