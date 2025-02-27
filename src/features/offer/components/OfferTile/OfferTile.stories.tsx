import { NavigationContainer } from '@react-navigation/native'
import { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { View } from 'react-native'

import { OfferTile } from './OfferTile'

const meta: Meta<typeof OfferTile> = {
  title: 'ui/tiles/OfferTile',
  component: OfferTile,
  decorators: [
    (Story, { args }) => (
      <NavigationContainer>
        <View style={{ width: args.width }}>{Story()}</View>
      </NavigationContainer>
    ),
  ],
}

export default meta

const Template: StoryObj<typeof OfferTile> = (props) => <OfferTile {...props} />

export const Default = Template.bind({})
Default.args = {
  date: 'le 18 juin 2024',
  name: 'The Fall Guy',
  price: 'dès 15,60\u00a0€',
  categoryLabel: 'Cinéma',
  width: 200,
  height: 300,
  offerLocation: { lat: 48.94374, lng: 2.48171 },
}
