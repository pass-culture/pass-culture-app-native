// @ts-ignore import is unresolved
// eslint-disable-next-line import/no-unresolved

import { NavigationContainer } from '@react-navigation/native'
import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { formattedTrendsModule } from 'features/home/fixtures/homepage.fixture'

import { Trend } from './Trend'

const meta: Meta<typeof Trend> = {
  title: 'features/home/Trend',
  component: Trend,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof Trend>

export const Default: Story = {
  render: (props) => <Trend {...props} />,
  args: {
    ...formattedTrendsModule.items[1],
    navigateTo: { screen: 'VenueMap' },
  },
  name: 'Trend',
}
