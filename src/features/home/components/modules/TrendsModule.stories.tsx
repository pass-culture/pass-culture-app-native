// @ts-ignore import is unresolved
// eslint-disable-next-line import/no-unresolved

import { NavigationContainer } from '@react-navigation/native'
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { formattedTrendsModule } from 'features/home/fixtures/homepage.fixture'

import { TrendsModule } from './TrendsModule'

const meta: Meta<typeof TrendsModule> = {
  title: 'features/home/TrendsModule',
  component: TrendsModule,
  decorators: [
    (Story: React.ComponentType) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
  parameters: {
    useQuery: {
      featureFlags: { get: () => ({ minimalBuildNumber: 1000000 }) },
    },
  },
}

export default meta

type Story = StoryObj<typeof TrendsModule>

// TODO(PC-30279): Fix this stories
export const Default: Story = {
  render: (props: React.ComponentProps<typeof TrendsModule>) => <TrendsModule {...props} />,
  args: formattedTrendsModule,
}
