import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { DeviceInformationsBanner } from './DeviceInformationsBanner'

export default {
  title: 'features/trustedDevice/DeviceInformationsBanner',
  component: DeviceInformationsBanner,
} as ComponentMeta<typeof DeviceInformationsBanner>

const Template: ComponentStory<typeof DeviceInformationsBanner> = (props) => (
  <DeviceInformationsBanner {...props} />
)
export const Default = Template.bind({})
Default.args = {
  location: 'Paris',
  osAndSource: 'iOS - iPhone 13',
  loginDate: 'Le 09/06/2023 à 12h00',
}
