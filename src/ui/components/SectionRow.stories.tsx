import { NavigationContainer } from '@react-navigation/native'
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { SectionRow } from 'ui/components/SectionRow'
import { EditPen } from 'ui/svg/icons/EditPen'
import { Email } from 'ui/svg/icons/Email'

const meta: Meta<typeof SectionRow> = {
  title: 'ui/sections/SectionRow',
  component: SectionRow,
  argTypes: {
    icon: {
      options: ['Email', 'EditPen'],
      mapping: {
        Email,
        EditPen,
      },
      control: {
        type: 'select',
      },
    },
  },
  decorators: [
    (Story: React.ComponentType) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof SectionRow>

// TODO(PC-17931): Fix this story
export const Navigable: Story = {
  render: (props) => <SectionRow {...props} />,
  args: {
    title: 'Section row navigable',
    type: 'navigable',
  },
}

// TODO(PC-17931): Fix this story
export const NavigableWithIcon: Story = {
  render: (props) => <SectionRow {...props} />,
  args: {
    title: 'Section row navigable',
    type: 'navigable',
    icon: Email,
  },
}

// TODO(PC-17931): Fix this story
export const Clickable: Story = {
  render: (props) => <SectionRow {...props} />,
  args: {
    title: 'Section row clickable',
    type: 'clickable',
  },
}

// TODO(PC-17931): Fix this story
export const ClickableWithIcon: Story = {
  render: (props) => <SectionRow {...props} />,
  args: {
    title: 'Section row clickable',
    type: 'clickable',
    icon: Email,
  },
}
