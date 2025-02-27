import { NavigationContainer } from '@react-navigation/native'
import { StoryObj, Meta } from '@storybook/react'
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

const Template: StoryObj<typeof AchievementBanner> = (props) => (
  <AchievementBanner {...props} />
)
export const Default = Template.bind({})
Default.storyName = 'AchievementBanner'
