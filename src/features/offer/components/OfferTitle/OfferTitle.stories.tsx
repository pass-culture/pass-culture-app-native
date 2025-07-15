import type { Meta } from '@storybook/react-vite'
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

export const Template: VariantsStory<typeof OfferTitle> = {
  name: 'OfferTitle',
  render: (props) => (
    <VariantsTemplate variants={variantConfig} Component={OfferTitle} defaultProps={{ ...props }} />
  ),
}
