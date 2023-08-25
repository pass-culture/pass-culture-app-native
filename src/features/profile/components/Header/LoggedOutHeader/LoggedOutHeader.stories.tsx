import { NavigationContainer } from '@react-navigation/native'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { LoggedOutHeader } from 'features/profile/components/Header/LoggedOutHeader/LoggedOutHeader'
import { theme } from 'theme'

const meta: ComponentMeta<typeof LoggedOutHeader> = {
  title: 'features/Profile/Headers/LoggedOutHeader',
  component: LoggedOutHeader,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
}
export default meta

// TODO(PC-17931): Fix this stories
const Default: ComponentStory<typeof LoggedOutHeader> = () => <LoggedOutHeader />
Default.storyName = 'LoggedOutHeader'
Default.parameters = {
  chromatic: {
    viewports: [theme.breakpoints.md, theme.breakpoints.lg, theme.breakpoints.xl],
  },
}
