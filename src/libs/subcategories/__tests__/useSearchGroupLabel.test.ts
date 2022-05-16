import { SearchGroupNameEnum } from 'api/gen'
import { useSearchGroupLabel } from 'libs/subcategories'

describe('useCategoryId', () => {
  it.each`
    SearchGroupName                     | SearchGroupLabel
    ${SearchGroupNameEnum.FILM}         | ${'Films, séries'}
    ${SearchGroupNameEnum.CARTE_JEUNES} | ${'Carte jeunes'}
    ${SearchGroupNameEnum.CINEMA}       | ${'Cinéma'}
    ${SearchGroupNameEnum.CONFERENCE}   | ${'Conférences, rencontres'}
    ${SearchGroupNameEnum.JEU}          | ${'Jeux'}
    ${SearchGroupNameEnum.LIVRE}        | ${'Livre'}
    ${SearchGroupNameEnum.VISITE}       | ${'Visites, expositions'}
    ${SearchGroupNameEnum.MUSIQUE}      | ${'Musique'}
    ${SearchGroupNameEnum.COURS}        | ${'Cours, ateliers'}
    ${SearchGroupNameEnum.PRESSE}       | ${'Presse, médias'}
    ${SearchGroupNameEnum.SPECTACLE}    | ${'Spectacles'}
    ${SearchGroupNameEnum.INSTRUMENT}   | ${'Instruments de musique'}
    ${SearchGroupNameEnum.MATERIEL}     | ${'Beaux-Arts'}
    ${SearchGroupNameEnum.NONE}         | ${'Toutes les catégories'}
  `(
    'useSearchGroupLabel($SearchGroupName) = $category',
    ({ SearchGroupName, SearchGroupLabel }) => {
      expect(useSearchGroupLabel(SearchGroupName)).toBe(SearchGroupLabel)
    }
  )
})
