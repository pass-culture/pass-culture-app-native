import { NavigationContainer } from '@react-navigation/native'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { BooksNativeCategoriesEnum } from 'features/search/types'
import { ReactQueryClientProvider } from 'libs/react-query/ReactQueryClientProvider'
import { theme } from 'theme'
import { SubcategoryButtonList } from 'ui/components/buttons/SubcategoryButton/SubcategoryButtonList'

const meta: ComponentMeta<typeof SubcategoryButtonList> = {
  title: 'ui/buttons/SubcategoryButtonList',
  component: SubcategoryButtonList,
  decorators: [
    (Story) => (
      <ReactQueryClientProvider>
        <NavigationContainer>
          <Story />
        </NavigationContainer>
      </ReactQueryClientProvider>
    ),
  ],
}
export default meta

const Template: ComponentStory<typeof SubcategoryButtonList> = (props) => (
  <SubcategoryButtonList {...props} />
)

// TODO(PC-28526): Fix this stories
const Default = Template.bind({})
Default.args = {
  subcategoryButtonContent: [
    {
      label: 'Société & Politique',
      colors: [theme.colors.aquamarine, theme.colors.aquamarineDark],
      nativeCategory: BooksNativeCategoriesEnum['SOCIETE_ET_POLITIQUE'],
    },
    {
      label: 'Romans & Littérature',
      colors: [theme.colors.aquamarine, theme.colors.aquamarineDark],
      nativeCategory: BooksNativeCategoriesEnum['ROMANS_ET_LITTERATURE'],
    },
    {
      label: 'Mangas',
      colors: [theme.colors.aquamarine, theme.colors.aquamarineDark],
      nativeCategory: BooksNativeCategoriesEnum['MANGAS'],
    },
    {
      label: 'BD & Comics',
      colors: [theme.colors.aquamarine, theme.colors.aquamarineDark],
      nativeCategory: BooksNativeCategoriesEnum['BD_ET_COMICS'],
    },
    {
      label: 'Compétences générales',
      colors: [theme.colors.aquamarine, theme.colors.aquamarineDark],
      nativeCategory: BooksNativeCategoriesEnum['COMPETENCES_GENERALES'],
    },
    {
      label: 'Loisirs & Bien-être',
      colors: [theme.colors.aquamarine, theme.colors.aquamarineDark],
      nativeCategory: BooksNativeCategoriesEnum['LOISIRS_ET_BIEN_ETRE'],
    },
    {
      label: 'Mode & Art',
      colors: [theme.colors.aquamarine, theme.colors.aquamarineDark],
      nativeCategory: BooksNativeCategoriesEnum['MODE_ET_ART'],
    },
    {
      label: 'Théâtre, poésie et essais',
      colors: [theme.colors.aquamarine, theme.colors.aquamarineDark],
      nativeCategory: BooksNativeCategoriesEnum['THEATRE_POESIE_ET_ESSAIS'],
    },
    {
      label: 'Tourisme & Voyage',
      colors: [theme.colors.aquamarine, theme.colors.aquamarineDark],
      nativeCategory: BooksNativeCategoriesEnum['TOURISME_ET_VOYAGES'],
    },
  ],
}
