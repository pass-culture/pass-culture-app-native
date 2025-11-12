import { SearchGroupNameEnumv2 } from 'api/gen'
import { ALL_CATEGORIES_LABEL } from 'features/search/constants'
import { useSearchGroupLabel } from 'libs/subcategories'
import { renderHook } from 'tests/utils'

jest.mock('queries/subcategories/useSubcategoriesQuery')

describe('useCategoryId', () => {
  it.each`
    SearchGroupName                                     | SearchGroupLabel
    ${SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS}      | ${'Arts & loisirs créatifs'}
    ${SearchGroupNameEnumv2.CARTES_JEUNES}              | ${'Cartes jeunes'}
    ${SearchGroupNameEnumv2.CONCERTS_FESTIVALS}         | ${'Concerts & festivals'}
    ${SearchGroupNameEnumv2.RENCONTRES_CONFERENCES}     | ${'Conférences & rencontres'}
    ${SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE}        | ${'Évènements en ligne'}
    ${SearchGroupNameEnumv2.CINEMA}                     | ${'Cinéma'}
    ${SearchGroupNameEnumv2.FILMS_DOCUMENTAIRES_SERIES} | ${'Films, séries et documentaires'}
    ${SearchGroupNameEnumv2.JEUX_JEUX_VIDEOS}           | ${'Jeux & jeux vidéos'}
    ${SearchGroupNameEnumv2.LIVRES}                     | ${'Livres'}
    ${SearchGroupNameEnumv2.MEDIA_PRESSE}               | ${'Médias & presse'}
    ${SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES} | ${'Musées & visites culturelles'}
    ${SearchGroupNameEnumv2.SPECTACLES}                 | ${'Spectacles'}
    ${SearchGroupNameEnumv2.NONE}                       | ${ALL_CATEGORIES_LABEL}
    ${undefined}                                        | ${ALL_CATEGORIES_LABEL}
  `(
    'useSearchGroupLabel($SearchGroupName) = $SearchGroupLabel',
    ({ SearchGroupName, SearchGroupLabel }) => {
      const { result: searchGroupLabel } = renderHook(() => useSearchGroupLabel(SearchGroupName))

      expect(searchGroupLabel.current).toBe(SearchGroupLabel)
    }
  )
})
