import { ComponentMeta } from '@storybook/react'
import React from 'react'

import { VerticalUl } from 'ui/components/Ul'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

import { BulletListItem } from './BulletListItem'

const meta: ComponentMeta<typeof BulletListItem> = {
  title: 'ui/BulletListItem',
  component: BulletListItem,
}
export default meta

const variantConfig: Variants<typeof BulletListItem> = [
  {
    label: 'BulletListItem default',
    props: { text: 'List item' },
  },
  {
    label: 'BulletListItem with spacing',
    props: { text: 'List item with spacing', spacing: 3 },
  },
  {
    label: 'BulletListItem with nested list',
    props: { text: 'List item', nestedListTexts: ['First item', 'Second item', 'Third item'] },
  },
]

const Template: VariantsStory<typeof BulletListItem> = () => (
  <VerticalUl>
    <VariantsTemplate variants={variantConfig} Component={BulletListItem} />
  </VerticalUl>
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'BulletListItem'
