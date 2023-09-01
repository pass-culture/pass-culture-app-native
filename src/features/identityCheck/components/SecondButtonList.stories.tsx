import { NavigationContainer } from '@react-navigation/native'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { SecondButtonList } from 'features/identityCheck/components/SecondButtonList'
import { BicolorSmartphone } from 'ui/svg/icons/BicolorSmartphone'

const meta: ComponentMeta<typeof SecondButtonList> = {
  title: 'ui/SecondButtonList',
  component: SecondButtonList,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
}
export default meta

const Template: ComponentStory<typeof SecondButtonList> = (props) => <SecondButtonList {...props} />

export const Default = Template.bind({})
Default.args = {
  label: 'test',
  navigateTo: { screen: 'Login' },
  leftIcon: BicolorSmartphone,
}
