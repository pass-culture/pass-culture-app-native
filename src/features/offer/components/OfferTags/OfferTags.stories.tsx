import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { OfferExtraData } from 'api/gen'
import { OfferTags } from 'features/offer/components/OfferTags/OfferTags'
import { getOfferTags } from 'features/offer/helpers/getOfferTags/getOfferTags'

const meta: ComponentMeta<typeof OfferTags> = {
  title: 'features/offer/OfferTags',
  component: OfferTags,
}
export default meta

const Template: ComponentStory<typeof OfferTags> = (props) => <OfferTags {...props} />

export const WithCustomData = Template.bind({})
WithCustomData.args = {
  tags: [
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
  ],
}

const offerExtraData: OfferExtraData = { musicType: 'Pop', musicSubType: 'Pop/Rock' }
export const WithOfferExample = Template.bind({})
WithOfferExample.args = {
  tags: getOfferTags('Vinyle', offerExtraData),
}
