import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { All } from 'ui/svg/icons/bicolor/All'
import { BicolorAroundMe } from 'ui/svg/icons/BicolorAroundMe'
import { Calendar } from 'ui/svg/icons/Calendar'
import { OrderPrice } from 'ui/svg/icons/OrderPrice'
import { Sort as SortIconDefault } from 'ui/svg/icons/Sort'

import { FilterRow } from './FilterRow'

const meta: ComponentMeta<typeof FilterRow> = {
  title: 'Features/search/FilterRow',
  component: FilterRow,
}
export default meta

const Template: ComponentStory<typeof FilterRow> = (props) => <FilterRow {...props} />

export const Localisation = Template.bind({})
Localisation.args = {
  title: 'Localisation',
  icon: BicolorAroundMe,
  description: 'Autour de moi',
}

export const Category = Template.bind({})
Category.args = {
  title: 'Catégorie',
  description: 'CD, Vinyle, musique en ligne',
  icon: All,
}

export const Price = Template.bind({})
Price.args = {
  title: 'Prix',
  icon: OrderPrice,
}

export const DateAndTime = Template.bind({})
DateAndTime.args = {
  title: 'Date & heures',
  description: 'le 24 septembre 2020 entre 18h et 23h',
  icon: Calendar,
}

export const Ranking = Template.bind({})
Ranking.args = {
  title: 'Classement',
  icon: SortIconDefault,
}
