import { NavigationContainer } from '@react-navigation/native'
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { AchievementBanner } from './AchievementBanner'

const meta: Meta<typeof AchievementBanner> = {
  title: 'features/profile/achievements/AchievementBanner',
  component: AchievementBanner,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof AchievementBanner>

export const Default: Story = {
  render: (props) => <AchievementBanner {...props} />,
}
