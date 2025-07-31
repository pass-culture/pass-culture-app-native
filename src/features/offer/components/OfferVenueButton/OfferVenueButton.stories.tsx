import { NavigationContainer } from '@react-navigation/native'
import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { OfferVenueButton } from 'features/offer/components/OfferVenueButton/OfferVenueButton'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

const meta: Meta<typeof OfferVenueButton> = {
  title: 'features/offer/OfferVenueButton',
  component: OfferVenueButton,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
}
export default meta

const variantConfig: Variants<typeof OfferVenueButton> = [
  {
    label: 'OfferVenueButton default',
    props: { venue: offerResponseSnap.venue },
  },
  {
    label: 'OfferVenueButton without subtitle',
    props: { venue: { ...offerResponseSnap.venue, city: undefined } },
  },
]

export const Template: VariantsStory<typeof OfferVenueButton> = {
  name: 'OfferVenueButton',
  render: (props) => (
    <VariantsTemplate variants={variantConfig} Component={OfferVenueButton} defaultProps={props} />
  ),
}
