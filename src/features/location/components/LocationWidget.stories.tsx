import { NavigationContainer } from '@react-navigation/native'
import { StoryObj, Meta } from '@storybook/react'
import React from 'react'

import { ScreenOrigin } from 'features/location/enums'

import { LocationWidget } from './LocationWidget'

const meta: Meta<typeof LocationWidget> = {
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

const Template: StoryObj<typeof LocationWidget> = () => (
  <LocationWidget screenOrigin={ScreenOrigin.HOME} />
)

// Not exported and broken story story du to FF
const Default = Template.bind({})
Default.args = {}
