import React, { FunctionComponent } from 'react'
import { Text } from 'react-native'

import { Illustration } from 'ui/storybook/Illustration'
import { BrokenConnection } from 'ui/svg/BrokenConnection'
import { BicolorIdCardWithMagnifyingGlass } from 'ui/svg/icons/BicolorIdCardWithMagnifyingGlass'
import { BicolorPhonePending } from 'ui/svg/icons/BicolorPhonePending'
import { BirthdayCake } from 'ui/svg/icons/BirthdayCake'
import { CalendarIllustration } from 'ui/svg/icons/CalendarIllustration'
import { EmailSent } from 'ui/svg/icons/EmailSent'
import { EmptyFavorites } from 'ui/svg/icons/EmptyFavorites'
import { ErrorIllustration } from 'ui/svg/icons/ErrorIllustration'
import { HappyFace } from 'ui/svg/icons/HappyFace'
import { IdCardError } from 'ui/svg/icons/IdCardError'
import { LocationIllustration } from 'ui/svg/icons/LocationIllustration'
import { MaintenanceCone } from 'ui/svg/icons/MaintenanceCone'
import { NoBookings } from 'ui/svg/icons/NoBookings'
import { NoOffer } from 'ui/svg/icons/NoOffer'
import { Notification } from 'ui/svg/icons/Notification'
import { PageNotFound } from 'ui/svg/icons/PageNotFound'
import { PhoneFlip } from 'ui/svg/icons/PhoneFlip'
import { ProfileDeletionIllustration } from 'ui/svg/icons/ProfileDeletionIllustration'
import { RequestSent } from 'ui/svg/icons/RequestSent'
import { SadFace } from 'ui/svg/icons/SadFace'
import { Star } from 'ui/svg/icons/Star'
import { TicketBooked } from 'ui/svg/icons/TicketBooked'
import { UserBlocked } from 'ui/svg/icons/UserBlocked'
import { UserError } from 'ui/svg/icons/UserError'
import { UserFavorite } from 'ui/svg/icons/UserFavorite'

export const Illustrations: FunctionComponent = () => {
  return (
    <React.Fragment>
      <Text>{'Illustration icons should have a standard size of 140'}</Text>
      <Illustration name="BicolorPhonePending" component={BicolorPhonePending} />
      <Illustration
        name="BicolorIdCardWithMagnifyingGlass"
        component={BicolorIdCardWithMagnifyingGlass}
      />
      <Illustration name="BirthdayCake" component={BirthdayCake} />
      <Illustration name="BrokenConnection" component={BrokenConnection} />
      <Illustration name="CalendarIllustration" component={CalendarIllustration} />
      <Illustration name="ErrorIllustration" component={ErrorIllustration} />
      <Illustration name="EmailSent" component={EmailSent} />
      <Illustration name="EmptyFavorites" component={EmptyFavorites} />
      <Illustration name="HappyFace" component={HappyFace} />
      <Illustration name="IdCardError" component={IdCardError} />
      <Illustration name="LocationIllustration" component={LocationIllustration} />
      <Illustration name="MaintenanceCone" component={MaintenanceCone} />
      <Illustration name="NoBookings" component={NoBookings} />
      <Illustration name="NoOffer" component={NoOffer} />
      <Illustration name="Notification" component={Notification} />
      <Illustration name="PageNotFound" component={PageNotFound} />
      <Illustration name="PhoneFlip" component={PhoneFlip} />
      <Illustration name="ProfileDeletionIllustration" component={ProfileDeletionIllustration} />
      <Illustration name="RequestSent" component={RequestSent} />
      <Illustration name="SadFace" component={SadFace} />
      <Illustration name="Star" component={Star} />
      <Illustration name="TicketBooked" component={TicketBooked} />
      <Illustration name="UserBlocked" component={UserBlocked} />
      <Illustration name="UserError" component={UserError} />
      <Illustration name="UserFavorite" component={UserFavorite} />
    </React.Fragment>
  )
}
