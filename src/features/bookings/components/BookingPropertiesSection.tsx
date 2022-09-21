import React from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { useAppSettings } from 'features/auth/settings'
import { getBookingLabels, getBookingProperties } from 'features/bookings/helpers'
import { Booking } from 'features/bookings/types'
import { useUserProfileInfo } from 'features/profile/api'
import { useSubcategory } from 'libs/subcategories'
import { theme } from 'theme'
import { SectionRow } from 'ui/components/SectionRow'
import { BicolorProfile as DefaultProfile } from 'ui/svg/icons/BicolorProfile'
import { Calendar as DefaultCalendar } from 'ui/svg/icons/Calendar'
import { Duo } from 'ui/svg/icons/Duo'
import { LocationBuilding as DefaultLocationBuilding } from 'ui/svg/icons/LocationBuilding'
import { Spacer, Typo, getSpacing } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type BookingPropertiesSectionProps = {
  booking: Booking
  style?: StyleProp<ViewStyle>
}

export const BookingPropertiesSection: React.FC<BookingPropertiesSectionProps> = ({
  booking,
  style,
}) => {
  const { data: user } = useUserProfileInfo()
  const { data: settings } = useAppSettings()
  const { isEvent } = useSubcategory(booking.stock.offer.subcategoryId)
  const properties = getBookingProperties(booking, isEvent)
  const propertiesLabels = getBookingLabels(booking, properties, settings ?? null)

  const renderRowTitle = (title: string) => <Title>{title}</Title>

  let userFullName: string | undefined = undefined
  if (user?.firstName && user?.lastName) {
    userFullName = `${user.firstName}\u00a0${user.lastName}`
  }

  return (
    <View style={style}>
      <Typo.Title4 {...getHeadingAttrs(2)}>Ma réservation</Typo.Title4>
      <Spacer.Column numberOfSpaces={4.5} />
      {userFullName ? (
        <SectionRow
          title={userFullName}
          accessibilityLabel={`Au nom de ${userFullName}`}
          renderTitle={(title) => (
            <TitleNameContainer>
              <Title>{title}</Title>
              <Spacer.Row numberOfSpaces={2} />
              {!!properties.isDuo && (
                <IconDuoContainer accessibilityLabel="DUO&nbsp;: Elle comporte 2 places.">
                  <Duo testID="duo-icon" />
                </IconDuoContainer>
              )}
            </TitleNameContainer>
          )}
          type="clickable"
          icon={() => <Profile color={theme.colors.black} color2={theme.colors.black} />}
        />
      ) : null}
      {propertiesLabels.dateLabel?.length > 0 && (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={5} />
          <SectionRow
            title={propertiesLabels.dateLabel}
            accessibilityLabel={`Date\u00a0: ${propertiesLabels.dateLabel}`}
            renderTitle={renderRowTitle}
            type="clickable"
            icon={() => <Calendar />}
          />
        </React.Fragment>
      )}
      <Spacer.Column numberOfSpaces={5} />
      {!!propertiesLabels.locationLabel && (
        <SectionRow
          title={propertiesLabels.locationLabel}
          accessibilityLabel={`Se tiendra dans le lieu ${propertiesLabels.locationLabel}`}
          renderTitle={renderRowTitle}
          type="clickable"
          icon={() => <LocationBuilding />}
        />
      )}
    </View>
  )
}

const TitleNameContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
})

const IconDuoContainer = styled.View({
  // the Duo icon is wide so we increase the size and remove the margin
  // so that it has the same size as the text
  marginVertical: -getSpacing(1.5),
})

const Title = styled(Typo.Body)``

const Calendar = styled(DefaultCalendar).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``

const Profile = styled(DefaultProfile).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``

const LocationBuilding = styled(DefaultLocationBuilding).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``
