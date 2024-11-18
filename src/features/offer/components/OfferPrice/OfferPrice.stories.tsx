import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { OfferPrice } from 'features/offer/components/OfferPrice/OfferPrice'
import { VariantsTemplate } from 'ui/storybook/VariantsTemplate'

const meta: ComponentMeta<typeof OfferPrice> = {
  title: 'features/offer/OfferPrice',
  component: OfferPrice,
}
export default meta

const variantConfig = [
  {
    label: 'OfferPrice round price',
    props: { prices: [1000] },
  },
  {
    label: 'OfferPrice decimal price',
    props: { prices: [999] },
  },
  {
    label: 'OfferPrice free price',
    props: { prices: [0] },
  },
  {
    label: 'OfferPrice with several prices',
    props: { prices: [999, 900] },
  },
]

const Template: ComponentStory<typeof VariantsTemplate> = () => (
  <VariantsTemplate variants={variantConfig} Component={OfferPrice} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'OfferPrice'
