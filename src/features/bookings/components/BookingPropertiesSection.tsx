import { t } from '@lingui/macro'
import React from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { SettingsResponse } from 'api/gen'
import { Booking } from 'features/bookings/components/types'
import { getBookingLabels, getBookingProperties } from 'features/bookings/helpers'
import { useUserProfileInfo } from 'features/home/api'
import { useSubcategory } from 'libs/subcategories'
import { SectionRow } from 'ui/components/SectionRow'
import { Calendar } from 'ui/svg/icons/Calendar'
import { DuoBold } from 'ui/svg/icons/DuoBold'
import { LocationBuilding } from 'ui/svg/icons/LocationBuilding'
import { Profile } from 'ui/svg/icons/Profile'
import { Spacer, Typo } from 'ui/theme'

type BookingPropertiesSectionProps = {
  booking: Booking
  appSettings: SettingsResponse
  style?: StyleProp<ViewStyle>
}

export const BookingPropertiesSection: React.FC<BookingPropertiesSectionProps> = ({
  booking,
  appSettings,
  style,
}) => {
  const { data: user } = useUserProfileInfo()
  const { isEvent } = useSubcategory(booking.stock.offer.subcategoryId)
  const properties = getBookingProperties(booking, isEvent)
  const propertiesLabels = getBookingLabels(booking, properties, appSettings)

  const renderRowTitle = (title: string) => <Title>{title}</Title>

  let userFullName: string | undefined = undefined
  let userFullNameAccessibilityLabel: string | undefined = undefined
  if (user?.firstName && user?.lastName) {
    userFullName = `${user.firstName}\u00a0${user.lastName}`
    userFullNameAccessibilityLabel = t`Nom de la réservation ` + userFullName
  }
  return (
    <View style={style}>
      <Typo.Title4>{t`Ma réservation`}</Typo.Title4>
      <Spacer.Column numberOfSpaces={4.5} />
      {userFullName && userFullNameAccessibilityLabel ? (
        <SectionRow
          title={userFullName}
          accessibilityLabel={userFullNameAccessibilityLabel}
          renderTitle={(title) => (
            <TitleNameContainer>
              <Title>{title}</Title>
              <Spacer.Row numberOfSpaces={2} />
              {!!properties.isDuo && <DuoBold testID="duo-icon" />}
            </TitleNameContainer>
          )}
          type={'clickable'}
          icon={() => <Profile size={24} />}
        />
      ) : null}
      {propertiesLabels.dateLabel?.length > 0 && (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={5} />
          <SectionRow
            title={propertiesLabels.dateLabel}
            renderTitle={renderRowTitle}
            type={'clickable'}
            icon={() => <Calendar size={24} />}
          />
        </React.Fragment>
      )}
      <Spacer.Column numberOfSpaces={5} />
      {!!propertiesLabels.locationLabel && (
        <SectionRow
          title={propertiesLabels.locationLabel}
          renderTitle={renderRowTitle}
          type={'clickable'}
          icon={() => <LocationBuilding size={24} />}
        />
      )}
    </View>
  )
}

const TitleNameContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
})

const Title = styled(Typo.Body)``
