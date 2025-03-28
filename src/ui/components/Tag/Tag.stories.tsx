import type { Meta } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { ArrowRight } from 'ui/svg/icons/ArrowRight'

import { Tag } from './Tag'

const meta: Meta<typeof Tag> = {
  title: 'ui/Tag',
  component: Tag,
}
export default meta

const StyledArrowRight = styled(ArrowRight).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
}))``

const variantConfig: Variants<typeof Tag> = [
  {
    label: 'Tag default',
    props: { label: '1,4km' },
  },
  {
    label: 'Tag with icon',
    props: { label: '1', Icon: StyledArrowRight },
  },
]

const Template: VariantsStory<typeof Tag> = (args) => (
  <VariantsTemplate variants={variantConfig} Component={Tag} defaultProps={{ ...args }} />
)

export const AllVariants = Template.bind({})
