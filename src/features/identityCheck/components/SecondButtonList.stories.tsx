import { NavigationContainer } from '@react-navigation/native'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { SecondButtonList } from 'features/identityCheck/components/SecondButtonList'
import { BicolorSmartphone } from 'ui/svg/icons/BicolorSmartphone'

export default {
  title: 'ui/SecondButtonList',
  component: SecondButtonList,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
} as ComponentMeta<typeof SecondButtonList>

const Template: ComponentStory<typeof SecondButtonList> = (props) => <SecondButtonList {...props} />

export const Default = Template.bind({})
Default.args = {
  label: 'test',
  navigateTo: { screen: 'AgeSelection' },
  leftIcon: BicolorSmartphone,
}
