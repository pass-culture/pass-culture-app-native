import React, { FC } from 'react'
import { View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { Image } from 'libs/resizing-image-on-demand/Image'
import { useFontScaleValue } from 'shared/accessibility/useFontScaleValue'
import { CutoutVertical } from 'ui/svg/CutoutVertical'
import { StrokeVertical } from 'ui/svg/StrokeVertical'
import { Typo, getSpacing } from 'ui/theme'

export type BookingListItemProp = {
  imageUrl: string
  title: string
  subtitle: string
  display: 'punched' | 'full'
  children: React.JSX.Element
}

const FIXED_IMAGE_HEIGHT = getSpacing(36)
const FIXED_IMAGE_WIDTH = getSpacing(24)

export const BookingListItem: FC<BookingListItemProp> = ({
  imageUrl,
  title,
  subtitle,
  display,
  children,
}) => {
  const { designSystem } = useTheme()
  const titleNumberOfLines = useFontScaleValue({ default: 2, at200PercentZoom: undefined })
  const subtitleNumberOfLines = useFontScaleValue({
    default: 1,
    at200PercentZoom: undefined,
  })

  const content = (
    <Column>
      {children}
      <View>
        <Typo.BodyAccent numberOfLines={titleNumberOfLines}>{title}</Typo.BodyAccent>
        <Typo.BodyAccentXs numberOfLines={subtitleNumberOfLines}>{subtitle}</Typo.BodyAccentXs>
      </View>
    </Column>
  )
  const image = <StyledImage resizeMode="cover" url={imageUrl} />

  const backgroundColor = designSystem.color.background.default

  return display === 'punched' ? (
    <Ticket testID="punched_booking_list_item">
      <Container>
        <LeftContainer>{image}</LeftContainer>
        <MiddleBlock>
          <CutoutVertical orientation="up" color={backgroundColor} />
          <StrokeVertical color={designSystem.color.border.subtle} />
          <CutoutVertical orientation="down" color={backgroundColor} />
        </MiddleBlock>
        <RightContainer>{content}</RightContainer>
      </Container>
    </Ticket>
  ) : (
    <FullTicket testID="full_booking_list_item">
      <FullContainer>
        {image}
        {content}
      </FullContainer>
    </FullTicket>
  )
}

const StyledImage = styled(Image)(({ theme }) => ({
  borderTopLeftRadius: theme.designSystem.size.borderRadius.m,
  borderBottomLeftRadius: theme.designSystem.size.borderRadius.m,
  minHeight: FIXED_IMAGE_HEIGHT,
  minWidth: FIXED_IMAGE_WIDTH,
}))

const Ticket = styled.View(({ theme }) => ({
  minHeight: getSpacing(36.3),
  width: '100%',
  flex: 1,
  borderColor: theme.designSystem.color.border.subtle,
}))

const FullTicket = styled(Ticket)(({ theme }) => ({
  borderWidth: 1,
  borderRadius: theme.designSystem.size.borderRadius.m,
}))

const Container = styled.View({
  flexDirection: 'row',
  flex: 1,
  alignItems: 'center',
})

const FullContainer = styled(Container)(({ theme }) => ({
  gap: theme.designSystem.size.spacing.l,
  width: '100%',
}))

const Column = styled.View(({ theme }) => ({
  flex: 1,
  flexDirection: 'column',
  gap: theme.designSystem.size.spacing.xs,
  marginRight: theme.designSystem.size.spacing.xl,
  justifyContent: 'center',
}))

const ContentContainer = styled.View(({ theme }) => ({
  minHeight: getSpacing(36.3),
  backgroundColor: theme.designSystem.color.background.default,
  borderColor: theme.designSystem.color.border.subtle,
  borderTopWidth: 1,
  borderBottomWidth: 1,
}))

const LeftContainer = styled(ContentContainer)(({ theme }) => ({
  borderLeftWidth: 1,
  borderTopLeftRadius: theme.designSystem.size.borderRadius.m,
  borderBottomLeftRadius: theme.designSystem.size.borderRadius.m,
}))

const RightContainer = styled(ContentContainer)(({ theme }) => ({
  borderRightWidth: 1,
  borderTopRightRadius: theme.designSystem.size.borderRadius.m,
  borderBottomRightRadius: theme.designSystem.size.borderRadius.m,
  flex: 1,
  paddingLeft: theme.designSystem.size.spacing.xs,
}))

const MiddleBlock = styled.View(({ theme }) => ({
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: '100%',
  width: theme.designSystem.size.spacing.xl,
  marginLeft: -theme.designSystem.size.spacing.m,
}))
