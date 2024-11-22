import { NavigationContainer } from '@react-navigation/native'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { BadgeBanner } from './BadgeBanner'

const meta: ComponentMeta<typeof BadgeBanner> = {
  title: 'features/profile/achievements/BadgeBanner',
  component: BadgeBanner,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
}
export default meta

const Template: ComponentStory<typeof BadgeBanner> = (props) => <BadgeBanner {...props} />
export const Default = Template.bind({})
Default.storyName = 'BadgeBanner'
