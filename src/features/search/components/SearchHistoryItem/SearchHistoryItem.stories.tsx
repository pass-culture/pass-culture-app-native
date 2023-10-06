import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { NativeCategoryIdEnumv2, SearchGroupNameEnumv2 } from 'api/gen'
import { SearchHistoryItem } from 'features/search/components/SearchHistoryItem/SearchHistoryItem'
import { Highlighted, HistoryItem } from 'features/search/types'
import { Ul } from 'ui/components/Ul'

const meta: ComponentMeta<typeof SearchHistoryItem> = {
  title: 'features/search/SearchHistoryItem',
  component: SearchHistoryItem,
  decorators: [(Story) => <Story />],
}
export default meta

const historyItem: Highlighted<HistoryItem> = {
  query: 'one piece',
  createdAt: new Date('2023-09-26T00:00:00.000Z').getTime(),
  label: 'one piece',
  _highlightResult: { query: { value: 'one piece' } },
}

const Template: ComponentStory<typeof SearchHistoryItem> = (props) => (
  <Ul>
    <SearchHistoryItem {...props} />
  </Ul>
)

export const Default = Template.bind({})
Default.args = {
  item: historyItem,
  queryHistory: '',
  onPress: action('pressed!'),
}

export const WithHighlightening = Template.bind({})
WithHighlightening.args = {
  item: { ...historyItem, _highlightResult: { query: { value: '<mark>one</mark> piece' } } },
  queryHistory: 'one',
  onPress: action('pressed!'),
}

export const WithCategory = Template.bind({})
WithCategory.args = {
  item: {
    ...historyItem,
    category: SearchGroupNameEnumv2.LIVRES,
    categoryLabel: 'Livres',
    label: 'one piece dans Livres',
  },
  queryHistory: '',
  onPress: action('pressed!'),
}

export const WithNativeCategory = Template.bind({})
WithNativeCategory.args = {
  item: {
    ...historyItem,
    category: SearchGroupNameEnumv2.LIVRES,
    categoryLabel: 'Livres',
    nativeCategory: NativeCategoryIdEnumv2.LIVRES_PAPIER,
    nativeCategoryLabel: 'Livres papier',
    label: 'one piece dabs Livres papier',
  },
  queryHistory: '',
  onPress: action('pressed!'),
}
