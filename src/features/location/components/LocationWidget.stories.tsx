import { NavigationContainer } from '@react-navigation/native'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { LocationWidget } from './LocationWidget'

const meta: ComponentMeta<typeof LocationWidget> = {
  title: 'Features/Location/LocationWidget',
  component: LocationWidget,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
}
export default meta

const Template: ComponentStory<typeof LocationWidget> = () => <LocationWidget enableTooltip />

export const Default = Template.bind({})
