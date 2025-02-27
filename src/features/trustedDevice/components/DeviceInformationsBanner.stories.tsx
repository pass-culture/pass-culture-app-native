import { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { DeviceInformationsBanner } from './DeviceInformationsBanner'

const meta: Meta<typeof DeviceInformationsBanner> = {
  title: 'features/trustedDevice/DeviceInformationsBanner',
  component: DeviceInformationsBanner,
}
export default meta

const Template: StoryObj<typeof DeviceInformationsBanner> = (props) => (
  <DeviceInformationsBanner {...props} />
)
export const Default = Template.bind({})
Default.args = {
  location: 'Paris',
  osAndSource: 'iOS - iPhone 13',
  loginDate: 'Le 09/06/2023 à 12h00',
}
Default.storyName = 'DeviceInformationsBanner'
