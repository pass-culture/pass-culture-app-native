import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { OfferPrice } from 'features/offer/components/OfferPrice/OfferPrice'

const meta: ComponentMeta<typeof OfferPrice> = {
  title: 'features/offer/OfferPrice',
  component: OfferPrice,
}
export default meta

const Template: ComponentStory<typeof OfferPrice> = (props) => <OfferPrice {...props} />

export const RoundPrice = Template.bind({})
RoundPrice.args = {
  prices: [1000],
}

export const DecimalPrice = Template.bind({})
DecimalPrice.args = {
  prices: [999],
}

export const FreePrice = Template.bind({})
FreePrice.args = {
  prices: [0],
}

export const WithSeveralPrices = Template.bind({})
WithSeveralPrices.args = {
  prices: [999, 900],
}
