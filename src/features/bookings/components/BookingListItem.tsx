import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { Image } from 'libs/resizing-image-on-demand/Image'
import { Typo, getShadow, getSpacing } from 'ui/theme'

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
  const content = (
    <Container>
      <StyledImage url={imageUrl} />
      <Column>
        {children}
        <View>
          <Typo.BodyAccent>{title}</Typo.BodyAccent>
          <Typo.BodyAccentXs>{subtitle}</Typo.BodyAccentXs>
        </View>
      </Column>
    </Container>
  )

  return display === 'punched' ? (
    <Typo.BodyAccent testID="punched_booking_list_item">{'à venir'}</Typo.BodyAccent>
  ) : (
    <StyledView testID="full_booking_list_item">{content}</StyledView>
  )
}

const StyledImage = styled(Image)({
  borderTopLeftRadius: getSpacing(2),
  borderBottomLeftRadius: getSpacing(2),
  height: FIXED_IMAGE_HEIGHT,
  width: FIXED_IMAGE_WIDTH,
})

const StyledView = styled.View(({ theme }) => ({
  height: getSpacing(36),
  width: '100%',
  borderRadius: getSpacing(2),
  ...getShadow({
    shadowOffset: {
      width: 0,
      height: getSpacing(0.25),
    },
    shadowRadius: getSpacing(1.5),
    shadowColor: theme.colors.greyDark,
    shadowOpacity: 0.15,
  }),
}))

const Container = styled.View({
  flexDirection: 'row',
  flex: 1,
  height: '100%',
})

const Column = styled.View({
  flex: 1,
  flexDirection: 'column',
  gap: getSpacing(1),
  marginHorizontal: getSpacing(6),
  justifyContent: 'center',
})
