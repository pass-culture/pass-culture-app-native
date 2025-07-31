import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { DeviceInformationsBanner } from './DeviceInformationsBanner'

const meta: Meta<typeof DeviceInformationsBanner> = {
  title: 'features/trustedDevice/DeviceInformationsBanner',
  component: DeviceInformationsBanner,
}
export default meta

type Story = StoryObj<typeof DeviceInformationsBanner>

export const Default: Story = {
  render: (props) => <DeviceInformationsBanner {...props} />,
  args: {
    location: 'Paris',
    osAndSource: 'iOS - iPhone 13',
    loginDate: 'Le 09/06/2023 à 12h00',
  },
  name: 'DeviceInformationsBanner',
}
