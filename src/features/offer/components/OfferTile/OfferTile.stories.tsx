import { NavigationContainer } from '@react-navigation/native'
import { ComponentMeta, StoryObj } from '@storybook/react'
import React from 'react'
import { View } from 'react-native'

import { OfferTileProps } from 'features/offer/types'

import { OfferTile } from './OfferTile'

const meta: ComponentMeta<typeof OfferTile> = {
  title: 'ui/OfferTile',
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

type Story = StoryObj<OfferTileProps>

const props: Partial<OfferTileProps> = {
  distance: '100m',
  date: 'le 18 juin 2024',
  name: 'The Fall Guy',
  price: 'dès 15,60\u00a0€',
  categoryLabel: 'Cinéma',
  width: 200,
  height: 300,
}

export const Default: Story = {
  args: {
    ...props,
    variant: 'default',
  },
}
export const New: Story = {
  args: {
    ...props,
    variant: 'new',
  },
}
