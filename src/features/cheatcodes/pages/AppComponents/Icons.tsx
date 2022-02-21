/* eslint-disable react-native/no-raw-text */
import React, { FunctionComponent } from 'react'
import { View, Text } from 'react-native'
import styled from 'styled-components/native'

import { SearchGroupNameEnum, VenueTypeCodeKey } from 'api/gen/api'
import { CATEGORY_CRITERIA } from 'features/search/enums'
import { mapVenueTypeToIcon, VenueTypeCode } from 'libs/parsers'
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
import { Check } from 'ui/svg/icons/Check'
import { Clock } from 'ui/svg/icons/Clock'
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
import { LogoPassCulture } from 'ui/svg/icons/LogoPassCulture'
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
import { Telegram } from 'ui/svg/icons/socialNetwork/Telegram'
import { WhatsApp } from 'ui/svg/icons/socialNetwork/WhatsApp'
import { Sun } from 'ui/svg/icons/Sun'
import { IconInterface } from 'ui/svg/icons/types'
import { Validate } from 'ui/svg/icons/Validate'
import { Warning } from 'ui/svg/icons/Warning'
import { getSpacing, Spacer } from 'ui/theme'
import { STANDARD_ICON_SIZE } from 'ui/theme/constants'

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
      <SecondaryAndBiggerIcons />
      <Spacer.Column numberOfSpaces={4} />
      <TertiaryAndSmallerIcons />
      <Spacer.Column numberOfSpaces={4} />
      <Text> Icônes à uniformiser (conversion en illustrations) </Text>
      <AlignedText>
        <StyledLogoPassCulture />
        <Text> - LogoPassCulture </Text>
      </AlignedText>
    </React.Fragment>
  )
}

const StyledLogoPassCulture = styled(LogoPassCulture).attrs(({ theme }) => ({
  width: theme.icons.sizes.standard * 2,
  height: theme.icons.sizes.standard,
  color: theme.colors.black,
}))``

interface IconProps {
  name: string
  component: React.ComponentType<IconInterface>
  isNew?: boolean
}

const Icon = ({ name, component: IconComponent, isNew = false }: IconProps) => {
  const StyledIcon = !isNew
    ? styled(IconComponent).attrs(({ theme }) => ({
        size: theme.icons.sizes.standard,
      }))``
    : IconComponent
  return (
    <AlignedText>
      <StyledIcon />
      <StyledText isNew={isNew}>{` - ${name} ${isNew ? '' : '(deprecated)'}`}</StyledText>
    </AlignedText>
  )
}

const AlignedText = styled(View)({
  flexDirection: 'row',
  alignItems: 'center',
})

const StyledText = styled(Text)<{ isNew: boolean }>(({ theme, isNew }) => ({
  color: isNew ? theme.colors.black : theme.colors.greyDark,
}))

const CategoryIcons = () => {
  const searchGroupLabelMapping = useSearchGroupLabelMapping()
  return (
    <React.Fragment>
      <Text>{'Categories'}</Text>
      {Object.entries(CATEGORY_CRITERIA).map(([searchGroup, { icon: BicolorIcon }]) => {
        const StyledBicolorIcon1 = styled(BicolorIcon).attrs(({ theme }) => ({
          color: theme.colors.primary,
          color2: theme.colors.primary,
          size: theme.icons.sizes.standard,
        }))``

        const StyledBicolorIcon2 = styled(StyledBicolorIcon1).attrs(({ theme }) => ({
          color2: theme.colors.secondary,
        }))``
        return (
          <AlignedText key={searchGroup}>
            <StyledBicolorIcon1 />
            <StyledBicolorIcon2 />
            <Text> - {searchGroupLabelMapping[searchGroup as SearchGroupNameEnum]} </Text>
          </AlignedText>
        )
      })}
      <Text>{'\n'}</Text>
    </React.Fragment>
  )
}

const VenueTypesIcons = () => {
  return (
    <React.Fragment>
      <Text>{'Venue Types'}</Text>
      {Object.values(VenueTypeCodeKey).map((venueType) => {
        if (venueType === VenueTypeCodeKey.ADMINISTRATIVE) return
        const VenueTypeIcon = mapVenueTypeToIcon(venueType as VenueTypeCode)
        const StyledIcon = styled(VenueTypeIcon).attrs(({ theme }) => ({
          color: theme.colors.primary,
          size: theme.icons.sizes.standard,
        }))``
        return (
          <AlignedText key={venueType}>
            <StyledIcon />
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

const TertiaryAndSmallerIcons = () => {
  return (
    <React.Fragment>
      <Text>
        {'Tertiary and smaller plain Icons ( <= 20x20 ) should have a standard size of 20'}
      </Text>
      <Icon name="Again" component={Again} isNew />
      <Icon name="Digital" component={Digital} isNew />
      <Icon name="Duplicate" component={Duplicate} isNew />
      <Icon name="EditPen" component={EditPen} isNew />
      <Icon name="EmailFilled" component={EmailFilled} isNew />
      <Icon name="ExternalSiteFilled" component={ExternalSiteFilled} isNew />
      <Icon name="Flag" component={Flag} isNew />
      <Icon name="InfoPlain" component={InfoPlain} isNew />
      <Icon name="Invalidate" component={Invalidate} isNew />
      <Icon name="Key" component={Key} isNew />
      <Icon name="LocationPointer" component={LocationPointer} isNew />
      <Icon name="PhoneFilled" component={PhoneFilled} isNew />
      <Icon name="PlainArrowPrevious" component={PlainArrowPrevious} isNew />
      <Icon name="Plus" component={Plus} isNew />
      <Icon name="SMSFilled" component={SMSFilled} isNew />
      <Icon name="Validate" component={Validate} isNew />
      <Text>{'\n'}</Text>
    </React.Fragment>
  )
}

const SecondaryAndBiggerIcons = () => {
  return (
    <React.Fragment>
      <Text>{'Secondary and bigger Icons ( > 20x20 ) should have a standard size of 32'}</Text>
      <Icon name="BicolorAroundMe" component={BicolorAroundMe} isNew />
      <Icon name="BicolorBookings" component={BicolorBookings} isNew />
      <Icon name="BicolorConfidentiality" component={BicolorConfidentiality} isNew />
      <Icon name="BicolorEverywhere" component={BicolorEverywhere} isNew />
      <Icon name="BicolorFavorite" component={BicolorFavorite} isNew />
      <Icon name="BicolorLock" component={BicolorLock} isNew />
      <Icon name="BicolorLocationPointer" component={BicolorLocationPointer} isNew />
      <Icon name="BicolorLocationBuilding" component={BicolorLocationBuilding} isNew />
      <Icon name="BicolorLogo" component={BicolorLogo} isNew />
      <Icon name="BicolorProfile" component={BicolorProfile} isNew />
      <Icon name="BicolorSearch" component={BicolorSearch} isNew />
      <AlignedText>
        <BicolorSelector width={STANDARD_ICON_SIZE} height={getSpacing(1)} />
        <Text> - BicolorSelector </Text>
      </AlignedText>
      <Icon name="ArrowNext" component={ArrowNext} isNew />
      <Icon name="ArrowPrevious" component={ArrowPrevious} isNew />
      <Icon name="Bell" component={Bell} isNew />
      <Icon name="Booking" component={Booking} isNew />
      <Icon name="Calendar" component={Calendar} isNew />
      <Icon name="Check" component={Check} isNew />
      <Icon name="Clock" component={Clock} isNew />
      <Icon name="Close" component={Close} isNew />
      <Icon name="Confidentiality" component={Confidentiality} isNew />
      <Icon name="Duo" component={Duo} isNew />
      <Icon name="Email" component={Email} isNew />
      <Icon name="Error" component={Error} isNew />
      <Icon name="ExternalSite" component={ExternalSite} isNew />
      <Icon name="Eye" component={Eye} isNew />
      <Icon name="EyeSlash" component={EyeSlash} isNew />
      <Icon name="Favorite" component={Favorite} isNew />
      <Icon name="FavoriteFilled" component={FavoriteFilled} isNew />
      <Icon name="Flash" component={Flash} isNew />
      <Icon name="HandicapVisual" component={HandicapVisual} isNew />
      <Icon name="HandicapMental" component={HandicapMental} isNew />
      <Icon name="HandicapMotor" component={HandicapMotor} isNew />
      <Icon name="HandicapAudio" component={HandicapAudio} isNew />
      <Icon name="Idea" component={Idea} isNew />
      <Icon name="Info" component={Info} isNew />
      <Icon name="LegalNotices" component={LegalNotices} isNew />
      <Icon name="LifeBuoy" component={LifeBuoy} isNew />
      <Icon name="LocationBuilding" component={LocationBuilding} isNew />
      <Icon name="LocationPointerNotFilled" component={LocationPointerNotFilled} isNew />
      <Icon name="Lock" component={Lock} isNew />
      <Icon name="Logo" component={Logo} />
      <Icon name="MagnifyingGlass" component={MagnifyingGlass} isNew />
      <Icon name="OfferDigital" component={OfferDigital} isNew />
      <Icon name="OfferEvent" component={OfferEvent} isNew />
      <Icon name="OfferPhysical" component={OfferPhysical} isNew />
      <Icon name="Offers" component={Offers} isNew />
      <Icon name="OrderPrice" component={OrderPrice} isNew />
      <Icon name="ProfileDeletion" component={ProfileDeletion} isNew />
      <Icon name="Quote" component={Quote} isNew />
      <Icon name="SignOut" component={SignOut} isNew />
      <Icon name="Share" component={Share} isNew />
      <Icon name="Sun" component={Sun} isNew />
      <Icon name="Warning" component={Warning} isNew />
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
      <Icon name="WhatsApp" component={WhatsApp} isNew />
      <Icon name="Telegram" component={Telegram} isNew />
    </React.Fragment>
  )
}
