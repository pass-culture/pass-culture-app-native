import { Meta } from '@storybook/react-vite'
import React from 'react'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

import { HorizontalArtistTile } from './HorizontalArtistTile'

const meta: Meta<typeof HorizontalArtistTile> = {
  title: 'ui/tiles/HorizontalArtistTile',
  component: HorizontalArtistTile,
}
export default meta

const variantConfig: Variants<typeof HorizontalArtistTile> = [
  {
    label: 'With artist image',
    props: {
      artist: {
        id: '1',
        name: 'Artist 1',
        image:
          'https://cdn.phototourl.com/free/2026-03-24-5f1a4c71-c6d5-45b2-94b4-2273fe731437.jpg',
      },
    },
  },
  {
    label: 'Without artist image',
    props: { artist: { id: '2', name: 'Artist 2' } },
  },
]

export const Template: VariantsStory<typeof HorizontalArtistTile> = {
  name: 'HorizontalArtistTile',
  render: (props) => (
    <VariantsTemplate
      variants={variantConfig}
      Component={HorizontalArtistTile}
      defaultProps={props}
    />
  ),
}
