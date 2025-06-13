import type { Meta } from '@storybook/react'
import React from 'react'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { Calendar } from 'ui/svg/icons/Calendar'
import { All } from 'ui/svg/icons/venueAndCategories/All'
import { OrderPrice } from 'ui/svg/icons/OrderPrice'
import { PositionFilled } from 'ui/svg/icons/PositionFilled'
import { Sort as SortIconDefault } from 'ui/svg/icons/Sort'

import { FilterRow } from './FilterRow'

const meta: Meta<typeof FilterRow> = {
  title: 'Features/search/FilterRow',
  component: FilterRow,
}
export default meta

const variantConfig: Variants<typeof FilterRow> = [
  {
    label: 'FilterRow Localisation',
    props: { title: 'Localisation', icon: PositionFilled, description: 'Autour de moi' },
  },
  {
    label: 'FilterRow Category',
    props: { title: 'Catégorie', description: 'CD, Vinyle, musique en ligne', icon: All },
  },
  {
    label: 'FilterRow Price',
    props: { title: 'Prix', icon: OrderPrice },
  },
  {
    label: 'FilterRow Date & heures',
    props: {
      title: 'Date & heures',
      description: 'le 24 septembre 2020 entre 18h et 23h',
      icon: Calendar,
    },
  },
  {
    label: 'FilterRow Ranking',
    props: { title: 'Classement', icon: SortIconDefault },
  },
]

export const Template: VariantsStory<typeof FilterRow> = {
  name: 'FilterRow',
  render: (props) => (
    <VariantsTemplate variants={variantConfig} Component={FilterRow} defaultProps={{ ...props }} />
  ),
}
