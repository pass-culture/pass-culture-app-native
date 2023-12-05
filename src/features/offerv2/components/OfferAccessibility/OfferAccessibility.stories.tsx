import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { OfferAccessibility } from 'features/offerv2/components/OfferAccessibility/OfferAccessibility'

const meta: ComponentMeta<typeof OfferAccessibility> = {
  title: 'features/offer/OfferAccessibility',
  component: OfferAccessibility,
}
export default meta

const Template: ComponentStory<typeof OfferAccessibility> = (props) => (
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
