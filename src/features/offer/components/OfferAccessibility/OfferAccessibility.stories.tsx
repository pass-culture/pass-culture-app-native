import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { OfferAccessibility } from 'features/offer/components/OfferAccessibility/OfferAccessibility'

const meta: ComponentMeta<typeof OfferAccessibility> = {
  title: 'features/offer/OfferAccessibility',
  component: OfferAccessibility,
}
export default meta

const Template: ComponentStory<typeof OfferAccessibility> = (props) => (
  <OfferAccessibility {...props} />
)

// Todo(PC-35077) fix this story, read the associated ticket to follow the different choices offered
const Default = Template.bind({})
Default.args = {
  accessibility: {
    audioDisability: true,
    mentalDisability: true,
    motorDisability: false,
    visualDisability: true,
  },
}

Default.storyName = 'OfferAccessibility'
