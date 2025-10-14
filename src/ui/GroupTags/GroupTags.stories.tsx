import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { OfferExtraDataResponse } from 'api/gen'
import { getOfferTags } from 'features/offer/helpers/getOfferTags/getOfferTags'
import { GroupTags } from 'ui/GroupTags/GroupTags'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

const meta: Meta<typeof GroupTags> = {
  title: 'ui/GroupTags',
  component: GroupTags,
}
export default meta

const tagsList = [
  'vinyle',
  'musique',
  'évènement',
  'exclu',
  'famille',
  'amis',
  'spectacle',
  'théâtre',
  'sortie',
  'culturelle',
  'cinema',
  'film',
  'manga',
  'concert',
  'festival',
  'romance',
  'spiritualité',
  'policier',
  'hip/hop',
  'classique',
  'danse',
  'sport',
  'artiste',
  'peinture',
  'musée',
  'exposition',
  'excursion',
  'découverte',
  'studio',
  'mobile',
  'transport',
  'voyage',
  'bibliothèque',
  'médiathèque',
  'magasin culturel',
  'géographie',
  'histoire',
  'course',
  'vêtement',
  'sorties',
  'association',
]
const offerExtraData: OfferExtraDataResponse = { musicType: 'Pop', musicSubType: 'Pop/Rock' }

const variantConfig: Variants<typeof GroupTags> = [
  {
    label: 'GroupTags with custom data on two lines',
    props: { tags: tagsList },
  },
  {
    label: 'GroupTags with offer example',
    props: { tags: getOfferTags('Vinyle', offerExtraData) },
  },
]

export const Template: VariantsStory<typeof GroupTags> = {
  name: 'GroupTags',
  render: (props) => (
    <VariantsTemplate variants={variantConfig} Component={GroupTags} defaultProps={{ ...props }} />
  ),
}
