import { NavigationContainer } from '@react-navigation/native'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { Loader } from './Loader'

const meta: ComponentMeta<typeof Loader> = {
  title: 'ui/Loader',
  component: Loader,
}
export default meta

const DynamicTemplate: ComponentStory<typeof Loader> = (props) => {
  return (
    <NavigationContainer>
      <Loader {...props} />
    </NavigationContainer>
  )
}

export const Default = DynamicTemplate.bind({})

export const WithMessage = DynamicTemplate.bind({})
WithMessage.args = {
  message: 'Chargement en cours...',
}
