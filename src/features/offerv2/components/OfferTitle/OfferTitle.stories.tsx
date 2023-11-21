import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { OfferTitle } from 'features/offerv2/components/OfferTitle/OfferTitle'

const meta: ComponentMeta<typeof OfferTitle> = {
  title: 'features/offer/OfferTitle',
  component: OfferTitle,
}
export default meta

const Template: ComponentStory<typeof OfferTitle> = (props) => <OfferTitle {...props} />

export const WithShortTitle = Template.bind({})
WithShortTitle.args = {
  offerName: 'Le Roi Lion',
}

export const WithLongTitle = Template.bind({})
WithLongTitle.args = {
  offerName:
    'Abonnement à la médiathèque de Carnac (livres, CD, DVD, revues, ...) pour les carnacois',
}
