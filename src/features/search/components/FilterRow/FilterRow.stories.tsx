import { Meta } from '@storybook/react'
import React from 'react'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { All } from 'ui/svg/icons/bicolor/All'
import { BicolorAroundMe } from 'ui/svg/icons/BicolorAroundMe'
import { Calendar } from 'ui/svg/icons/Calendar'
import { OrderPrice } from 'ui/svg/icons/OrderPrice'
import { Sort as SortIconDefault } from 'ui/svg/icons/Sort'

import { FilterRow } from './FilterRow'

const meta: Meta<typeof FilterRow> = {
  title: 'Features/search/FilterRow',
  component: FilterRow,
}
export default meta

const variantConfig: Variants<typeof FilterRow> = [
  {
    label: 'Localisation',
    props: { title: 'Localisation', icon: BicolorAroundMe, description: 'Autour de moi' },
  },
  {
    label: 'Category',
    props: { title: 'Catégorie', description: 'CD, Vinyle, musique en ligne', icon: All },
  },
  {
    label: 'Price',
    props: { title: 'Prix', icon: OrderPrice },
  },
  {
    label: 'Date & heures',
    props: {
      title: 'Date & heures',
      description: 'le 24 septembre 2020 entre 18h et 23h',
      icon: Calendar,
    },
  },
  {
    label: 'Ranking',
    props: { title: 'Classement', icon: SortIconDefault },
  },
]

const Template: VariantsStory<typeof FilterRow> = (args) => (
  <VariantsTemplate variants={variantConfig} Component={FilterRow} defaultProps={{ ...args }} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'FilterRow'
