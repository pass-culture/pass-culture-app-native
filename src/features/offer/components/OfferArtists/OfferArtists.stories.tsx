import { ComponentMeta } from '@storybook/react'
import React from 'react'

import { OfferArtists } from 'features/offer/components/OfferArtists/OfferArtists'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

const meta: ComponentMeta<typeof OfferArtists> = {
  title: 'features/offer/OfferArtists',
  component: OfferArtists,
}
export default meta

const variantConfig: Variants<typeof OfferArtists> = [
  {
    label: 'OfferArtists with one artist',
    props: { artists: 'Martin Scorsese' },
  },
  {
    label: 'OfferArtists with several artists',
    props: {
      artists:
        'Martin Scorsese, Eric Roth, Leonardo DiCaprio, Lily Gladstone, Robert De Niro, Jesse Plemons, John Lithgow, Brendan Fraser, Tatanka Means, ' +
        'William Belleau, Scott Sheperd, Louis Cancelmi, Jason Isbell, Sturgill Simpson, Tantoo Cardinal, Cara Jade Myers, Janae Collins, Jillian Dion, ' +
        'Michael Abbott Jr, Pat Healy, Evereth Waller, Yancey Red Corn',
    },
  },
]

const Template: VariantsStory<typeof OfferArtists> = (args) => (
  <VariantsTemplate variants={variantConfig} Component={OfferArtists} defaultProps={{ ...args }} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'OfferArtists'
