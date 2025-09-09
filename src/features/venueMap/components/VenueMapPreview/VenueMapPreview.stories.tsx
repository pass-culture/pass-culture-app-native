import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

import { VenueMapPreview } from './VenueMapPreview'

const meta: Meta<typeof VenueMapPreview> = {
  title: 'features/venueMap/VenueMapPreview',
  component: VenueMapPreview,
}
export default meta

const variantConfig: Variants<typeof VenueMapPreview> = [
  {
    label: 'VenueMapPreview',
    props: {
      venueName: 'Cinéma La Chapelle',
      address: '4 rue de la Chapelle, 75018 Paris',
      bannerUrl:
        'https://www.gamewallpapers.com/wallpapers_slechte_compressie/wallpaper_magic_the_gathering_arena_01_1920x1080.jpg',
      tags: ['à 500m', 'Cinéma'],
      navigateTo: { screen: 'Login' },
    },
  },
]

export const Template: VariantsStory<typeof VenueMapPreview> = {
  name: 'VenueMapPreview',
  render: (props) => (
    <VariantsTemplate variants={variantConfig} Component={VenueMapPreview} defaultProps={props} />
  ),
}
