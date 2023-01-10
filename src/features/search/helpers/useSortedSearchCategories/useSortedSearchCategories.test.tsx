import { renderHook } from 'tests/utils'
import { categoriesIcons } from 'ui/svg/icons/bicolor/exports/categoriesIcons'

import { useSortedSearchCategories } from './useSortedSearchCategories'

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

  it('should set icon for category', () => {
    const { result } = renderHook(useSortedSearchCategories, options)

    expect(result.current[11].Icon).toEqual(categoriesIcons.Press)
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
