import React from 'react'
import { View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { Image } from 'libs/resizing-image-on-demand/Image'
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

export const BookingListItem = ({
  imageUrl,
  title,
  subtitle,
  display,
  children,
}: BookingListItemProp) => {
  const { designSystem } = useTheme()

  const content = (
    <Column>
      {children}
      <View>
        <Typo.BodyAccent numberOfLines={2}>{title}</Typo.BodyAccent>
        <Typo.BodyAccentXs numberOfLines={1}>{subtitle}</Typo.BodyAccentXs>
      </View>
    </Column>
  )
  const image = <StyledImage url={imageUrl} />

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

const StyledImage = styled(Image)({
  borderTopLeftRadius: getSpacing(2),
  borderBottomLeftRadius: getSpacing(2),
  height: FIXED_IMAGE_HEIGHT,
  width: FIXED_IMAGE_WIDTH,
})

const Ticket = styled.View(({ theme }) => ({
  height: getSpacing(36.3),
  width: '100%',
  borderColor: theme.designSystem.color.border.subtle,
}))

const FullTicket = styled(Ticket)({
  borderWidth: 1,
  borderRadius: getSpacing(2.1),
})

const Container = styled.View({
  flexDirection: 'row',
  flex: 1,
  alignItems: 'center',
})

const FullContainer = styled(Container)({
  gap: getSpacing(4),
  width: '100%',
})

const Column = styled.View({
  flex: 1,
  flexDirection: 'column',
  gap: getSpacing(1),
  marginRight: getSpacing(6),
  justifyContent: 'center',
})

const ContentContainer = styled.View(({ theme }) => ({
  height: getSpacing(36.3),
  backgroundColor: theme.designSystem.color.background.default,
  borderColor: theme.designSystem.color.border.subtle,
  borderTopWidth: 1,
  borderBottomWidth: 1,
}))

const LeftContainer = styled(ContentContainer)({
  borderLeftWidth: 1,
  borderTopLeftRadius: getSpacing(2.1),
  borderBottomLeftRadius: getSpacing(2.1),
})

const RightContainer = styled(ContentContainer)({
  borderRightWidth: 1,
  borderTopRightRadius: getSpacing(2.1),
  borderBottomRightRadius: getSpacing(2.1),
  flex: 1,
  paddingLeft: getSpacing(1),
})

const MiddleBlock = styled.View({
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: '100%',
  width: getSpacing(6),
  marginLeft: getSpacing(-3),
})
