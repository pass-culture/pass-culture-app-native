import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { SeparatorWithText } from 'ui/components/SeparatorWithText'

export default {
  title: 'ui/sections/SeparatorWithText',
  component: SeparatorWithText,
} as ComponentMeta<typeof SeparatorWithText>

const Template: ComponentStory<typeof SeparatorWithText> = (props) => (
  <SeparatorWithText {...props} />
)

export const Default = Template.bind({})
Default.args = {
  label: 'label',
}
