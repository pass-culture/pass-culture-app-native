import React, { FunctionComponent } from 'react'
import { Text, View } from 'react-native'
import styled from 'styled-components/native'

import { BrokenConnection } from 'ui/svg/BrokenConnection'
import { BicolorIdCardWithMagnifyingGlass } from 'ui/svg/icons/BicolorIdCardWithMagnifyingGlass'
import { BicolorIdCardWithMagnifyingGlassDeprecated } from 'ui/svg/icons/BicolorIdCardWithMagnifyingGlass_deprecated'
import { BicolorPhonePending } from 'ui/svg/icons/BicolorPhonePending'
import { BirthdayCake } from 'ui/svg/icons/BirthdayCake'
import { BirthdayCakeDeprecated } from 'ui/svg/icons/BirthdayCake_deprecated'
import { CalendarIllustration } from 'ui/svg/icons/CalendarIllustration'
import { EmailSent } from 'ui/svg/icons/EmailSent'
import { EmptyFavorites } from 'ui/svg/icons/EmptyFavorites'
import { EmptyFavoritesDeprecated } from 'ui/svg/icons/EmptyFavorites_deprecated'
import { ErrorIllustration } from 'ui/svg/icons/ErrorIllustration'
import { HappyFace } from 'ui/svg/icons/HappyFace'
import { IdCardError } from 'ui/svg/icons/IdCardError'
import { LocationIllustration } from 'ui/svg/icons/LocationIllustration'
import { MaintenanceCone } from 'ui/svg/icons/MaintenanceCone'
import { NoBookings } from 'ui/svg/icons/NoBookings'
import { NoBookingsDeprecated } from 'ui/svg/icons/NoBookings_deprecated'
import { NoOffer } from 'ui/svg/icons/NoOffer'
import { NoOfferDeprecated } from 'ui/svg/icons/NoOffer_deprecated'
import { Notification } from 'ui/svg/icons/Notification'
import { PageNotFound } from 'ui/svg/icons/PageNotFound'
import { PhoneFlip } from 'ui/svg/icons/PhoneFlip'
import { ProfileDeletionIllustration } from 'ui/svg/icons/ProfileDeletionIllustration'
import { RequestSent } from 'ui/svg/icons/RequestSent'
import { SadFace } from 'ui/svg/icons/SadFace'
import { SadFaceDeprecated } from 'ui/svg/icons/SadFace_deprecated'
import { Star } from 'ui/svg/icons/Star'
import { TicketBooked } from 'ui/svg/icons/TicketBooked'
import { IconInterface } from 'ui/svg/icons/types'
import { UserBlocked } from 'ui/svg/icons/UserBlocked'
import { UserError } from 'ui/svg/icons/UserError'
import { UserFavorite } from 'ui/svg/icons/UserFavorite'
import { UserFavoriteDeprecated } from 'ui/svg/icons/UserFavorite_deprecated'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'
import { STANDARD_ICON_SIZE } from 'ui/theme/constants'

export const Illustrations: FunctionComponent = () => {
  return (
    <React.Fragment>
      <Text>{'Illustration icons should have a standard size of 140'}</Text>
      <Illustration name="BicolorPhonePending" component={BicolorPhonePending} isNew />
      <Illustration
        name="BicolorIdCardWithMagnifyingGlassDeprecated"
        component={BicolorIdCardWithMagnifyingGlassDeprecated}
      />
      <Illustration
        name="BicolorIdCardWithMagnifyingGlass"
        component={BicolorIdCardWithMagnifyingGlass}
        isNew
      />
      <Illustration name="BirthdayCakeDeprecated" component={BirthdayCakeDeprecated} />
      <Illustration name="BirthdayCake" component={BirthdayCake} isNew />
      <Illustration name="BrokenConnection" component={BrokenConnection} isNew />
      <Illustration name="CalendarIllustration" component={CalendarIllustration} isNew />
      <Illustration name="ErrorIllustration" component={ErrorIllustration} isNew />
      <Illustration name="EmailSent" component={EmailSent} isNew />
      <AlignedText>
        <EmptyFavoritesDeprecated size={STANDARD_ICON_SIZE} />
        <Text> - EmptyFavoritesDeprecated (deprecated) </Text>
      </AlignedText>
      <Illustration name="EmptyFavorites" component={EmptyFavorites} isNew />
      <Illustration name="HappyFace" component={HappyFace} isNew />
      <Illustration name="IdCardError" component={IdCardError} isNew />
      <Illustration name="LocationIllustration" component={LocationIllustration} isNew />
      <Illustration name="MaintenanceCone" component={MaintenanceCone} isNew />
      <Illustration name="NoBookingsDeprecated" component={NoBookingsDeprecated} />
      <Illustration name="NoBookings" component={NoBookings} isNew />
      <Illustration name="NoOfferDeprecated" component={NoOfferDeprecated} />
      <Illustration name="NoOffer" component={NoOffer} isNew />
      <Illustration name="Notification" component={Notification} isNew />
      <Illustration name="PageNotFound" component={PageNotFound} isNew />
      <Illustration name="PhoneFlip" component={PhoneFlip} isNew />
      <Illustration
        name="ProfileDeletionIllustration"
        component={ProfileDeletionIllustration}
        isNew
      />
      <Illustration name="RequestSent" component={RequestSent} isNew />
      <Illustration name="SadFaceDeprecated" component={SadFaceDeprecated} />
      <Illustration name="SadFace" component={SadFace} isNew />
      <Illustration name="Star" component={Star} isNew />
      <Illustration name="TicketBooked" component={TicketBooked} isNew />
      <Illustration name="UserBlocked" component={UserBlocked} isNew />
      <Illustration name="UserError" component={UserError} isNew />
      <Illustration name="UserFavoriteDeprecated" component={UserFavoriteDeprecated} />
      <Illustration name="UserFavorite" component={UserFavorite} isNew />
    </React.Fragment>
  )
}

interface IllustrationsProps {
  name: string
  component: React.ComponentType<IconInterface>
  isNew?: boolean
}

const Illustration = ({ name, component: IconComponent, isNew = false }: IllustrationsProps) => (
  <AlignedText>
    <IconComponent />
    <Text style={{ color: isNew ? ColorsEnum.BLACK : ColorsEnum.GREY_DARK }}>
      {` - ${name} ${isNew ? '' : '(deprecated)'}`}
    </Text>
  </AlignedText>
)
const AlignedText = styled(View)({
  flexDirection: 'row',
  alignItems: 'center',
})
