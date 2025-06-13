import { StoryFn } from '@storybook/react'
import React from 'react'

import {
  SecondaryAndBiggerIcons,
  SocialNetworkIcons,
  TertiaryAndSmallerIcons,
  UnconventionalIcons,
} from 'ui/storybook/iconsExports'
import { SVGTemplate as Icons } from 'ui/storybook/SVGTemplate'
import { categoriesIcons } from 'ui/svg/icons/exports/categoriesIcons'
import { culturalSurveyIcons } from 'ui/svg/icons/exports/culturalSurveyIcons'
import { venueTypesIcons } from 'ui/svg/icons/exports/venueTypesIcons'
import { SMALLER_ICON_SIZE, STANDARD_ICON_SIZE } from 'ui/theme/constants'

export default {
  title: 'Fondations/Icons',
}

const iconSets = [
  {
    title: 'SocialNetworkIcons',
    icons: SocialNetworkIcons,
  },
  {
    title: 'categoriesIcons',
    icons: categoriesIcons,
    isBicolor: true,
  },
  {
    title: 'venueTypesIcons',
    icons: venueTypesIcons,
    isBicolor: true,
  },
  {
    title: 'culturalSurveyIcons',
    icons: culturalSurveyIcons,
    isBicolor: true,
  },
  {
    title: `SecondaryAndBiggerIcons ( > 20x20 ) should have a standard size of ${STANDARD_ICON_SIZE}`,
    icons: SecondaryAndBiggerIcons,
  },
  {
    title: `TertiaryAndSmallerIcons ( <= 20x20 ) should have a standard size of ${SMALLER_ICON_SIZE}`,
    icons: TertiaryAndSmallerIcons,
  },
  {
    title: 'UnconventionalIcons (to be standardized)',
    icons: UnconventionalIcons,
  },
]

const Template: StoryFn<typeof Icons> = () => (
  <React.Fragment>
    {iconSets.map((icon) => (
      <Icons key={icon.title} title={icon.title} icons={icon.icons} isBicolor={icon.isBicolor} />
    ))}
  </React.Fragment>
)

export const AllIcons = {
  name: 'Icons',
  render: Template,
}
