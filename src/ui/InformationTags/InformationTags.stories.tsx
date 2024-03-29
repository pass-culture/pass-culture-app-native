import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { OfferExtraData } from 'api/gen'
import { getOfferTags } from 'features/offer/helpers/getOfferTags/getOfferTags'
import { InformationTags } from 'ui/InformationTags/InformationTags'

const meta: ComponentMeta<typeof InformationTags> = {
  title: 'ui/InformationTags',
  component: InformationTags,
}
export default meta

const Template: ComponentStory<typeof InformationTags> = (props) => <InformationTags {...props} />

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

export const WithCustomDataOnTwoLines = Template.bind({})
WithCustomDataOnTwoLines.args = {
  tags: tagsList,
}

export const WithCustomDataOnThreeLines = Template.bind({})
WithCustomDataOnThreeLines.args = {
  tags: tagsList,
  tagsLines: 3,
}

const offerExtraData: OfferExtraData = { musicType: 'Pop', musicSubType: 'Pop/Rock' }
export const WithOfferExample = Template.bind({})
WithOfferExample.args = {
  tags: getOfferTags('Vinyle', offerExtraData),
}
