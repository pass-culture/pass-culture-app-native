import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { selectArgTypeFromObject } from 'libs/storybook/selectArgTypeFromObject'
import { categoriesIcons } from 'ui/svg/icons/bicolor/exports/categoriesIcons'

import { IconWithCaption } from './IconWithCaption'

const meta: ComponentMeta<typeof IconWithCaption> = {
  title: 'ui/IconWithCaption',
  component: IconWithCaption,
  argTypes: {
    Icon: selectArgTypeFromObject(categoriesIcons),
  },
}
export default meta

const Template: ComponentStory<typeof IconWithCaption> = (args) => <IconWithCaption {...args} />

export const Default = Template.bind({})
Default.args = {
  Icon: categoriesIcons.LiveEvent,
  caption: 'Festival',
  accessibilityLabel: 'Festival de musique',
}

export const Disabled = Template.bind({})
Disabled.args = {
  Icon: categoriesIcons.LiveEvent,
  caption: 'Festival',
  accessibilityLabel: 'Festival de musique',
  isDisabled: true,
}
