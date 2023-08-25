import { NavigationContainer } from '@react-navigation/native'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { EditButton } from './EditButton'

const meta: ComponentMeta<typeof EditButton> = {
  title: 'features/profile/buttons/EditButton',
  component: EditButton,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
}
export default meta

const Template: ComponentStory<typeof EditButton> = (props) => <EditButton {...props} />

export const Default = Template.bind({})
Default.args = {
  wording: 'Modifier',
  accessibilityLabel: 'Modifier e-mail',
}
