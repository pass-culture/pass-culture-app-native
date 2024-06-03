import { NavigationContainer } from '@react-navigation/native'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { CategoryIdEnum } from 'api/gen'

import { MarketingBlockExclusivity } from './MarketingBlockExclusivity'

const meta: ComponentMeta<typeof MarketingBlockExclusivity> = {
  title: 'features/home/MarketingBlock/MarketingBlockExclusivity',
  component: MarketingBlockExclusivity,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
}
export default meta

const Template: ComponentStory<typeof MarketingBlockExclusivity> = (props) => (
  <MarketingBlockExclusivity {...props} />
)

export const Default = Template.bind({})
Default.args = {
  backgroundImageUrl:
    'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/9MPGW',
  offerImageUrl:
    'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/9MPGW',
  categoryText: 'Cinéma',
  title: 'Harry Potter et l’Ordre du Phénix',
  offerLocation: { lat: 1, lng: 1 },
  price: '10€',
}

export const WithoutBackgroundImage = Template.bind({})
WithoutBackgroundImage.args = {
  offerImageUrl:
    'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/9MPGW',
  categoryText: 'Cinéma',
  title: 'Harry Potter et l’Ordre du Phénix',
  offerLocation: { lat: 1, lng: 1 },
  price: '10€',
  categoryId: CategoryIdEnum.CINEMA,
}
