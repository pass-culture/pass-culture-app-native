import { Meta } from '@storybook/react'
import React from 'react'

import { OfferTitle } from 'features/offer/components/OfferTitle/OfferTitle'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

const meta: Meta<typeof OfferTitle> = {
  title: 'features/offer/OfferTitle',
  component: OfferTitle,
}
export default meta

const variantConfig: Variants<typeof OfferTitle> = [
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

const Template: VariantsStory<typeof OfferTitle> = (args) => (
  <VariantsTemplate variants={variantConfig} Component={OfferTitle} defaultProps={{ ...args }} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'OfferTitle'
