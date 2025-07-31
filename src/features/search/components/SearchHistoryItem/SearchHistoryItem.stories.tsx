import type { Meta } from '@storybook/react-vite'
import React from 'react'
import { action } from 'storybook/actions'

import { NativeCategoryIdEnumv2, SearchGroupNameEnumv2 } from 'api/gen'
import { SearchHistoryItem } from 'features/search/components/SearchHistoryItem/SearchHistoryItem'
import { Highlighted, HistoryItem } from 'features/search/types'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

const meta: Meta<typeof SearchHistoryItem> = {
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

const variantConfig: Variants<typeof SearchHistoryItem> = [
  {
    label: 'SearchHistoryItem',
    props: {
      item: historyItem,
      queryHistory: '',
      onPress: action('pressed!'),
    },
  },
  {
    label: 'SearchHistoryItem with Category',
    props: {
      item: {
        ...historyItem,
        category: SearchGroupNameEnumv2.LIVRES,
        categoryLabel: 'Livres',
        label: 'one piece dans Livres',
      },
      queryHistory: '',
      onPress: action('pressed!'),
    },
  },
  {
    label: 'SearchHistoryItem with nativeCategory',
    props: {
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
    },
  },
]

export const Template: VariantsStory<typeof SearchHistoryItem> = {
  name: 'SearchHistoryItem',
  render: (props) => (
    <VariantsTemplate
      variants={variantConfig}
      Component={SearchHistoryItem}
      defaultProps={{ ...props }}
    />
  ),
}
