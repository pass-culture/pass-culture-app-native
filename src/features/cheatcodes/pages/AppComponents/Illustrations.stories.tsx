import { IconsContainer as Illustrations } from 'features/cheatcodes/pages/AppComponents/IconsContainer'
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

export default {
  title: 'ui/illustrations',
}

export const Bicolors = Illustrations.bind({})
Bicolors.args = {
  title: 'Illustration icons should have a standard size of 140',
  icons: {
    BicolorIdCardWithMagnifyingGlass,
    BicolorPhonePending,
  },
}

export const UniqueColors = Illustrations.bind({})
UniqueColors.args = {
  title: 'Illustration icons should have a standard size of 140',
  icons: {
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
