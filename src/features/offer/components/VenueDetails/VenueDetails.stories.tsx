import { ComponentMeta } from '@storybook/react'
import React from 'react'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

import { VenueDetails } from './VenueDetails'

const meta: ComponentMeta<typeof VenueDetails> = {
  title: 'features/offer/VenueDetails',
  component: VenueDetails,
}
export default meta

const baseProps = {
  title: 'Envie de lire',
  address: 'Ivry-sur-Seine 94200, 16 rue Gabriel Peri',
}

const variantConfig: Variants<typeof VenueDetails> = [
  {
    label: 'VenueDetails default',
    props: baseProps,
  },
  {
    label: 'VenueDetails with distance',
    props: { ...baseProps, distance: '500 m' },
  },
]

const Template: VariantsStory<typeof VenueDetails> = () => (
  <VariantsTemplate variants={variantConfig} Component={VenueDetails} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'VenueDetails'
