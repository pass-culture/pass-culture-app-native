import { ComponentMeta } from '@storybook/react'
import React from 'react'

import { CategoryIdEnum } from 'api/gen'
import { OfferArtists } from 'features/offer/components/OfferArtists/OfferArtists'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { getOfferArtists } from 'features/offer/helpers/getOfferArtists/getOfferArtists'
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
  {
    label: 'OfferArtists with author for a book',
    props: {
      artists: getOfferArtists(CategoryIdEnum.LIVRE, {
        ...offerResponseSnap,
        extraData: { author: 'JK Rowling' },
      }),
    },
  },
  {
    label: 'OfferArtists with performer for music recording',
    props: {
      artists: getOfferArtists(CategoryIdEnum.MUSIQUE_ENREGISTREE, {
        ...offerResponseSnap,
        extraData: { performer: 'Edith Piaf' },
      }),
    },
  },
  {
    label: 'OfferArtists with performer for music live',
    props: {
      artists: getOfferArtists(CategoryIdEnum.MUSIQUE_LIVE, {
        ...offerResponseSnap,
        extraData: { performer: 'Jul' },
      }),
    },
  },
  {
    label: 'OfferArtists with stage director for show',
    props: {
      artists: getOfferArtists(CategoryIdEnum.SPECTACLE, {
        ...offerResponseSnap,
        extraData: { stageDirector: 'Thierry Suc' },
      }),
    },
  },
  {
    label: 'OfferArtists with director for cinema',
    props: {
      artists: getOfferArtists(CategoryIdEnum.CINEMA, {
        ...offerResponseSnap,
        extraData: { stageDirector: 'Thierry Suc' },
      }),
    },
  },
]

const Template: VariantsStory<typeof OfferArtists> = () => (
  <VariantsTemplate variants={variantConfig} Component={OfferArtists} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'OfferArtists'
