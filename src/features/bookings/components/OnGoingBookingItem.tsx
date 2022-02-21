import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { StyleSheet } from 'react-native'
import styled from 'styled-components/native'

import { useAppSettings } from 'features/auth/settings'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { mapCategoryToIcon } from 'libs/parsers'
import { useSubcategory } from 'libs/subcategories'
import { Clock as DefaultClock } from 'ui/svg/icons/Clock'
import { Duo } from 'ui/svg/icons/Duo'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { Link } from 'ui/web/link/Link'

import { getBookingProperties, getBookingLabels } from '../helpers'

import { BookingItemTitle } from './BookingItemTitle'
import { OnGoingTicket } from './OnGoingTicket'
import { BookingItemProps } from './types'

export const OnGoingBookingItem = ({ booking }: BookingItemProps) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { data: settings = null } = useAppSettings()
  const { categoryId, isEvent } = useSubcategory(booking.stock.offer.subcategoryId)

  const { stock } = booking
  const bookingProperties = getBookingProperties(booking, isEvent)
  const { dateLabel, withdrawLabel } = getBookingLabels(booking, bookingProperties, settings)

  return (
    <Link
      to={{ screen: 'BookingDetails', params: { id: booking.id } }}
      style={styles.link}
      accessible={false}>
      <Container
        onPress={() => navigate('BookingDetails', { id: booking.id })}
        testID="OnGoingBookingItem">
        <OnGoingTicket image={stock.offer.image?.url} altIcon={mapCategoryToIcon(categoryId)} />
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
    </Link>
  )
}

const Container = styled.TouchableOpacity.attrs(({ theme }) => ({
  activeOpacity: theme.activeOpacity,
}))({
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

const styles = StyleSheet.create({
  link: {
    flexDirection: 'column',
    display: 'flex',
  },
})
