import { NavigationContainer } from '@react-navigation/native'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { ParentInformation } from './ParentInformation'

export default {
  title: 'Features/identityCheck/ParentInformation',
  component: ParentInformation,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
} as ComponentMeta<typeof ParentInformation>

const Template: ComponentStory<typeof ParentInformation> = (props) => (
  <ParentInformation {...props} />
)
export const Default = Template.bind({})
