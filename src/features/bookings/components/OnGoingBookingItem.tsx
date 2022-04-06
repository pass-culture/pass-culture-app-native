import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { useAppSettings } from 'features/auth/settings'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { useCategoryId, useSubcategory } from 'libs/subcategories'
import { tileAccessibilityLabel, TileContentType } from 'libs/tileAccessibilityLabel'
import { OfferImage } from 'ui/components/tiles/OfferImage'
import { Clock as DefaultClock } from 'ui/svg/icons/Clock'
import { Duo } from 'ui/svg/icons/Duo'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typography'
import { TouchableLink } from 'ui/web/link/TouchableLink'

import { getBookingProperties, getBookingLabels } from '../helpers'

import { BookingItemTitle } from './BookingItemTitle'
import { BookingItemProps } from './types'

export const OnGoingBookingItem = ({ booking }: BookingItemProps) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { data: settings = null } = useAppSettings()
  const { isEvent } = useSubcategory(booking.stock.offer.subcategoryId)
  const categoryId = useCategoryId(booking.stock.offer.subcategoryId)

  const { stock } = booking
  const bookingProperties = getBookingProperties(booking, isEvent)
  const { dateLabel, withdrawLabel } = getBookingLabels(booking, bookingProperties, settings)

  const accessibilityLabel = tileAccessibilityLabel(TileContentType.BOOKING, {
    name: stock.offer.name,
    properties: bookingProperties,
    date: dateLabel,
  })

  return (
    <View {...getHeadingAttrs(3)}>
      <Container
        to={{ screen: 'BookingDetails', params: { id: booking.id } }}
        onPress={() => navigate('BookingDetails', { id: booking.id })}
        accessibilityLabel={accessibilityLabel}
        testID="OnGoingBookingItem">
        <OfferImage imageUrl={stock.offer.image?.url} categoryId={categoryId} size="tall" />
        <AttributesView>
          <BookingItemTitle title={stock.offer.name} />
          {!!dateLabel && <DateLabel>{dateLabel}</DateLabel>}
          <Spacer.Column numberOfSpaces={1} />
          {!!bookingProperties.isDuo && <Duo />}
          <Spacer.Flex />
          {!!withdrawLabel && (
            <WithDrawContainer>
              <Clock />
              <Spacer.Row numberOfSpaces={1} />
              <WithdrawCaption numberOfLines={2}>{withdrawLabel}</WithdrawCaption>
            </WithDrawContainer>
          )}
        </AttributesView>
      </Container>
    </View>
  )
}

const Container = styled(TouchableLink)({
  paddingHorizontal: getSpacing(6),
  flexDirection: 'row',
})

const AttributesView = styled.View({
  flex: 1,
  paddingLeft: getSpacing(4),
  paddingRight: getSpacing(1),
})

const WithDrawContainer = styled.View(({ theme }) => ({
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  color: theme.colors.primary,
}))

const DateLabel = styled(Typo.Body)(({ theme }) => ({
  flex: 1,
  color: theme.colors.greyDark,
}))

const WithdrawCaption = styled(Typo.Caption)({
  marginRight: getSpacing(4),
})

const Clock = styled(DefaultClock).attrs(({ theme }) => ({
  color: theme.colors.primary,
  size: theme.icons.sizes.extraSmall,
}))``
