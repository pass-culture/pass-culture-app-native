import { NavigationContainer } from '@react-navigation/native'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { selectArgTypeFromObject } from 'libs/storybook/selectArgTypeFromObject'
import { SectionRow } from 'ui/components/SectionRow'
import { EditPen } from 'ui/svg/icons/EditPen'
import { Email } from 'ui/svg/icons/Email'

const meta: ComponentMeta<typeof SectionRow> = {
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
}
export default meta

const Template: ComponentStory<typeof SectionRow> = (props) => <SectionRow {...props} />

// TODO(PC-17931): Fix this story
const Navigable = Template.bind({})
Navigable.args = {
  title: 'Section row navigable',
  type: 'navigable',
}

// TODO(PC-17931): Fix this story
const NavigableWithIcon = Template.bind({})
NavigableWithIcon.args = {
  title: 'Section row navigable',
  type: 'navigable',
  icon: Email,
}

// TODO(PC-17931): Fix this story
const Clickable = Template.bind({})
Clickable.args = {
  title: 'Section row clickable',
  type: 'clickable',
}

// TODO(PC-17931): Fix this story
const ClickableWithIcon = Template.bind({})
ClickableWithIcon.args = {
  title: 'Section row clickable',
  type: 'clickable',
  icon: Email,
}
