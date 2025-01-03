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
      categoryKey: BooksNativeCategoriesEnum.SOCIETE_ET_POLITIQUE,
    },
    {
      label: 'Romans & Littérature',
      ...colors,
      categoryKey: BooksNativeCategoriesEnum.ROMANS_ET_LITTERATURE,
    },
    {
      label: 'Mangas',
      ...colors,
      categoryKey: BooksNativeCategoriesEnum.MANGAS,
    },
    {
      label: 'BD & Comics',
      ...colors,
      categoryKey: BooksNativeCategoriesEnum.BD_ET_COMICS,
    },
    {
      label: 'Compétences générales',
      ...colors,
      categoryKey: BooksNativeCategoriesEnum.COMPETENCES_GENERALES,
    },
    {
      label: 'Loisirs & Bien-être',
      ...colors,
      categoryKey: BooksNativeCategoriesEnum.LOISIRS_ET_BIEN_ETRE,
    },
    {
      label: 'Mode & Art',
      ...colors,
      categoryKey: BooksNativeCategoriesEnum.MODE_ET_ART,
    },
    {
      label: 'Théâtre, poésie et essais',
      ...colors,
      categoryKey: BooksNativeCategoriesEnum.THEATRE_POESIE_ET_ESSAIS,
    },
    {
      label: 'Tourisme & Voyage',
      ...colors,
      categoryKey: BooksNativeCategoriesEnum.TOURISME_ET_VOYAGES,
    },
  ],
}
Default.storyName = 'SubcategoryButtonList'
