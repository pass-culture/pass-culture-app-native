import { SearchGroupNameEnumv2 } from 'api/gen'
import { useSearchGroupLabel } from 'libs/subcategories'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { renderHook } from 'tests/utils'

const mockSearchGroups = placeholderData.searchGroups
jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: {
      searchGroups: mockSearchGroups,
    },
  }),
}))

describe('useCategoryId', () => {
  it.each`
    SearchGroupName                                     | SearchGroupLabel
    ${SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS}      | ${'Arts & loisirs créatifs'}
    ${SearchGroupNameEnumv2.BIBLIOTHEQUES_MEDIATHEQUE}  | ${'Bibliothèques, Médiathèques'}
    ${SearchGroupNameEnumv2.CARTES_JEUNES}              | ${'Cartes jeunes'}
    ${SearchGroupNameEnumv2.CD_VINYLE_MUSIQUE_EN_LIGNE} | ${'CD, vinyles, musique en ligne'}
    ${SearchGroupNameEnumv2.CONCERTS_FESTIVALS}         | ${'Concerts & festivals'}
    ${SearchGroupNameEnumv2.RENCONTRES_CONFERENCES}     | ${'Conférences & rencontres'}
    ${SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE}        | ${'Évènements en ligne'}
    ${SearchGroupNameEnumv2.FILMS_SERIES_CINEMA}        | ${'Films, séries, cinéma'}
    ${SearchGroupNameEnumv2.INSTRUMENTS}                | ${'Instruments de musique'}
    ${SearchGroupNameEnumv2.JEUX_JEUX_VIDEOS}           | ${'Jeux & jeux vidéos'}
    ${SearchGroupNameEnumv2.LIVRES}                     | ${'Livres'}
    ${SearchGroupNameEnumv2.MEDIA_PRESSE}               | ${'Médias & presse'}
    ${SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES} | ${'Musées & visites culturelles'}
    ${SearchGroupNameEnumv2.SPECTACLES}                 | ${'Spectacles'}
    ${SearchGroupNameEnumv2.NONE}                       | ${'Toutes les catégories'}
  `(
    'useSearchGroupLabel($SearchGroupName) = $SearchGroupLabel',
    ({ SearchGroupName, SearchGroupLabel }) => {
      const { result: searchGroupLabel } = renderHook(() => useSearchGroupLabel(SearchGroupName))
      expect(searchGroupLabel.current).toBe(SearchGroupLabel)
    }
  )
})
