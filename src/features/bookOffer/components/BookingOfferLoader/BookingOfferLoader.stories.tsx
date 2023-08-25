import { NavigationContainer } from '@react-navigation/native'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { BookingOfferLoader } from 'features/bookOffer/components/BookingOfferLoader/BookingOfferLoader'

const meta: ComponentMeta<typeof BookingOfferLoader> = {
  title: 'features/bookOffer/BookingOfferLoader',
  component: BookingOfferLoader,
}
export default meta

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
