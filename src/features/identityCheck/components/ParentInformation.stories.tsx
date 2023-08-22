import { NavigationContainer } from '@react-navigation/native'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { ParentInformation } from './ParentInformation'

const meta: ComponentMeta<typeof ParentInformation> = {
  title: 'Features/identityCheck/ParentInformation',
  component: ParentInformation,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
}
export default meta

const Template: ComponentStory<typeof ParentInformation> = (props) => (
  <ParentInformation {...props} />
)
export const Default = Template.bind({})
