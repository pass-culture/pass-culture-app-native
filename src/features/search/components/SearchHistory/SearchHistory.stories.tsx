import type { Meta } from '@storybook/react-vite'
import React from 'react'
import { action } from 'storybook/actions'

import { NativeCategoryIdEnumv2, SearchGroupNameEnumv2 } from 'api/gen'
import { SearchHistory } from 'features/search/components/SearchHistory/SearchHistory'
import { HistoryItem } from 'features/search/types'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

const meta: Meta<typeof SearchHistory> = {
  title: 'features/search/SearchHistory',
  component: SearchHistory,
  decorators: [(Story) => <Story />],
}
export default meta

const history: HistoryItem[] = [
  {
    query: 'one piece',
    createdAt: new Date('2023-09-26T00:00:00.000Z').getTime(),
    label: 'one piece',
  },
  {
    query: 'one piece',
    createdAt: new Date('2023-09-26T00:01:00.000Z').getTime(),
    category: SearchGroupNameEnumv2.LIVRES,
    categoryLabel: 'Livres',
    label: 'one piece dans Livres',
  },
  {
    query: 'dragon ball',
    createdAt: new Date('2023-09-26T00:02:00.000Z').getTime(),
    category: SearchGroupNameEnumv2.LIVRES,
    categoryLabel: 'Livres',
    nativeCategory: NativeCategoryIdEnumv2.LIVRES_PAPIER,
    nativeCategoryLabel: 'Livres papier',
    label: 'dragon ball dans Livres papier',
  },
]

const variantConfig: Variants<typeof SearchHistory> = [
  {
    label: 'SearchHistory',
    props: {
      history,
      queryHistory: '',
      onPress: action('pressed!'),
      removeItem: action('removed!'),
    },
  },
  {
    label: 'SearchHistory with active query',
    props: {
      history: history.slice(0, -1),
      queryHistory: 'one',
      onPress: action('pressed!'),
      removeItem: action('removed!'),
    },
  },
]

export const Template: VariantsStory<typeof SearchHistory> = {
  name: 'SearchHistory',
  render: (props) => (
    <VariantsTemplate variants={variantConfig} Component={SearchHistory} defaultProps={props} />
  ),
}
