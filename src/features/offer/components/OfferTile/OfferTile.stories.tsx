import { NavigationContainer } from '@react-navigation/native'
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { CategoryIdEnum, SubcategoryIdEnum } from 'api/gen'

import { OfferTile } from './OfferTile'

const meta: Meta<typeof OfferTile> = {
  title: 'ui/tiles/OfferTile',
  component: OfferTile,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof OfferTile>

export const Default: Story = {
  args: {
    date: 'le 18 juin 2024',
    name: 'The Fall Guy',
    price: 'dès 15,60\u00a0€',
    categoryLabel: 'Cinéma',
    width: 200,
    height: 300,
    offerLocation: { lat: 48.94374, lng: 2.48171 },
    categoryId: CategoryIdEnum.CINEMA,
    subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
    offerId: 123456,
    analyticsFrom: 'home',
  },
}

export const WithTags = {
  name: 'WithTags',
  args: {
    date: 'le 18 juin 2024',
    name: 'The Fall Guy',
    price: 'dès 15,60\u00a0€',
    categoryLabel: 'Cinéma',
    width: 200,
    height: 300,
    likes: 99,
  },
}
