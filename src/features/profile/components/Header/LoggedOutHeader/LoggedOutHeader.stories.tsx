import { NavigationContainer } from '@react-navigation/native'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { LoggedOutHeader } from 'features/profile/components/Header/LoggedOutHeader/LoggedOutHeader'

export default {
  title: 'features/Profile/Headers/LoggedOutHeader',
  component: LoggedOutHeader,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
} as ComponentMeta<typeof LoggedOutHeader>

export const Default: ComponentStory<typeof LoggedOutHeader> = () => <LoggedOutHeader />
Default.storyName = 'LoggedOutHeader'
