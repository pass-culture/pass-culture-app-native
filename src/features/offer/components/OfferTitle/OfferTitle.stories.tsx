import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { OfferTitle } from 'features/offer/components/OfferTitle/OfferTitle'
import { VariantsTemplate } from 'ui/storybook/VariantsTemplate'

const meta: ComponentMeta<typeof OfferTitle> = {
  title: 'features/offer/OfferTitle',
  component: OfferTitle,
}
export default meta

const variantConfig = [
  {
    label: 'OfferTitle with long title',
    props: { offerName: 'Le Roi Lion' },
  },
  {
    label: 'OfferTitle with short title',
    props: {
      offerName:
        'Abonnement à la médiathèque de Carnac (livres, CD, DVD, revues, ...) pour les carnacois',
    },
  },
]

const Template: ComponentStory<typeof VariantsTemplate> = () => (
  <VariantsTemplate variants={variantConfig} Component={OfferTitle} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'OfferTitle'
