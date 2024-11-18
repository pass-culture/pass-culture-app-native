import { NavigationContainer } from '@react-navigation/native'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { VariantsTemplate } from 'ui/storybook/VariantsTemplate'

import { VenueMapPreview } from './VenueMapPreview'

const meta: ComponentMeta<typeof VenueMapPreview> = {
  title: 'features/search/VenueMapPreview',
  component: VenueMapPreview,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
}
export default meta

const variantConfig = [
  {
    label: 'VenueMapPreview',
    props: {
      venueName: 'Cinéma La Chapelle',
      address: '4 rue de la Chapelle, 75018 Paris',
      bannerUrl:
        'https://www.gamewallpapers.com/wallpapers_slechte_compressie/wallpaper_magic_the_gathering_arena_01_1920x1080.jpg',
      tags: ['à 500m', 'Cinéma'],
    },
  },
]

const Template: ComponentStory<typeof VariantsTemplate> = () => (
  <VariantsTemplate variants={variantConfig} Component={VenueMapPreview} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'VenueMapPreview'
