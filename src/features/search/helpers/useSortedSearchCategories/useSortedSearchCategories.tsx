import { SearchGroupNameEnumv2 } from 'api/gen'
import { ListCategoryButtonProps } from 'features/search/components/CategoriesButtonsDisplay/CategoriesButtonsDisplay'
import { useAvailableCategories } from 'features/search/helpers/useAvailableCategories/useAvailableCategories'
import { useSearchGroupLabelMapping } from 'libs/subcategories/mappings'

export type OnPressCategory = (pressedCategory: SearchGroupNameEnumv2) => void

// Reordering categories according to designer models with a non-dynamic scheduling
const desiredOrder = [
  'Concerts & festivals',
  'Films, séries, cinéma',
  'Livres',
  'CD, vinyles, musique en ligne',
  'Arts & loisirs créatifs',
  'Spectacles',
  'Musées & visites culturelles',
  'Jeux & jeux vidéos',
  'Instruments de musique',
  'Médias & presse',
  'Bibliothèques, Médiathèques',
  'Cartes jeunes',
  'Conférences & rencontres',
  'Évènements en ligne',
]

export const useSortedSearchCategories = (
  onPressCategory: OnPressCategory
): ListCategoryButtonProps => {
  const searchGroupLabelMapping = useSearchGroupLabelMapping()
  const categories = useAvailableCategories()

  // This filter ensures that only categories with a facetFilter that exists in desiredOrder are included
  const filteredCategories = categories.filter((category) =>
    desiredOrder.includes(searchGroupLabelMapping[category.facetFilter])
  )

  return filteredCategories
    .map((filteredCategory) => ({
      label: searchGroupLabelMapping?.[filteredCategory.facetFilter] || '',
      Icon: filteredCategory.icon,
      Illustration: filteredCategory.illustration,
      onPress() {
        onPressCategory(filteredCategory.facetFilter)
      },
      baseColor: filteredCategory.baseColor,
      gradients: filteredCategory.gradients,
    }))
    .sort((a, b) => {
      const indexCategoryA = desiredOrder.indexOf(a.label)
      const indexCategoryB = desiredOrder.indexOf(b.label)
      return indexCategoryA - indexCategoryB
    })
}
