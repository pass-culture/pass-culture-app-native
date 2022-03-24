import { ComponentStory } from '@storybook/react'
import React from 'react'
import { Text } from 'react-native'

import { Illustration } from 'ui/storybook/Illustration'
import { Facebook } from 'ui/svg/icons/socialNetwork/Facebook'
import { Instagram } from 'ui/svg/icons/socialNetwork/Instagram'
import { Snapchat } from 'ui/svg/icons/socialNetwork/Snapchat'
import { TikTok } from 'ui/svg/icons/socialNetwork/TikTok'
import { Twitter } from 'ui/svg/icons/socialNetwork/Twitter'
import { Telegram } from 'ui/svg/icons/socialNetwork/Telegram'
import { WhatsApp } from 'ui/svg/icons/socialNetwork/WhatsApp'
import { Again } from 'ui/svg/icons/Again'
import { ArrowNext } from 'ui/svg/icons/ArrowNext'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Bell } from 'ui/svg/icons/Bell'
import { BicolorAroundMe } from 'ui/svg/icons/BicolorAroundMe'
import { BicolorBookings } from 'ui/svg/icons/BicolorBookings'
import { BicolorConfidentiality } from 'ui/svg/icons/BicolorConfidentiality'
import { BicolorEverywhere } from 'ui/svg/icons/BicolorEverywhere'
import { BicolorFavorite } from 'ui/svg/icons/BicolorFavorite'
import { BicolorLocationBuilding } from 'ui/svg/icons/BicolorLocationBuilding'
import { BicolorLocationPointer } from 'ui/svg/icons/BicolorLocationPointer'
import { BicolorLock } from 'ui/svg/icons/BicolorLock'
import { BicolorLogo } from 'ui/svg/icons/BicolorLogo'
import { BicolorProfile } from 'ui/svg/icons/BicolorProfile'
import { BicolorSearch } from 'ui/svg/icons/BicolorSearch'
// import { BicolorSelector } from 'ui/svg/icons/BicolorSelector'
import { Booking } from 'ui/svg/icons/Booking'
import { Calendar } from 'ui/svg/icons/Calendar'
import { Check } from 'ui/svg/icons/Check'
import { Clock } from 'ui/svg/icons/Clock'
import { ClockFilled } from 'ui/svg/icons/ClockFilled'
import { Close } from 'ui/svg/icons/Close'
import { Confidentiality } from 'ui/svg/icons/Confidentiality'
import { Confirmation } from 'ui/svg/icons/Confirmation'
import { Digital } from 'ui/svg/icons/Digital'
import { Duo } from 'ui/svg/icons/Duo'
import { Duplicate } from 'ui/svg/icons/Duplicate'
import { EditPen } from 'ui/svg/icons/EditPen'
import { Email } from 'ui/svg/icons/Email'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'
import { Error } from 'ui/svg/icons/Error'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Eye } from 'ui/svg/icons/Eye'
import { EyeSlash } from 'ui/svg/icons/EyeSlash'
import { Favorite } from 'ui/svg/icons/Favorite'
import { FavoriteFilled } from 'ui/svg/icons/FavoriteFilled'
import { Flag } from 'ui/svg/icons/Flag'
import { Flash } from 'ui/svg/icons/Flash'
import { HandicapAudio } from 'ui/svg/icons/HandicapAudio'
import { HandicapMental } from 'ui/svg/icons/HandicapMental'
import { HandicapMotor } from 'ui/svg/icons/HandicapMotor'
import { HandicapVisual } from 'ui/svg/icons/HandicapVisual'
import { IdCard } from 'ui/svg/icons/IdCard'
import { Idea } from 'ui/svg/icons/Idea'
import { Info } from 'ui/svg/icons/Info'
import { InfoPlain } from 'ui/svg/icons/InfoPlain'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { Key } from 'ui/svg/icons/Key'
import { LegalNotices } from 'ui/svg/icons/LegalNotices'
import { LifeBuoy } from 'ui/svg/icons/LifeBuoy'
import { LocationBuilding } from 'ui/svg/icons/LocationBuilding'
import { LocationPointer } from 'ui/svg/icons/LocationPointer'
import { LocationPointerNotFilled } from 'ui/svg/icons/LocationPointerNotFilled'
import { Lock } from 'ui/svg/icons/Lock'
import { Logo } from 'ui/svg/icons/Logo'
import { MagnifyingGlass } from 'ui/svg/icons/MagnifyingGlass'
import { OfferDigital } from 'ui/svg/icons/OfferDigital'
import { OfferEvent } from 'ui/svg/icons/OfferEvent'
import { OfferPhysical } from 'ui/svg/icons/OfferPhysical'
import { Offers } from 'ui/svg/icons/Offers'
import { OrderPrice } from 'ui/svg/icons/OrderPrice'
import { PhoneFilled } from 'ui/svg/icons/PhoneFilled'
import { PlainArrowPrevious } from 'ui/svg/icons/PlainArrowPrevious'
import { Plus } from 'ui/svg/icons/Plus'
import { Profile } from 'ui/svg/icons/Profile'
import { ProfileDeletion } from 'ui/svg/icons/ProfileDeletion'
import { Quote } from 'ui/svg/icons/Quote'
import { Share } from 'ui/svg/icons/Share'
import { SignOut } from 'ui/svg/icons/SignOut'
import { SMSFilled } from 'ui/svg/icons/SMSFilled'
import { Sun } from 'ui/svg/icons/Sun'
import { IconInterface } from 'ui/svg/icons/types'
import { Validate } from 'ui/svg/icons/Validate'
import { Warning } from 'ui/svg/icons/Warning'

export default {
  title: 'ui/icons',
}

const Icons: ComponentStory<
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

export const SocialNetwork = Icons.bind({})
SocialNetwork.args = {
  icon: {
    Facebook,
    Instagram,
    Snapchat,
    Twitter,
    WhatsApp,
    TikTok,
    Telegram,
  },
}

export const IdentityCheck = Icons.bind({})
IdentityCheck.args = {
  icon: {
    Profile,
    IdCard,
    Confirmation,
  },
}

export const SecondaryAndBigger = Icons.bind({})
SecondaryAndBigger.args = {
  icon: {
    BicolorAroundMe,
    BicolorBookings,
    BicolorConfidentiality,
    BicolorEverywhere,
    BicolorFavorite,
    BicolorLock,
    BicolorLocationPointer,
    BicolorLocationBuilding,
    BicolorLogo,
    BicolorProfile,
    BicolorSearch,
    // BicolorSelector,
    ArrowNext,
    ArrowPrevious,
    Bell,
    Booking,
    Calendar,
    Check,
    Clock,
    Close,
    Confidentiality,
    Duo,
    Email,
    Error,
    ExternalSite,
    Eye,
    EyeSlash,
    Favorite,
    FavoriteFilled,
    Flash,
    HandicapVisual,
    HandicapMental,
    HandicapMotor,
    HandicapAudio,
    Idea,
    Info,
    LegalNotices,
    LifeBuoy,
    LocationBuilding,
    LocationPointerNotFilled,
    Lock,
    Logo,
    MagnifyingGlass,
    OfferDigital,
    OfferEvent,
    OfferPhysical,
    Offers,
    OrderPrice,
    ProfileDeletion,
    Quote,
    SignOut,
    Share,
    Sun,
    Warning,
  },
}

export const TertiaryAndSmaller = Icons.bind({})
TertiaryAndSmaller.args = {
  icon: {
    Again,
    ClockFilled,
    Digital,
    Duplicate,
    EditPen,
    EmailFilled,
    ExternalSiteFilled,
    Flag,
    InfoPlain,
    Invalidate,
    Key,
    LocationPointer,
    PhoneFilled,
    PlainArrowPrevious,
    Plus,
    SMSFilled,
    Validate,
  },
}
