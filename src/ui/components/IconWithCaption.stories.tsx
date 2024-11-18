import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { selectArgTypeFromObject } from 'libs/storybook/selectArgTypeFromObject'
import { VariantsTemplate } from 'ui/storybook/VariantsTemplate'
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

const baseProps = {
  Icon: categoriesIcons.LiveEvent,
  caption: 'Festival',
  accessibilityLabel: 'Festival de musique',
}

const variantConfig = [
  {
    label: 'IconWithCaption default',
    props: baseProps,
  },
  {
    label: 'IconWithCaption disabled',
    props: { ...baseProps, isDisabled: true },
  },
]

const Template: ComponentStory<typeof VariantsTemplate> = () => (
  <VariantsTemplate variants={variantConfig} Component={IconWithCaption} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'IconWithCaption'
