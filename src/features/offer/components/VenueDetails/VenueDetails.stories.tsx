import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

import { VenueDetails } from './VenueDetails'

const meta: Meta<typeof VenueDetails> = {
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

export const Template: VariantsStory<typeof VenueDetails> = {
  name: 'VenueDetails',
  render: (props) => (
    <VariantsTemplate variants={variantConfig} Component={VenueDetails} defaultProps={props} />
  ),
}
