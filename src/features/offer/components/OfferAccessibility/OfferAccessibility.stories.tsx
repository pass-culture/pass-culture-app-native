import { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { OfferAccessibility } from 'features/offer/components/OfferAccessibility/OfferAccessibility'

const meta: Meta<typeof OfferAccessibility> = {
  title: 'features/offer/OfferAccessibility',
  component: OfferAccessibility,
}
export default meta

const Template: StoryObj<typeof OfferAccessibility> = (props) => (
  <OfferAccessibility {...props} />
)

export const Default = Template.bind({})
Default.args = {
  accessibility: {
    audioDisability: true,
    mentalDisability: true,
    motorDisability: false,
    visualDisability: true,
  },
}

Default.storyName = 'OfferAccessibility'
