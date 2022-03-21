import { ComponentStory } from '@storybook/react'
import React from 'react'
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
import { IconInterface } from 'ui/svg/icons/types'
import { UserBlocked } from 'ui/svg/icons/UserBlocked'
import { UserError } from 'ui/svg/icons/UserError'
import { UserFavorite } from 'ui/svg/icons/UserFavorite'

export default {
  title: 'ui/illustrations',
}

const Illustrations: ComponentStory<
  React.FC<{
    icon: Record<string, React.ComponentType<IconInterface>>
    children?: never
  }>
> = ({ icon }) => (
  <React.Fragment>
    <Text>{'Illustration icons should have a standard size of 140'}</Text>
    {Array.from(Object.entries(icon)).map(([name, icon]) => (
      <Illustration key={name} name={name} component={icon} />
    ))}
  </React.Fragment>
)

export const Bicolors = Illustrations.bind({})
Bicolors.args = {
  icon: {
    BicolorIdCardWithMagnifyingGlass,
    BicolorPhonePending,
  },
}

export const UniqueColors = Illustrations.bind({})
UniqueColors.args = {
  icon: {
    BrokenConnection,
    BirthdayCake,
    CalendarIllustration,
    EmailSent,
    EmptyFavorites,
    ErrorIllustration,
    HappyFace,
    IdCardError,
    LocationIllustration,
    MaintenanceCone,
    NoBookings,
    NoOffer,
    Notification,
    PageNotFound,
    PhoneFlip,
    ProfileDeletionIllustration,
    RequestSent,
    SadFace,
    Star,
    TicketBooked,
    UserBlocked,
    UserError,
    UserFavorite,
  },
}
