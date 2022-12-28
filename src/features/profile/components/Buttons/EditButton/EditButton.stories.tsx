import { NavigationContainer } from '@react-navigation/native'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { EditButton } from './EditButton'

export default {
  title: 'features/profile/EditButton',
  component: EditButton,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
} as ComponentMeta<typeof EditButton>

const Template: ComponentStory<typeof EditButton> = (props) => <EditButton {...props} />

export const Default = Template.bind({})
Default.args = {
  wording: 'Modifier',
  accessibilityLabel: 'Modifier e-mail',
}
