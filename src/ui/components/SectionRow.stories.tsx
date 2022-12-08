import { NavigationContainer } from '@react-navigation/native'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { selectArgTypeFromObject } from 'libs/storybook/selectArgTypeFromObject'
import { SectionRow } from 'ui/components/SectionRow'
import { EditPen } from 'ui/svg/icons/EditPen'
import { Email } from 'ui/svg/icons/Email'

export default {
  title: 'ui/sections/SectionRow',
  component: SectionRow,
  argTypes: {
    icon: selectArgTypeFromObject({
      Email,
      EditPen,
    }),
  },
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
} as ComponentMeta<typeof SectionRow>

const Template: ComponentStory<typeof SectionRow> = (props) => <SectionRow {...props} />

export const Navigable = Template.bind({})
Navigable.args = {
  title: 'Section row navigable',
  type: 'navigable',
}

export const NavigableWithIcon = Template.bind({})
NavigableWithIcon.args = {
  title: 'Section row navigable',
  type: 'navigable',
  icon: Email,
}

export const Clickable = Template.bind({})
Clickable.args = {
  title: 'Section row clickable',
  type: 'clickable',
}

export const ClickableWithIcon = Template.bind({})
ClickableWithIcon.args = {
  title: 'Section row clickable',
  type: 'clickable',
  icon: Email,
}
