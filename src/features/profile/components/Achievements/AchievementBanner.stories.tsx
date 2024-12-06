import { NavigationContainer } from '@react-navigation/native'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { AchievementBanner } from './AchievementBanner'

const meta: ComponentMeta<typeof AchievementBanner> = {
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

const Template: ComponentStory<typeof AchievementBanner> = (props) => (
  <AchievementBanner {...props} />
)
export const Default = Template.bind({})
Default.storyName = 'AchievementBanner'
