import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { initialSearchState } from 'features/search/context/reducer'
import { BooksNativeCategoriesEnum, NativeCategoryEnum } from 'features/search/types'
import { theme } from 'theme'
import { SubcategoryButtonList } from 'ui/components/buttons/SubcategoryButton/SubcategoryButtonList'

const createSubcategoryButtonItem = (label: string, nativeCategory: NativeCategoryEnum) => ({
  backgroundColor: theme.designSystem.color.background.decorative01,
  borderColor: theme.designSystem.color.border.decorative01,
  label,
  nativeCategory,
  searchParams: initialSearchState,
  onBeforeNavigate: () => ({}),
})

const meta: Meta<typeof SubcategoryButtonList> = {
  title: 'ui/buttons/SubcategoryButtonList',
  component: SubcategoryButtonList,
}
export default meta

type Story = StoryObj<typeof SubcategoryButtonList>

export const Default: Story = {
  render: (props) => <SubcategoryButtonList {...props} />,
  args: {
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
      createSubcategoryButtonItem(
        'Tourisme & Voyage',
        BooksNativeCategoriesEnum.TOURISME_ET_VOYAGES
      ),
    ],
  },
  name: 'SubcategoryButtonList',
}
