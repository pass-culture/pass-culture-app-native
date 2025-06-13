import type { Meta } from '@storybook/react'
import React from 'react'

import { theme } from 'theme'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { Bag } from 'ui/svg/icons/venueAndCategories/Bag'

import { VenueTypeLocationIcon } from './VenueTypeLocationIcon'

const meta: Meta<typeof VenueTypeLocationIcon> = {
  title: 'Features/home/VenueTypeLocationIcon',
  component: VenueTypeLocationIcon,
}
export default meta

const variantConfig: Variants<typeof VenueTypeLocationIcon> = [
  {
    label: 'VenueTypeLocationIcon with color',
    props: {
      VenueTypeIcon: Bag,
      iconColor: theme.colors.greySemiDark,
      backgroundColor: theme.colors.greyLight,
    },
  },
  {
    label: 'VenueTypeLocationIcon without color',
    props: {
      VenueTypeIcon: Bag,
    },
  },
]

export const Template: VariantsStory<typeof VenueTypeLocationIcon> = {
  name: 'VenueTypeLocationIcon',
  render: (props) => (
    <VariantsTemplate
      variants={variantConfig}
      Component={VenueTypeLocationIcon}
      defaultProps={props}
    />
  ),
}
