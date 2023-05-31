import { NavigationContainer } from '@react-navigation/native'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { BookingOfferLoader } from 'features/bookOffer/components/BookingOfferLoader/BookingOfferLoader'

export default {
  title: 'features/bookOffer/BookingOfferLoader',
  component: BookingOfferLoader,
} as ComponentMeta<typeof BookingOfferLoader>

const DynamicTemplate: ComponentStory<typeof BookingOfferLoader> = (props) => {
  return (
    <NavigationContainer>
      <BookingOfferLoader {...props} />
    </NavigationContainer>
  )
}

export const Default = DynamicTemplate.bind({})

export const WithMessage = DynamicTemplate.bind({})
WithMessage.args = {
  message: 'Chargement en cours...',
}
