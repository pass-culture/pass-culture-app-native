import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { VerticalUl } from 'ui/components/Ul'

import { BulletListItem } from './BulletListItem'

export default {
  title: 'ui/BulletListItem',
  component: BulletListItem,
} as ComponentMeta<typeof BulletListItem>

const Template: ComponentStory<typeof BulletListItem> = (props) => (
  <VerticalUl>
    <BulletListItem {...props} />
    <BulletListItem {...props} />
    <BulletListItem {...props} />
  </VerticalUl>
)

export const Default = Template.bind({})
Default.args = {
  text: 'List item',
}

export const ListItemWithSpacing = Template.bind({})
ListItemWithSpacing.args = {
  text: 'List item with spacing',
  spacing: 3,
}

export const ListWithNestedList = Template.bind({})
ListWithNestedList.args = {
  text: 'List item',
  nestedListTexts: ['First item', 'Second item', 'Third item'],
}
