/* eslint-disable react-native/no-raw-text */
import React, { FunctionComponent } from 'react'
import { View, Text } from 'react-native'
import styled from 'styled-components/native'

import { SearchGroupNameEnum, VenueTypeCodeKey } from 'api/gen/api'
import { IconsContainer } from 'features/cheatcodes/pages/AppComponents/IconsContainer'
import {
  SecondaryAndBiggerIcons,
  SocialNetworkIcons,
  TertiaryAndSmallerIcons,
  UnconventionalIcons,
} from 'features/cheatcodes/pages/AppComponents/iconsExports'
import { CATEGORY_CRITERIA } from 'features/search/enums'
import { mapVenueTypeToIcon, VenueTypeCode } from 'libs/parsers'
import { useSearchGroupLabelMapping } from 'libs/subcategories/mappings'
import { Spacer } from 'ui/theme'
import { SMALLER_ICON_SIZE, STANDARD_ICON_SIZE } from 'ui/theme/constants'

export const Icons: FunctionComponent = () => {
  return (
    <React.Fragment>
      <SocialNetwork />
      <Spacer.Column numberOfSpaces={4} />
      <Category />
      <Spacer.Column numberOfSpaces={4} />
      <VenueTypes />
      <Spacer.Column numberOfSpaces={4} />
      <SecondaryAndBigger />
      <Spacer.Column numberOfSpaces={4} />
      <TertiaryAndSmaller />
      <Spacer.Column numberOfSpaces={4} />
      <Unconventional />
    </React.Fragment>
  )
}

const AlignedText = styled(View)({
  flexDirection: 'row',
  alignItems: 'center',
})

const SocialNetwork = () => {
  return <IconsContainer icons={SocialNetworkIcons} title="Social network" />
}

// TODO(PC-14164): use BicolorIconsContainer
const Category = () => {
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

// TODO(PC-14164): use IconsContainer
const VenueTypes = () => {
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

const TertiaryAndSmaller = () => {
  return (
    <IconsContainer
      title={`Tertiary and smaller plain Icons ( <= 20x20 ) should have a standard size of ${SMALLER_ICON_SIZE}`}
      icons={TertiaryAndSmallerIcons}
    />
  )
}

const SecondaryAndBigger = () => {
  return (
    <IconsContainer
      title={`Secondary and bigger Icons ( > 20x20 ) should have a standard size of ${STANDARD_ICON_SIZE}`}
      icons={SecondaryAndBiggerIcons}
    />
  )
}

const Unconventional = () => {
  return (
    <IconsContainer
      title="Icônes à uniformiser (conversion en illustrations)"
      icons={UnconventionalIcons}
    />
  )
}
