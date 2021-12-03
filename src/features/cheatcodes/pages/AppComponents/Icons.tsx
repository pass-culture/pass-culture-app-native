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
import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { ExternalSiteDeprecated } from 'ui/svg/icons/ExternalSite_deprecated'
import { Eye } from 'ui/svg/icons/Eye'
import { EyeSlash } from 'ui/svg/icons/EyeSlash'
import { Favorite } from 'ui/svg/icons/Favorite'
import { Flag } from 'ui/svg/icons/Flag'
import { Flash } from 'ui/svg/icons/Flash'
import { HandicapAudio } from 'ui/svg/icons/HandicapAudio'
import { HandicapMental } from 'ui/svg/icons/HandicapMental'
import { HandicapMotor } from 'ui/svg/icons/HandicapMotor'
import { HandicapVisual } from 'ui/svg/icons/HandicapVisual'
import { HappyFace } from 'ui/svg/icons/HappyFace'
import { HappyFaceStars } from 'ui/svg/icons/HappyFaceStars'
import { IdCard } from 'ui/svg/icons/IdCard'
import { Info } from 'ui/svg/icons/Info'
import { InfoDeprecated } from 'ui/svg/icons/Info_deprecated'
import { InfoFraud } from 'ui/svg/icons/InfoFraud'
import { InfoPlain } from 'ui/svg/icons/InfoPlain'
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
import { Quote } from 'ui/svg/icons/Quote'
import { RequestSent } from 'ui/svg/icons/RequestSent'
import { SadFace } from 'ui/svg/icons/SadFace'
import { SignOut } from 'ui/svg/icons/SignOut'
import { Sun } from 'ui/svg/icons/Sun'
import { TicketBooked } from 'ui/svg/icons/TicketBooked'
import { IconInterface } from 'ui/svg/icons/types'
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
      <Icon name="Again" component={Again} isNew />
      <Icon name="ArrowPrevious" component={ArrowPrevious} />
      <Icon name="ArrowNext" component={ArrowNext} />
      <Icon name="Check" component={Check} />
      <Icon name="Clock" component={Clock} isNew />
      <Icon name="Close" component={Close} />
      <Icon name="Duo" component={Duo} />
      <Icon name="DuoBold" component={DuoBold} />
      <Icon name="Eye" component={Eye} />
      <Icon name="EyeSlash" component={EyeSlash} />
      <Icon name="Logo" component={Logo} />
      <Icon name="BicolorLogo" component={BicolorLogo} />
      <Icon name="BicolorSearch" component={BicolorSearch} />
      <Icon name="BicolorBookings" component={BicolorBookings} />
      <Icon name="BicolorFavorite" component={BicolorFavorite} />
      <Icon name="BicolorProfile" component={BicolorProfile} />
      <AlignedText>
        <BicolorSelector width={ICON_SIZE} height={getSpacing(1)} />
        <Text> - BicolorSelector </Text>
      </AlignedText>
      <Icon name="UserCircle" component={UserCircle} />
      <Icon name="Email" component={Email} />
      <Icon name="EmailFilled" component={EmailFilled} />
      <Icon name="PhoneFilled" component={PhoneFilled} />
      <Icon name="ExternalSite" component={ExternalSite} isNew />
      <Icon name="ExternalSiteDeprecated" component={ExternalSiteDeprecated} />
      <Icon name="WarningDeprecated" component={WarningDeprecated} />
      <Icon name="Warning" component={Warning} isNew />
      <Icon name="Error" component={Error} isNew />
      <Icon name="HappyFace" component={HappyFace} />
      <Icon name="SadFace" component={SadFace} />
      <Icon name="HappyFaceStars" component={HappyFaceStars} />
      <Icon name="LocationPointer" component={LocationPointer} />
      <Icon name="Digital" component={Digital} />
      <Icon name="OrderPrice" component={OrderPrice} />
      <Icon name="HandicapVisual" component={HandicapVisual} />
      <Icon name="HandicapMental" component={HandicapMental} />
      <Icon name="HandicapMotor" component={HandicapMotor} />
      <Icon name="HandicapAudio" component={HandicapAudio} />
      <Icon name="Validate" component={Validate} />
      <Icon name="Invalidate" component={Invalidate} />
      <Icon name="Favorite" component={Favorite} />
      <Icon name="MagnifyingGlassDeprecated" component={MagnifyingGlassDeprecated} />
      <Icon name="MagnifyingGlass" component={MagnifyingGlass} isNew />
      <Icon name="InfoDeprecated" component={InfoDeprecated} />
      <Icon name="Info" component={Info} isNew />
      <Icon name="InfoPlain" component={InfoPlain} isNew />
      <Icon name="BicolorAroundMe" component={BicolorAroundMe} isNew />
      <Icon name="BicolorEverywhere" component={BicolorEverywhere} isNew />
      <Icon name="BicolorLocationPointer" component={BicolorLocationPointer} isNew />
      <Icon name="BicolorLocationBuilding" component={BicolorLocationBuilding} isNew />
      <Icon name="NoOffer" component={NoOffer} />
      <Icon name="OfferDigital" component={OfferDigital} />
      <Icon name="OfferPhysical" component={OfferPhysical} />
      <Icon name="OfferOutings" component={OfferOutings} />
      <Icon name="OfferOutingsPhysical" component={OfferOutingsPhysical} />
      <Icon name="LegalNotices" component={LegalNotices} isNew />
      <Icon name="Confidentiality" component={Confidentiality} isNew />
      <Icon name="BicolorConfidentiality" component={BicolorConfidentiality} />
      <Icon name="SignOut" component={SignOut} />
      <Icon name="Lock" component={Lock} isNew />
      <Icon name="BicolorLock" component={BicolorLock} />
      <Icon name="ProfileDeprecated" component={ProfileDeprecated} />
      <Icon name="DuoPerson" component={DuoPerson} />
      <Icon name="LifeBuoy" component={LifeBuoy} isNew />
      <Icon name="Bell" component={Bell} isNew />
      <Icon name="ProfileDeletion" component={ProfileDeletion} />
      <Icon name="Booking" component={Booking} />
      <Icon name="Calendar" component={Calendar} isNew />
      <Icon name="CalendarDeprecated" component={CalendarDeprecated} />
      <Icon name="LocationBuilding" component={LocationBuilding} isNew />
      <Icon name="LocationBuildingDeprecated" component={LocationBuildingDeprecated} />
      <Icon name="InfoFraud" component={InfoFraud} isNew />
      <AlignedText>
        <TicketBooked width={ICON_SIZE} height={ICON_SIZE} />
        <Text> - TicketBooked </Text>
      </AlignedText>
      <Icon name="LocationPointerNotFilled" component={LocationPointerNotFilled} isNew />
      <AlignedText>
        <MaintenanceCone width={ICON_SIZE * 2} height={ICON_SIZE} color={ColorsEnum.BLACK} />
        <Text> - MaintenanceCone </Text>
      </AlignedText>
      <AlignedText>
        <LogoPassCulture width={ICON_SIZE * 2} height={ICON_SIZE} color={ColorsEnum.BLACK} />
        <Text> - LogoPassCulture </Text>
      </AlignedText>
      <Icon name="RequestSent" component={RequestSent} />
      <Icon name="Flag" component={Flag} />
      <Icon name="EditPen" component={EditPen} isNew />
      <Icon name="Flash" component={Flash} isNew />
      <Icon name="Sun" component={Sun} isNew />
      <Icon name="Quote" component={Quote} isNew />
    </React.Fragment>
  )
}

interface IconProps {
  name: string
  component: React.ComponentType<IconInterface>
  isNew?: boolean
}

const Icon = ({ name, component: IconComponent, isNew = false }: IconProps) => (
  <AlignedText>
    <IconComponent size={ICON_SIZE} />
    <Text style={{ color: isNew ? ColorsEnum.BLACK : ColorsEnum.GREY_DARK }}>
      {` - ${name} ${isNew ? '(new)' : ''}`}
    </Text>
  </AlignedText>
)

const AlignedText = styled(View)({
  flexDirection: 'row',
  alignItems: 'center',
})

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
      <Icon name="Profile" component={Profile} isNew />
      <Icon name="IdCard" component={IdCard} isNew />
      <Icon name="Confirmation" component={Confirmation} isNew />
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
