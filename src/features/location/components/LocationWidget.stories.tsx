import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { ScreenOrigin } from 'features/location/enums'

import { LocationWidget } from './LocationWidget'

const meta: Meta<typeof LocationWidget> = {
  title: 'Features/location/LocationWidget',
  component: LocationWidget,
}
export default meta

const Template = () => <LocationWidget screenOrigin={ScreenOrigin.HOME} />

export const Default = {
  name: 'LocationWidget',
  render: () => Template(),
}
