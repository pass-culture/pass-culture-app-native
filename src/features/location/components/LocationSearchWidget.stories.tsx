import { NavigationContainer } from '@react-navigation/native'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { LocationSearchWidget } from 'features/location/components/LocationSearchWidget'

const meta: ComponentMeta<typeof LocationSearchWidget> = {
  title: 'Features/Location/LocationSearchWidget',
  component: LocationSearchWidget,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
}
export default meta

const Template: ComponentStory<typeof LocationSearchWidget> = () => <LocationSearchWidget />

export const Default = Template.bind({})
