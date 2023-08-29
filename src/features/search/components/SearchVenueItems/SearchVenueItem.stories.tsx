import { NavigationContainer } from '@react-navigation/native'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { LENGTH_XS, LENGTH_XXS } from 'ui/theme'

import { SearchVenueItem } from './SearchVenueItem'

const meta: ComponentMeta<typeof SearchVenueItem> = {
  title: 'features/search/SearchVenueItem',
  component: SearchVenueItem,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
}
export default meta

const venue = {
  objectID: '5543',
  name: 'UGC cinéma',
  city: 'Paris',
  postalCode: '75000',
  offerer_name: 'séance de cinéma chandra',
  venue_type: 'MOVIE',
  description: 'film',
  audio_disability: null,
  mental_disability: null,
  motor_disability: null,
  visual_disability: null,
  email: null,
  phone_number: null,
  website: null,
  facebook: null,
  twitter: null,
  instagram: null,
  snapchat: null,
  banner_url:
    'https://www.gamewallpapers.com/wallpapers_slechte_compressie/wallpaper_magic_the_gathering_arena_01_1920x1080.jpg',
  _geoloc: {
    lat: 48.87004,
    lng: 2.3785,
  },
}

const ITEM_HEIGHT = LENGTH_XXS
const ITEM_WIDTH = LENGTH_XS

const Template: ComponentStory<typeof SearchVenueItem> = (props) => <SearchVenueItem {...props} />

export const Default = Template.bind({})
Default.args = {
  venue: venue,
  width: ITEM_WIDTH,
  height: ITEM_HEIGHT,
}

export const WithoutImage = Template.bind({})
WithoutImage.args = {
  venue: {
    ...venue,
    banner_url: null,
  },
  width: ITEM_WIDTH,
  height: ITEM_HEIGHT,
}
