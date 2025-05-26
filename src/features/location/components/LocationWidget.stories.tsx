import { NavigationContainer } from '@react-navigation/native'
import type { Meta } from '@storybook/react'
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

const Template = () => <LocationWidget screenOrigin={ScreenOrigin.HOME} />

export const Default = {
  name: 'LocationWidget',
  render: () => Template(),
}
