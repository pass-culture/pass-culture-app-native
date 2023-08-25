import { NavigationContainer } from '@react-navigation/native'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { PageHeaderSecondary } from './PageHeaderSecondary'

const meta: ComponentMeta<typeof PageHeaderSecondary> = {
  title: 'ui/headers/PageHeaderSecondary',
  component: PageHeaderSecondary,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
}
export default meta

const Template: ComponentStory<typeof PageHeaderSecondary> = (props) => (
  <PageHeaderSecondary {...props} />
)

// TODO(PC-17931): Fix this stories
const Default = Template.bind({})
Default.args = {
  title: 'Page header secondary',
}

const WithCloseIcon = Template.bind({})
WithCloseIcon.args = {
  title: 'Page header secondary',
  shouldDisplayCloseButton: true,
}
