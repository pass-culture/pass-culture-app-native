import React from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { getBookingLabels, getBookingProperties } from 'features/bookings/helpers'
import { Booking } from 'features/bookings/types'
import { PriceLine } from 'features/bookOffer/components/PriceLine'
import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { useSubcategory } from 'libs/subcategories'
import { SectionRow } from 'ui/components/SectionRow'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Calendar as DefaultCalendar } from 'ui/svg/icons/Calendar'
import { Duo } from 'ui/svg/icons/Duo'
import { LocationBuilding as DefaultLocationBuilding } from 'ui/svg/icons/LocationBuilding'
import { OrderPrice as DefaultOrderPrice } from 'ui/svg/icons/OrderPrice'
import { Profile as DefaultProfile } from 'ui/svg/icons/Profile'
import { Typo, getSpacing } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type BookingPropertiesSectionProps = {
  booking: Booking
  style?: StyleProp<ViewStyle>
}

export const BookingPropertiesSection: React.FC<BookingPropertiesSectionProps> = ({
  booking,
  style,
}) => {
  const { user } = useAuthContext()
  const { isEvent } = useSubcategory(booking.stock.offer.subcategoryId)
  const properties = getBookingProperties(booking, isEvent)
  const propertiesLabels = getBookingLabels(booking, properties)

  const renderRowTitle = (title: string) => <Title>{title}</Title>

  let userFullName: string | undefined = undefined
  if (user?.firstName && user?.lastName) {
    userFullName = `${user.firstName}\u00a0${user.lastName}`
  }

  return (
    <View style={style}>
      <Typo.Title4 {...getHeadingAttrs(2)}>Ma réservation</Typo.Title4>
      <StyledViewGap gap={5}>
        {userFullName ? (
          <SectionRow
            title={userFullName}
            accessibilityLabel={`Au nom de ${userFullName}`}
            renderTitle={(title) => (
              <TitleNameContainer>
                <Title>{title}</Title>
                {properties.isDuo ? (
                  <IconDuoContainer
                    {...accessibilityAndTestId('DUO&nbsp;: Elle comporte 2 places.')}>
                    <Duo testID="duo-icon" />
                  </IconDuoContainer>
                ) : null}
              </TitleNameContainer>
            )}
            type="clickable"
            icon={Profile}
          />
        ) : null}
        {propertiesLabels.dateLabel?.length > 0 ? (
          <React.Fragment>
            <SectionRow
              title={propertiesLabels.dateLabel}
              renderTitle={renderRowTitle}
              type="clickable"
              icon={Calendar}
              accessibilityLabel={`Date\u00a0: ${propertiesLabels.dateLabel}`}
            />
          </React.Fragment>
        ) : null}
        {propertiesLabels.locationLabel ? (
          <SectionRow
            title={propertiesLabels.locationLabel}
            renderTitle={renderRowTitle}
            type="clickable"
            icon={LocationBuilding}
            accessibilityLabel={`Se tiendra dans le lieu ${propertiesLabels.locationLabel}`}
          />
        ) : null}
        <SectionRow
          title=""
          renderTitle={() => (
            <PriceLine
              unitPrice={booking.stock.price}
              quantity={booking.quantity}
              label={booking.stock.priceCategoryLabel}
              attributes={booking.stock.features}
              shouldDisabledStyles
            />
          )}
          type="clickable"
          icon={OrderPrice}
        />
      </StyledViewGap>
    </View>
  )
}
const StyledViewGap = styled(ViewGap)({
  marginTop: getSpacing(4.5),
})
const TitleNameContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  gap: getSpacing(2),
})

const IconDuoContainer = styled.View({
  // the Duo icon is wide so we increase the size and remove the margin
  // so that it has the same size as the text
  marginVertical: -getSpacing(1.5),
})

const Title = styled(Typo.Body)({
  marginRight: getSpacing(2),
})

const Calendar = styled(DefaultCalendar).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``

const Profile = styled(DefaultProfile).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``

const LocationBuilding = styled(DefaultLocationBuilding).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``

const OrderPrice = styled(DefaultOrderPrice).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``
