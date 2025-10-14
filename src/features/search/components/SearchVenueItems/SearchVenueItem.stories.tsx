import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { VenueTypeCodeKey } from 'api/gen'
import { AlgoliaVenue } from 'libs/algolia/types'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { LENGTH_XS, LENGTH_XXS } from 'ui/theme'

import { SearchVenueItem } from './SearchVenueItem'

const meta: Meta<typeof SearchVenueItem> = {
  title: 'features/search/SearchVenueItem',
  component: SearchVenueItem,
}
export default meta

const venue: AlgoliaVenue = {
  objectID: '5543',
  name: 'UGC cinéma',
  city: 'Paris',
  postalCode: '75000',
  offerer_name: 'séance de cinéma chandra',
  venue_type: VenueTypeCodeKey.MOVIE,
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
  isPermanent: true,
  isOpenToPublic: true,
  banner_url:
    'https://www.gamewallpapers.com/wallpapers_slechte_compressie/wallpaper_magic_the_gathering_arena_01_1920x1080.jpg',
  _geoloc: {
    lat: 48.87004,
    lng: 2.3785,
  },
}

const ITEM_HEIGHT = LENGTH_XXS
const ITEM_WIDTH = LENGTH_XS

const baseProps = { width: ITEM_WIDTH, height: ITEM_HEIGHT }

const variantConfig: Variants<typeof SearchVenueItem> = [
  {
    label: 'SearchVenueItem',
    props: {
      ...baseProps,
      venue,
    },
  },
  {
    label: 'SearchVenueItem without image',
    props: {
      ...baseProps,
      venue: {
        ...venue,
        banner_url: null,
      },
    },
  },
]

export const Template: VariantsStory<typeof SearchVenueItem> = {
  name: 'SearchVenueItem',
  render: (props) => (
    <VariantsTemplate
      variants={variantConfig}
      Component={SearchVenueItem}
      defaultProps={{ ...props }}
    />
  ),
}
