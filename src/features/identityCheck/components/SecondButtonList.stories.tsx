import { NavigationContainer } from '@react-navigation/native'
import { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { SecondButtonList } from 'features/identityCheck/components/SecondButtonList'
import { BicolorSmartphone } from 'ui/svg/icons/BicolorSmartphone'

const meta: Meta<typeof SecondButtonList> = {
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

const Template: StoryObj<typeof SecondButtonList> = (props) => <SecondButtonList {...props} />

export const Default = Template.bind({})
Default.storyName = 'SecondButtonList'
Default.args = {
  label: 'test',
  navigateTo: { screen: 'Login' },
  leftIcon: BicolorSmartphone,
}
