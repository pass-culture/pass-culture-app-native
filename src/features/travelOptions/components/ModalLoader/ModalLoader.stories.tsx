import { NavigationContainer } from '@react-navigation/native'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { ModalLoader } from 'features/travelOptions/components/ModalLoader/ModalLoader'

export default {
  title: 'features/bookOffer/ModalLoader',
  component: ModalLoader,
} as ComponentMeta<typeof ModalLoader>

const DynamicTemplate: ComponentStory<typeof ModalLoader> = (props) => {
  return (
    <NavigationContainer>
      <ModalLoader {...props} />
    </NavigationContainer>
  )
}

export const Default = DynamicTemplate.bind({})

export const WithMessage = DynamicTemplate.bind({})
WithMessage.args = {
  message: 'Chargement en cours...',
}
