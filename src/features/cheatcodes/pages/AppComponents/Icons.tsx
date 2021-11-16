/* eslint-disable react-native/no-raw-text */
import React, { FunctionComponent } from 'react'
import { View, Text } from 'react-native'
import styled from 'styled-components/native'

import { SearchGroupNameEnum, VenueTypeCodeKey } from 'api/gen/api'
import { CATEGORY_CRITERIA } from 'features/search/enums'
import { mapVenueTypeToIcon } from 'libs/parsers'
import { useSearchGroupLabelMapping } from 'libs/subcategories/mappings'
import { SocialNetworkCard } from 'ui/components/SocialNetworkCard'
import { SocialNetworkIconsMap, SocialNetwork } from 'ui/components/socials/types'
import { Again } from 'ui/svg/icons/Again'
import { AroundMe } from 'ui/svg/icons/AroundMe'
import { ArrowNext } from 'ui/svg/icons/ArrowNext'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Bell } from 'ui/svg/icons/Bell'
import { BicolorBookings } from 'ui/svg/icons/BicolorBookings'
import { BicolorConfidentiality } from 'ui/svg/icons/BicolorConfidentiality'
import { BicolorFavorite } from 'ui/svg/icons/BicolorFavorite'
import { BicolorLocationBuilding } from 'ui/svg/icons/BicolorLocationBuilding'
import { BicolorLocationPointer } from 'ui/svg/icons/BicolorLocationPointer'
import { BicolorLock } from 'ui/svg/icons/BicolorLock'
import { BicolorLogo } from 'ui/svg/icons/BicolorLogo'
import { BicolorProfile } from 'ui/svg/icons/BicolorProfile'
import { BicolorSearch } from 'ui/svg/icons/BicolorSearch'
import { BicolorSelector } from 'ui/svg/icons/BicolorSelector'
import { Booking } from 'ui/svg/icons/Booking'
import { Calendar } from 'ui/svg/icons/Calendar'
import { CalendarDeprecated } from 'ui/svg/icons/Calendar_deprecated'
import { Check } from 'ui/svg/icons/Check'
import { Clock } from 'ui/svg/icons/Clock'
import { Close } from 'ui/svg/icons/Close'
import { Confidentiality } from 'ui/svg/icons/Confidentiality'
import { Confirmation } from 'ui/svg/icons/Confirmation'
import { Digital } from 'ui/svg/icons/Digital'
import { Duo } from 'ui/svg/icons/Duo'
import { DuoBold } from 'ui/svg/icons/DuoBold'
import { DuoPerson } from 'ui/svg/icons/DuoPerson'
import { EditPen } from 'ui/svg/icons/EditPen'
import { Email } from 'ui/svg/icons/Email'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'
import { Error } from 'ui/svg/icons/Error'
import { Everywhere } from 'ui/svg/icons/Everywhere'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { ExternalSiteDeprecated } from 'ui/svg/icons/ExternalSite_deprecated'
import { Eye } from 'ui/svg/icons/Eye'
import { EyeSlash } from 'ui/svg/icons/EyeSlash'
import { Favorite } from 'ui/svg/icons/Favorite'
import { Flag } from 'ui/svg/icons/Flag'
import { HandicapAudio } from 'ui/svg/icons/HandicapAudio'
import { HandicapMental } from 'ui/svg/icons/HandicapMental'
import { HandicapMotor } from 'ui/svg/icons/HandicapMotor'
import { HandicapVisual } from 'ui/svg/icons/HandicapVisual'
import { HappyFace } from 'ui/svg/icons/HappyFace'
import { HappyFaceStars } from 'ui/svg/icons/HappyFaceStars'
import { IdCard } from 'ui/svg/icons/IdCard'
import { Info } from 'ui/svg/icons/Info'
import { InfoDeprecated } from 'ui/svg/icons/Info_deprecated'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { LegalNotices } from 'ui/svg/icons/LegalNotices'
import { LifeBuoy } from 'ui/svg/icons/LifeBuoy'
import { LocationBuilding } from 'ui/svg/icons/LocationBuilding'
import { LocationBuildingDeprecated } from 'ui/svg/icons/LocationBuilding_deprecated'
import { LocationPointer } from 'ui/svg/icons/LocationPointer'
import { LocationPointerNotFilled } from 'ui/svg/icons/LocationPointerNotFilled'
import { Lock } from 'ui/svg/icons/Lock'
import { Logo } from 'ui/svg/icons/Logo'
import { LogoPassCulture } from 'ui/svg/icons/LogoPassCulture'
import { MagnifyingGlass } from 'ui/svg/icons/MagnifyingGlass'
import { MagnifyingGlassDeprecated } from 'ui/svg/icons/MagnifyingGlass_deprecated'
import { MaintenanceCone } from 'ui/svg/icons/MaintenanceCone'
import { NoOffer } from 'ui/svg/icons/NoOffer'
import { OfferDigital } from 'ui/svg/icons/OfferDigital'
import { OfferOutings } from 'ui/svg/icons/OfferOutings'
import { OfferOutingsPhysical } from 'ui/svg/icons/OfferOutingsPhysical'
import { OfferPhysical } from 'ui/svg/icons/OfferPhysical'
import { OrderPrice } from 'ui/svg/icons/OrderPrice'
import { PhoneFilled } from 'ui/svg/icons/PhoneFilled'
import { PlainArrowPrevious } from 'ui/svg/icons/PlainArrowPrevious'
import { Profile } from 'ui/svg/icons/Profile'
import { ProfileDeprecated } from 'ui/svg/icons/Profile_deprecated'
import { ProfileDeletion } from 'ui/svg/icons/ProfileDeletion'
import { RequestSent } from 'ui/svg/icons/RequestSent'
import { SadFace } from 'ui/svg/icons/SadFace'
import { SignOut } from 'ui/svg/icons/SignOut'
import { TicketBooked } from 'ui/svg/icons/TicketBooked'
import { UserCircle } from 'ui/svg/icons/UserCircle'
import { Validate } from 'ui/svg/icons/Validate'
import { Warning } from 'ui/svg/icons/Warning'
import { WarningDeprecated } from 'ui/svg/icons/Warning_deprecated'
import { ColorsEnum, getSpacing, Spacer } from 'ui/theme'

const ICON_SIZE = getSpacing(8)

export const Icons: FunctionComponent = () => {
  return (
    <React.Fragment>
      <SocialNetworkIcons />
      <Spacer.Column numberOfSpaces={4} />

      <CategoryIcons />
      <Spacer.Column numberOfSpaces={4} />

      <VenueTypesIcons />
      <Spacer.Column numberOfSpaces={4} />

      <IdentityCheckIcons />
      <Spacer.Column numberOfSpaces={4} />

      <Icon name="PlainArrowPrevious" component={PlainArrowPrevious} isNew />
      <AlignedText>
        <PlainArrowPrevious size={ICON_SIZE} />
        <Text> - PlainArrowPrevious </Text>
      </AlignedText>
      <AlignedText>
        <Again size={ICON_SIZE} />
        <Text> - Again (new) </Text>
      </AlignedText>
      <AlignedText>
        <ArrowPrevious size={ICON_SIZE} />
        <Text> - ArrowPrevious </Text>
      </AlignedText>
      <AlignedText>
        <ArrowNext size={ICON_SIZE} />
        <Text> - ArrowNext </Text>
      </AlignedText>
      <AlignedText>
        <Check size={ICON_SIZE} />
        <Text> - Check </Text>
      </AlignedText>
      <AlignedText>
        <Clock size={ICON_SIZE} />
        <Text> - Clock (new)</Text>
      </AlignedText>
      <AlignedText>
        <Close size={ICON_SIZE} />
        <Text> - Close </Text>
      </AlignedText>
      <AlignedText>
        <Duo size={ICON_SIZE} />
        <Text> - Duo </Text>
      </AlignedText>
      <AlignedText>
        <DuoBold />
        <Text> - DuoBold </Text>
      </AlignedText>
      <AlignedText>
        <Eye size={ICON_SIZE} />
        <Text> - Eye </Text>
      </AlignedText>
      <AlignedText>
        <EyeSlash size={ICON_SIZE} />
        <Text> - EyeSlash </Text>
      </AlignedText>
      <AlignedText>
        <Logo size={ICON_SIZE} />
        <Text> - Logo </Text>
      </AlignedText>
      <AlignedText>
        <BicolorLogo size={ICON_SIZE} />
        <Text> - BicolorLogo </Text>
      </AlignedText>
      <AlignedText>
        <BicolorSearch size={ICON_SIZE} />
        <Text> - BicolorSearch </Text>
      </AlignedText>
      <AlignedText>
        <BicolorBookings size={ICON_SIZE} />
        <Text> - BicolorBookings </Text>
      </AlignedText>
      <AlignedText>
        <BicolorFavorite size={ICON_SIZE} />
        <Text> - BicolorFavorite </Text>
      </AlignedText>
      <AlignedText>
        <BicolorProfile size={ICON_SIZE} />
        <Text> - BicolorProfile </Text>
      </AlignedText>
      <AlignedText>
        <BicolorSelector width={ICON_SIZE} height={getSpacing(1)} />
        <Text> - BicolorSelector </Text>
      </AlignedText>
      <AlignedText>
        <UserCircle size={ICON_SIZE} />
        <Text> - UserCircle </Text>
      </AlignedText>
      <AlignedText>
        <Email size={ICON_SIZE} />
        <Text> - Email </Text>
      </AlignedText>
      <AlignedText>
        <EmailFilled size={ICON_SIZE} />
        <Text> - Email filled </Text>
      </AlignedText>
      <AlignedText>
        <PhoneFilled size={ICON_SIZE} />
        <Text> - Phone filled </Text>
      </AlignedText>
      <AlignedText>
        <ExternalSite size={ICON_SIZE} />
        <Text> - ExternalSite (new)</Text>
      </AlignedText>
      <AlignedText>
        <ExternalSiteDeprecated size={ICON_SIZE} />
        <Text> - ExternalSiteDeprecated </Text>
      </AlignedText>
      <AlignedText>
        <WarningDeprecated size={ICON_SIZE} />
        <Text> - WarningDeprecated </Text>
      </AlignedText>
      <AlignedText>
        <Warning size={ICON_SIZE} />
        <Text> - Warning (new) </Text>
      </AlignedText>
      <AlignedText>
        <Error size={ICON_SIZE} />
        <Text> - Error (new)</Text>
      </AlignedText>
      <AlignedText>
        <HappyFace size={ICON_SIZE} />
        <Text> - HappyFace </Text>
      </AlignedText>
      <AlignedText>
        <SadFace size={ICON_SIZE} />
        <Text> - SadFace </Text>
      </AlignedText>
      <AlignedText>
        <HappyFaceStars size={getSpacing(10)} />
        <Text> - HappyFaceStars </Text>
      </AlignedText>
      <AlignedText>
        <LocationPointer size={ICON_SIZE} />
        <Text> - LocationPointer </Text>
      </AlignedText>
      <AlignedText>
        <Digital size={ICON_SIZE} />
        <Text> - Digital </Text>
      </AlignedText>
      <AlignedText>
        <OrderPrice size={ICON_SIZE} />
        <Text> - OrderPrice </Text>
      </AlignedText>
      <AlignedText>
        <HandicapVisual size={ICON_SIZE} />
        <Text> - HandicapVisual </Text>
      </AlignedText>
      <AlignedText>
        <HandicapMental size={ICON_SIZE} />
        <Text> - HandicapMental </Text>
      </AlignedText>
      <AlignedText>
        <HandicapMotor size={ICON_SIZE} />
        <Text> - HandicapMotor </Text>
      </AlignedText>
      <AlignedText>
        <HandicapAudio size={ICON_SIZE} />
        <Text> - HandicapAudio </Text>
      </AlignedText>
      <AlignedText>
        <Validate size={ICON_SIZE} />
        <Text> - Validate </Text>
      </AlignedText>
      <AlignedText>
        <Invalidate size={ICON_SIZE} />
        <Text> - Invalidate </Text>
      </AlignedText>
      <AlignedText>
        <Favorite size={ICON_SIZE} />
        <Text> - Favourite </Text>
      </AlignedText>
      <AlignedText>
        <MagnifyingGlassDeprecated size={ICON_SIZE} />
        <Text> - MagnifyingGlassDeprecated </Text>
      </AlignedText>
      <AlignedText>
        <MagnifyingGlass size={ICON_SIZE} />
        <Text> - MagnifyingGlass (new) </Text>
      </AlignedText>
      <AlignedText>
        <InfoDeprecated size={ICON_SIZE} />
        <Text> - InfoDeprecated </Text>
      </AlignedText>
      <AlignedText>
        <Info size={ICON_SIZE} />
        <Text> - Info (new) </Text>
      </AlignedText>
      <AlignedText>
        <AroundMe size={ICON_SIZE} />
        <Text> - AroundMe </Text>
      </AlignedText>
      <AlignedText>
        <Everywhere size={ICON_SIZE} />
        <Text> - Everywhere </Text>
      </AlignedText>
      <AlignedText>
        <BicolorLocationPointer size={ICON_SIZE} />
        <Text> - BicolorLocationPointer </Text>
      </AlignedText>
      <AlignedText>
        <BicolorLocationBuilding size={ICON_SIZE} />
        <Text> - BicolorLocationBuilding </Text>
      </AlignedText>
      <AlignedText>
        <NoOffer size={ICON_SIZE} />
        <Text> - NoOffer </Text>
      </AlignedText>
      <AlignedText>
        <OfferDigital size={ICON_SIZE} />
        <Text> - OfferDigital </Text>
      </AlignedText>
      <AlignedText>
        <OfferPhysical size={ICON_SIZE} />
        <Text> - OfferPhysical </Text>
      </AlignedText>
      <AlignedText>
        <OfferOutings size={ICON_SIZE} />
        <Text> - OfferOutings </Text>
      </AlignedText>
      <AlignedText>
        <OfferOutingsPhysical size={ICON_SIZE} />
        <Text> - OfferOutingsPhysical </Text>
      </AlignedText>
      <AlignedText>
        <LegalNotices size={ICON_SIZE} />
        <Text> - LegalNotices (new) </Text>
      </AlignedText>
      <AlignedText>
        <Confidentiality size={ICON_SIZE} />
        <Text> - Confidentiality (new) </Text>
      </AlignedText>
      <AlignedText>
        <BicolorConfidentiality size={ICON_SIZE} />
        <Text> - BicolorConfidentiality </Text>
      </AlignedText>
      <AlignedText>
        <SignOut size={ICON_SIZE} />
        <Text> - SignOut </Text>
      </AlignedText>
      <AlignedText>
        <Lock size={ICON_SIZE} />
        <Text> - Lock </Text>
      </AlignedText>
      <AlignedText>
        <BicolorLock size={ICON_SIZE} />
        <Text> - BicolorLock </Text>
      </AlignedText>
      <AlignedText>
        <ProfileDeprecated size={ICON_SIZE} />
        <Text> - ProfileDeprecated </Text>
      </AlignedText>
      <AlignedText>
        <DuoPerson size={ICON_SIZE} />
        <Text> - DuoPerson </Text>
      </AlignedText>
      <AlignedText>
        <LifeBuoy size={ICON_SIZE} />
        <Text> - LifeBuoy (new) </Text>
      </AlignedText>
      <AlignedText>
        <Bell size={ICON_SIZE} />
        <Text> - Bell (new) </Text>
      </AlignedText>
      <AlignedText>
        <ProfileDeletion size={ICON_SIZE} />
        <Text> - ProfileDeletion </Text>
      </AlignedText>
      <AlignedText>
        <Booking size={ICON_SIZE} />
        <Text> - Booking </Text>
      </AlignedText>
      <AlignedText>
        <Calendar size={ICON_SIZE} />
        <Text> - Calendar (new) </Text>
      </AlignedText>
      <AlignedText>
        <CalendarDeprecated size={ICON_SIZE} />
        <Text> - CalendarDeprecated </Text>
      </AlignedText>
      <AlignedText>
        <LocationBuilding size={ICON_SIZE} />
        <Text> - LocationBuilding (new) </Text>
      </AlignedText>
      <AlignedText>
        <LocationBuildingDeprecated size={ICON_SIZE} />
        <Text> - LocationBuildingDeprecated </Text>
      </AlignedText>
      <AlignedText>
        <TicketBooked width={ICON_SIZE} height={ICON_SIZE} />
        <Text> - TicketBooked </Text>
      </AlignedText>
      <AlignedText>
        <LocationPointerNotFilled size={ICON_SIZE} />
        <Text> - LocationPointerNotFilled (new) </Text>
      </AlignedText>
      <AlignedText>
        <MaintenanceCone width={ICON_SIZE * 2} height={ICON_SIZE} color={ColorsEnum.BLACK} />
        <Text> - MaintenanceCone </Text>
      </AlignedText>
      <AlignedText>
        <LogoPassCulture width={ICON_SIZE * 2} height={ICON_SIZE} color={ColorsEnum.BLACK} />
        <Text> - LogoPassCulture </Text>
      </AlignedText>
      <AlignedText>
        <RequestSent size={ICON_SIZE} />
        <Text> - RequestSent </Text>
      </AlignedText>
      <AlignedText>
        <Flag size={ICON_SIZE} />
        <Text> - Flag </Text>
      </AlignedText>
      <AlignedText>
        <EditPen size={ICON_SIZE} />
        <Text> - EditPen (new) </Text>
      </AlignedText>
    </React.Fragment>
  )
}

interface IconProps {
  name: string
  component: React.ComponentType<any>
  isNew?: boolean
}

const Icon = ({ name, component: IconComponent, isNew = false }: IconProps) => (
  <AlignedText color={isNew ? ColorsEnum.BLACK : ColorsEnum.GREY_DISABLED}>
    <IconComponent size={ICON_SIZE} />
    <Text>
      {' '}
      - {name}
      {isNew ? '(new)' : ''}
    </Text>
  </AlignedText>
)

const AlignedText = styled(View)<{ color?: ColorsEnum }>(({ color = ColorsEnum.BLACK }) => ({
  color,
  flexDirection: 'row',
  alignItems: 'center',
}))

const CategoryIcons = () => {
  const searchGroupLabelMapping = useSearchGroupLabelMapping()
  return (
    <React.Fragment>
      <Text>{'Categories'}</Text>
      {Object.entries(CATEGORY_CRITERIA).map(([searchGroup, { icon: BicolorIcon }]) => (
        <AlignedText key={searchGroup}>
          <BicolorIcon size={ICON_SIZE} color={ColorsEnum.PRIMARY} color2={ColorsEnum.PRIMARY} />
          <BicolorIcon size={ICON_SIZE} color={ColorsEnum.PRIMARY} color2={ColorsEnum.SECONDARY} />
          <Text> - {searchGroupLabelMapping[searchGroup as SearchGroupNameEnum]} </Text>
        </AlignedText>
      ))}
      <Text>{'\n'}</Text>
    </React.Fragment>
  )
}

const VenueTypesIcons = () => {
  return (
    <React.Fragment>
      <Text>{'Venue Types'}</Text>
      {Object.values(VenueTypeCodeKey).map((venueType) => {
        const Icon = mapVenueTypeToIcon(venueType as VenueTypeCodeKey)
        return (
          <AlignedText key={venueType}>
            <Icon size={ICON_SIZE} color={ColorsEnum.PRIMARY} />
            <Text> - {venueType} </Text>
          </AlignedText>
        )
      })}
      <Text>{'\n'}</Text>
    </React.Fragment>
  )
}

const IdentityCheckIcons = () => {
  return (
    <React.Fragment>
      <Text>{'IdentityCheck Icons'}</Text>
      <AlignedText>
        <Profile size={ICON_SIZE} color={ColorsEnum.PRIMARY} />
        <Text> - Profile (new) </Text>
      </AlignedText>
      <AlignedText>
        <IdCard size={ICON_SIZE} color={ColorsEnum.PRIMARY} />
        <Text> - IdCard (new) </Text>
      </AlignedText>
      <AlignedText>
        <Confirmation size={ICON_SIZE} color={ColorsEnum.PRIMARY} />
        <Text> - Confirmation (new) </Text>
      </AlignedText>
      <Text>{'\n'}</Text>
    </React.Fragment>
  )
}

const SocialNetworkIcons = () => {
  return (
    <React.Fragment>
      <Text>{'Social network'}</Text>
      <Spacer.Column numberOfSpaces={2} />
      {Object.keys(SocialNetworkIconsMap).map((network: string | null) => {
        const net = network as SocialNetwork
        return (
          <AlignedText key={network}>
            <SocialNetworkCard network={net} />
            <Text> - {network} </Text>
          </AlignedText>
        )
      })}
    </React.Fragment>
  )
}
