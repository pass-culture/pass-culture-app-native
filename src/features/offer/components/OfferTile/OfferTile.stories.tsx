import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { Tag } from 'ui/components/Tag/Tag'
import { TagVariant } from 'ui/components/Tag/types'
import { Variants, VariantsStory, VariantsTemplate } from 'ui/storybook/VariantsTemplate'
import { ClockFilled } from 'ui/svg/icons/ClockFilled'

import { OfferTile } from './OfferTile'

const meta: Meta<typeof OfferTile> = {
  title: 'ui/tiles/OfferTile',
  component: OfferTile,
}
export default meta

const variantConfig: Variants<typeof OfferTile> = [
  {
    label: 'OfferTile Default',
    props: {
      date: 'le 18 juin 2024',
      name: 'The Fall Guy',
      price: 'dès 15,60\u00a0€',
      categoryLabel: 'Cinéma',
      width: 200,
      height: 300,
      offerLocation: { lat: 48.94374, lng: 2.48171 },
    },
  },
  {
    label: 'OfferTile With Coming Soon',
    props: {
      date: 'le 18 juin 2024',
      name: 'The Fall Guy',
      price: 'dès 15,60\u00a0€',
      categoryLabel: 'Cinéma',
      width: 200,
      height: 300,
      interactionTag: <Tag Icon={ClockFilled} variant={TagVariant.WARNING} label="Bientôt dispo" />,
      offerLocation: { lat: 48.94374, lng: 2.48171 },
    },
  },
  {
    label: 'OfferTile With Likes',
    props: {
      date: 'le 18 juin 2024',
      name: 'The Fall Guy',
      price: 'dès 15,60\u00a0€',
      categoryLabel: 'Cinéma',
      width: 200,
      height: 300,
      interactionTag: <Tag variant={TagVariant.LIKE} label="100 j’aime" />,
      offerLocation: { lat: 48.94374, lng: 2.48171 },
    },
  },
  {
    label: 'OfferTile WithChronicles',
    props: {
      date: 'le 18 juin 2024',
      name: 'The Fall Guy',
      price: 'dès 15,60\u00a0€',
      categoryLabel: 'Cinéma',
      width: 200,
      height: 300,
      interactionTag: <Tag variant={TagVariant.BOOKCLUB} label="Reco du Book Club" />,
      offerLocation: { lat: 48.94374, lng: 2.48171 },
    },
  },
  {
    label: 'OfferTile WithHeadlines',
    props: {
      date: 'le 18 juin 2024',
      name: 'The Fall Guy',
      price: 'dès 15,60\u00a0€',
      categoryLabel: 'Cinéma',
      width: 200,
      height: 300,
      interactionTag: <Tag variant={TagVariant.HEADLINE} label="Reco par les lieux" />,
      offerLocation: { lat: 48.94374, lng: 2.48171 },
    },
  },
]

export const Template: VariantsStory<typeof OfferTile> = {
  name: 'OfferTile',
  render: (props) => (
    <VariantsTemplate variants={variantConfig} Component={OfferTile} defaultProps={{ ...props }} />
  ),
}
