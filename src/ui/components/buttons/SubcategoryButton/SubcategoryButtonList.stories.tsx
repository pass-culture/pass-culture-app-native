import { NavigationContainer } from '@react-navigation/native'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { BooksNativeCategoriesEnum, NativeCategoryEnum } from 'features/search/types'
import { theme } from 'theme'
import { SubcategoryButtonList } from 'ui/components/buttons/SubcategoryButton/SubcategoryButtonList'

const meta: ComponentMeta<typeof SubcategoryButtonList> = {
  title: 'ui/buttons/SubcategoryButtonList',
  component: SubcategoryButtonList,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
}
export default meta

const Template: ComponentStory<typeof SubcategoryButtonList> = (props) => (
  <SubcategoryButtonList {...props} />
)

export const Default = Template.bind({})

const createSubcategoryButtonItem = (label: string, nativeCategory: NativeCategoryEnum) => ({
  backgroundColor: theme.colors.aquamarine,
  borderColor: theme.colors.aquamarineDark,
  label,
  nativeCategory,
  searchParams: {},
})

Default.args = {
  subcategoryButtonContent: [
    createSubcategoryButtonItem(
      'Société & Politique',
      BooksNativeCategoriesEnum.SOCIETE_ET_POLITIQUE
    ),
    createSubcategoryButtonItem(
      'Romans & Littérature',
      BooksNativeCategoriesEnum.ROMANS_ET_LITTERATURE
    ),
    createSubcategoryButtonItem('Mangas', BooksNativeCategoriesEnum.MANGAS),
    createSubcategoryButtonItem('BD & Comics', BooksNativeCategoriesEnum.BD_ET_COMICS),
    createSubcategoryButtonItem(
      'Compétences générales',
      BooksNativeCategoriesEnum.COMPETENCES_GENERALES
    ),
    createSubcategoryButtonItem(
      'Loisirs & Bien-être',
      BooksNativeCategoriesEnum.LOISIRS_ET_BIEN_ETRE
    ),
    createSubcategoryButtonItem('Mode & Art', BooksNativeCategoriesEnum.MODE_ET_ART),
    createSubcategoryButtonItem(
      'Théâtre, poésie et essais',
      BooksNativeCategoriesEnum.THEATRE_POESIE_ET_ESSAIS
    ),
    createSubcategoryButtonItem('Tourisme & Voyage', BooksNativeCategoriesEnum.TOURISME_ET_VOYAGES),
  ],
}
Default.storyName = 'SubcategoryButtonList'
