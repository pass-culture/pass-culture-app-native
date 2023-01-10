import { SearchGroupNameEnumv2 } from 'api/gen'
import {
  getNativeCategories,
  getSearchGroupsByAlphabeticalSorting,
} from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import { placeholderData as mockData } from 'libs/subcategories/placeholderData'

describe('categoriesHelpers', () => {
  it('should sort categories by alphabetical order', () => {
    const categories = getSearchGroupsByAlphabeticalSorting(mockData.searchGroups)
    expect(categories).toEqual([
      {
        name: 'ARTS_LOISIRS_CREATIFS',
        value: 'Arts & loisirs créatifs',
      },
      {
        name: 'BIBLIOTHEQUES_MEDIATHEQUE',
        value: 'Bibliothèques, Médiathèques',
      },
      {
        name: 'CARTES_JEUNES',
        value: 'Cartes jeunes',
      },
      {
        name: 'CD_VINYLE_MUSIQUE_EN_LIGNE',
        value: 'CD, vinyles, musique en ligne',
      },
      {
        name: 'CONCERTS_FESTIVALS',
        value: 'Concerts & festivals',
      },
      {
        name: 'RENCONTRES_CONFERENCES',
        value: 'Conférences & rencontres',
      },
      {
        name: 'EVENEMENTS_EN_LIGNE',
        value: 'Évènements en ligne',
      },
      {
        name: 'FILMS_SERIES_CINEMA',
        value: 'Films, séries, cinéma',
      },
      {
        name: 'INSTRUMENTS',
        value: 'Instruments de musique',
      },
      {
        name: 'JEUX_JEUX_VIDEOS',
        value: 'Jeux & jeux vidéos',
      },
      {
        name: 'LIVRES',
        value: 'Livres',
      },
      {
        name: 'MEDIA_PRESSE',
        value: 'Médias & presse',
      },
      {
        name: 'MUSEES_VISITES_CULTURELLES',
        value: 'Musées & visites culturelles',
      },
      {
        name: 'PLATEFORMES_EN_LIGNE',
        value: 'Plateformes en ligne',
      },
      {
        name: 'SPECTACLES',
        value: 'Spectacles',
      },
    ])
  })

  it('should sort native subcategories by alphabetical order', () => {
    const nativeSubcategories = getNativeCategories(
      mockData,
      SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS
    )
    expect(nativeSubcategories).toEqual([
      {
        genreType: null,
        name: 'ARTS_VISUELS',
        value: 'Arts visuels',
      },
      {
        genreType: null,
        name: 'MATERIELS_CREATIFS',
        value: 'Matériels créatifs',
      },
      {
        genreType: null,
        name: 'PRATIQUE_ARTISTIQUE_EN_LIGNE',
        value: 'Pratique artistique en ligne',
      },
      {
        genreType: null,
        name: 'PRATIQUES_ET_ATELIERS_ARTISTIQUES',
        value: 'Pratiques & ateliers artistiques',
      },
    ])
  })
})
