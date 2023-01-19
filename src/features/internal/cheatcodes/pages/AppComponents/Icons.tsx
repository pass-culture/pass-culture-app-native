import React, { FunctionComponent } from 'react'

import { IconsContainer } from 'features/internal/cheatcodes/pages/AppComponents/IconsContainer'
import {
  SecondaryAndBiggerIcons,
  SocialNetworkIcons,
  TertiaryAndSmallerIcons,
  UnconventionalIcons,
} from 'features/internal/cheatcodes/pages/AppComponents/iconsExports'
import { categoriesIcons } from 'ui/svg/icons/bicolor/exports/categoriesIcons'
import { culturalSurveyIcons } from 'ui/svg/icons/bicolor/exports/culturalSurveyIcons'
import { venueTypesIcons } from 'ui/svg/icons/bicolor/exports/venueTypesIcons'
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
      <CulturalSurvey />
      <Spacer.Column numberOfSpaces={4} />
      <SecondaryAndBigger />
      <Spacer.Column numberOfSpaces={4} />
      <TertiaryAndSmaller />
      <Spacer.Column numberOfSpaces={4} />
      <Unconventional />
    </React.Fragment>
  )
}

const SocialNetwork = () => {
  return <IconsContainer icons={SocialNetworkIcons} title="Social network" />
}

const Category = () => {
  return <IconsContainer isBicolor title="Categories" icons={categoriesIcons} />
}

const VenueTypes = () => {
  return <IconsContainer isBicolor title="VenueTypes" icons={venueTypesIcons} />
}

const CulturalSurvey = () => {
  return <IconsContainer isBicolor title="Cultural survey" icons={culturalSurveyIcons} />
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
