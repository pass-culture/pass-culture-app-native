import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { VerticalUl } from 'ui/components/Ul'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

import { BulletListItem } from './BulletListItem'

const meta: Meta<typeof BulletListItem> = {
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

export const Template: VariantsStory<typeof BulletListItem> = {
  name: 'BulletListItem',
  render: (props) => (
    <VerticalUl>
      <VariantsTemplate variants={variantConfig} Component={BulletListItem} defaultProps={props} />
    </VerticalUl>
  ),
}
