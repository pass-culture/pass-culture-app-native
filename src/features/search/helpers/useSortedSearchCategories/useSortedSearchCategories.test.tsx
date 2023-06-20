import { SearchCategoriesIllustrations } from 'features/internal/cheatcodes/pages/AppComponents/illustrationsExports'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { renderHook } from 'tests/utils'

import { useSortedSearchCategories } from './useSortedSearchCategories'

const mockData = placeholderData
jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: mockData,
  }),
}))

describe('useSortedSearchCategories', () => {
  const options = { initialProps: jest.fn() }

  it('should return all categories', () => {
    const { result } = renderHook(useSortedSearchCategories, options)

    expect(result.current.length).toEqual(14)
  })

  it("should format category's label", () => {
    const { result } = renderHook(useSortedSearchCategories, options)

    expect(result.current[11].label).toEqual('Cartes jeunes')
  })

  it('should set illustration for category', () => {
    const { result } = renderHook(useSortedSearchCategories, options)

    expect(result.current[11].Illustration).toEqual(SearchCategoriesIllustrations.YouthCards)
  })

  it('should sort search group names according to desired order', () => {
    const { result } = renderHook(useSortedSearchCategories, options)

    const actualCategoriesLabels = result.current.map((category) => category.label)
    expect(actualCategoriesLabels).toEqual([
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
    ])
  })
})
