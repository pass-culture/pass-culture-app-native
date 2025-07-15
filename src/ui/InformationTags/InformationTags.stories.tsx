import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { OfferExtraDataResponse } from 'api/gen'
import { getOfferTags } from 'features/offer/helpers/getOfferTags/getOfferTags'
import { InformationTags } from 'ui/InformationTags/InformationTags'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

const meta: Meta<typeof InformationTags> = {
  title: 'ui/InformationTags',
  component: InformationTags,
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

const variantConfig: Variants<typeof InformationTags> = [
  {
    label: 'InformationTags with custom data on two lines',
    props: { tags: tagsList },
  },
  {
    label: 'InformationTags with custom data on three lines',
    props: { tags: tagsList, tagsLines: 3 },
  },
  {
    label: 'InformationTags with offer example',
    props: { tags: getOfferTags('Vinyle', offerExtraData) },
  },
]

export const Template: VariantsStory<typeof InformationTags> = {
  name: 'InformationTags',
  render: (props) => (
    <VariantsTemplate
      variants={variantConfig}
      Component={InformationTags}
      defaultProps={{ ...props }}
    />
  ),
}
