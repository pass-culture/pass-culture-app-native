import { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { OfferMetadataItem } from 'features/offer/components/OfferMetadataItem/OfferMetadataItem'

const meta: Meta<typeof OfferMetadataItem> = {
  title: 'features/offer/OfferMetadataItem',
  component: OfferMetadataItem,
}
export default meta

const Template: StoryObj<typeof OfferMetadataItem> = (props) => (
  <OfferMetadataItem {...props} />
)

export const Default = Template.bind({})
Default.args = {
  label: 'Intervenant',
  value: 'Jean Paul Sartre',
}
Default.storyName = 'OfferMetadataItem'
