import { NavigationContainer } from '@react-navigation/native'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { View } from 'react-native'

import { VariantsTemplate } from 'ui/storybook/VariantsTemplate'

import { OfferTile } from './OfferTile'

const meta: ComponentMeta<typeof OfferTile> = {
  title: 'ui/tiles/OfferTile',
  component: OfferTile,
  decorators: [
    (stories, { args }) => (
      <NavigationContainer>
        <View style={{ width: args.width }}>{stories()}</View>
      </NavigationContainer>
    ),
  ],
}

export default meta

const baseProps = {
  date: 'le 18 juin 2024',
  name: 'The Fall Guy',
  price: 'dès 15,60\u00a0€',
  categoryLabel: 'Cinéma',
  width: 200,
  height: 300,
  offerLocation: { lat: 48.94374, lng: 2.48171 },
}

const variantConfig = [
  {
    label: 'OfferTile default',
    props: { ...baseProps, variant: 'default' },
  },
  {
    label: 'OfferTile new',
    props: { ...baseProps, variant: 'new' },
  },
]

const Template: ComponentStory<typeof VariantsTemplate> = () => (
  <VariantsTemplate variants={variantConfig} Component={OfferTile} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'OfferTile'
