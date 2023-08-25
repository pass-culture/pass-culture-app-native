import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { SeparatorWithText } from 'ui/components/SeparatorWithText'

const meta: ComponentMeta<typeof SeparatorWithText> = {
  title: 'ui/sections/SeparatorWithText',
  component: SeparatorWithText,
}
export default meta

const Template: ComponentStory<typeof SeparatorWithText> = (props) => (
  <SeparatorWithText {...props} />
)

export const Default = Template.bind({})
Default.args = {
  label: 'label',
}
