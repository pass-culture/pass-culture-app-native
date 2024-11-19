import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { VariantsTemplate } from 'ui/storybook/VariantsTemplate'
import { ArrowRight } from 'ui/svg/icons/ArrowRight'

import { Tag } from './Tag'

const meta: ComponentMeta<typeof Tag> = {
  title: 'ui/Tag',
  component: Tag,
}
export default meta

const StyledArrowRight = styled(ArrowRight).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
}))``

const variantConfig = [
  {
    label: 'Tag default',
    props: { label: '1,4km' },
  },
  {
    label: 'Tag with icon',
    props: { label: '1', Icon: StyledArrowRight },
  },
]

const Template: ComponentStory<typeof VariantsTemplate> = () => (
  <VariantsTemplate variants={variantConfig} Component={Tag} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'Tag'
