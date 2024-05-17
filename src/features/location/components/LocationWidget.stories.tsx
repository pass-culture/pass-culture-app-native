import { NavigationContainer } from '@react-navigation/native'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { ScreenOrigin } from 'features/location/enums'

import { LocationWidget } from './LocationWidget'

const meta: ComponentMeta<typeof LocationWidget> = {
  title: 'Features/location/LocationWidget',
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

const Template: ComponentStory<typeof LocationWidget> = () => (
  <LocationWidget screenOrigin={ScreenOrigin.HOME} />
)

// Not exported and broken story story du to FF
const Default = Template.bind({})
Default.args = {}
