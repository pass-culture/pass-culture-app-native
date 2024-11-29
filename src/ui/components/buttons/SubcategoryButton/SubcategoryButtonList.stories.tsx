import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { BooksNativeCategoriesEnum } from 'features/search/types'
import { theme } from 'theme'
import { SubcategoryButtonList } from 'ui/components/buttons/SubcategoryButton/SubcategoryButtonList'

const meta: ComponentMeta<typeof SubcategoryButtonList> = {
  title: 'ui/buttons/SubcategoryButtonList',
  component: SubcategoryButtonList,
}
export default meta

const Template: ComponentStory<typeof SubcategoryButtonList> = (props) => (
  <SubcategoryButtonList {...props} />
)

const colors = {
  backgroundColor: theme.colors.aquamarine,
  borderColor: theme.colors.aquamarineDark,
}
export const Default = Template.bind({})
Default.args = {
  subcategoryButtonContent: [
    {
      label: 'Société & Politique',
      ...colors,
      nativeCategory: BooksNativeCategoriesEnum.SOCIETE_ET_POLITIQUE,
    },
    {
      label: 'Romans & Littérature',
      ...colors,
      nativeCategory: BooksNativeCategoriesEnum.ROMANS_ET_LITTERATURE,
    },
    {
      label: 'Mangas',
      ...colors,
      nativeCategory: BooksNativeCategoriesEnum.MANGAS,
    },
    {
      label: 'BD & Comics',
      ...colors,
      nativeCategory: BooksNativeCategoriesEnum.BD_ET_COMICS,
    },
    {
      label: 'Compétences générales',
      ...colors,
      nativeCategory: BooksNativeCategoriesEnum.COMPETENCES_GENERALES,
    },
    {
      label: 'Loisirs & Bien-être',
      ...colors,
      nativeCategory: BooksNativeCategoriesEnum.LOISIRS_ET_BIEN_ETRE,
    },
    {
      label: 'Mode & Art',
      ...colors,
      nativeCategory: BooksNativeCategoriesEnum.MODE_ET_ART,
    },
    {
      label: 'Théâtre, poésie et essais',
      ...colors,
      nativeCategory: BooksNativeCategoriesEnum.THEATRE_POESIE_ET_ESSAIS,
    },
    {
      label: 'Tourisme & Voyage',
      ...colors,
      nativeCategory: BooksNativeCategoriesEnum.TOURISME_ET_VOYAGES,
    },
  ],
}
Default.storyName = 'SubcategoryButtonList'
