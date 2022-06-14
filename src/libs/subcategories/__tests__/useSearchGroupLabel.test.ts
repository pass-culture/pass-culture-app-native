import { SearchGroupNameEnum } from 'api/gen'
import { useSearchGroupLabel } from 'libs/subcategories'

describe('useCategoryId', () => {
  it.each`
    SearchGroupName                                   | SearchGroupLabel
    ${SearchGroupNameEnum.FILMS_SERIES_CINEMA}        | ${'Films, séries'}
    ${SearchGroupNameEnum.CARTES_JEUNES}              | ${'Cartes jeunes'}
    ${SearchGroupNameEnum.FILMS_SERIES_CINEMA}        | ${'Cinéma'}
    ${SearchGroupNameEnum.CONFERENCE}                 | ${'Conférences, rencontres'}
    ${SearchGroupNameEnum.JEU}                        | ${'Jeux'}
    ${SearchGroupNameEnum.LIVRE}                      | ${'Livre'}
    ${SearchGroupNameEnum.MUSEES_VISITES_CULTURELLES} | ${'Visites, expositions'}
    ${SearchGroupNameEnum.CD_VINYLE_MUSIQUE_EN_LIGNE} | ${'Musique'}
    ${SearchGroupNameEnum.ARTS_LOISIRS_CREATIFS}      | ${'Cours, ateliers'}
    ${SearchGroupNameEnum.PRESSE}                     | ${'Presse, médias'}
    ${SearchGroupNameEnum.CONCERTS_FESTIVALS}         | ${'Spectacles'}
    ${SearchGroupNameEnum.INSTRUMENT}                 | ${'Instruments de musique'}
    ${SearchGroupNameEnum.MATERIEL}                   | ${'Beaux-Arts'}
    ${SearchGroupNameEnum.NONE}                       | ${'Toutes les catégories'}
  `(
    'useSearchGroupLabel($SearchGroupName) = $category',
    ({ SearchGroupName, SearchGroupLabel }) => {
      expect(useSearchGroupLabel(SearchGroupName)).toBe(SearchGroupLabel)
    }
  )
})
