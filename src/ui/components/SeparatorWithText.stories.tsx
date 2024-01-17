import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { theme } from 'theme'
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

export const CustomBackgroundColor = Template.bind({})
CustomBackgroundColor.args = {
  label: 'label',
  backgroundColor: theme.colors.greyMedium,
}
