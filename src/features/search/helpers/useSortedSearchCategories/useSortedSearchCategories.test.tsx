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

    expect(result.current[11].label).toEqual('Médias & presse')
  })

  it('should set illustration for category', () => {
    const { result } = renderHook(useSortedSearchCategories, options)

    expect(result.current[11].Illustration).toEqual(SearchCategoriesIllustrations.MediaPress)
  })

  it('should sort search group names alphabetically', () => {
    const { result } = renderHook(useSortedSearchCategories, options)

    const actualCategoriesLabels = result.current.map((category) => category.label)
    expect(actualCategoriesLabels).toEqual([
      'Arts & loisirs créatifs',
      'Bibliothèques, Médiathèques',
      'Cartes jeunes',
      'CD, vinyles, musique en ligne',
      'Concerts & festivals',
      'Conférences & rencontres',
      'Évènements en ligne',
      'Films, séries, cinéma',
      'Instruments de musique',
      'Jeux & jeux vidéos',
      'Livres',
      'Médias & presse',
      'Musées & visites culturelles',
      'Spectacles',
    ])
  })
})
