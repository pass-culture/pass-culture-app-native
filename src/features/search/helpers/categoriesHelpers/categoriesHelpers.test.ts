import { NativeCategoryIdEnumv2, SearchGroupNameEnumv2 } from 'api/gen'
import {
  getNativeCategories,
  getSearchGroupsByAlphabeticalSorting,
  isOnlyOnline,
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

  describe('isOnlyOnline', () => {
    it('should return undefined when category and native category are undefined', () => {
      const value = isOnlyOnline(mockData)
      expect(value).toEqual(undefined)
    })

    describe('Category', () => {
      it('should return true when all native categories of the category are online platform', () => {
        const value = isOnlyOnline(mockData, SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE)
        expect(value).toEqual(true)
      })

      it('should return undefined when all native categories of the category are offline', () => {
        const value = isOnlyOnline(mockData, SearchGroupNameEnumv2.BIBLIOTHEQUES_MEDIATHEQUE)
        expect(value).toEqual(undefined)
      })

      it('should return undefined when native categories of the category are online and offline platform', () => {
        const value = isOnlyOnline(mockData, SearchGroupNameEnumv2.SPECTACLES)
        expect(value).toEqual(undefined)
      })

      it('should return undefined when native categories of the category are online, offline and online or offline platform', () => {
        const value = isOnlyOnline(mockData, SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS)
        expect(value).toEqual(undefined)
      })
    })

    describe('Native category', () => {
      it('should return true when all pro subcategories of the native category are online platform', () => {
        const value = isOnlyOnline(
          mockData,
          undefined,
          NativeCategoryIdEnumv2.PRATIQUE_ARTISTIQUE_EN_LIGNE
        )
        expect(value).toEqual(true)
      })

      it('should return undefined when all pro subcategories of the native category are offline', () => {
        const value = isOnlyOnline(
          mockData,
          undefined,
          NativeCategoryIdEnumv2.ACHAT_LOCATION_INSTRUMENT
        )
        expect(value).toEqual(undefined)
      })

      it('should return undefined when pro subcategories of the native category are online and offline platform', () => {
        const value = isOnlyOnline(mockData, undefined, NativeCategoryIdEnumv2.VISITES_CULTURELLES)
        expect(value).toEqual(undefined)
      })

      it('should return undefined when pro subcategories of the native category are offline and online or offline platform', () => {
        const value = isOnlyOnline(mockData, undefined, NativeCategoryIdEnumv2.ARTS_VISUELS)
        expect(value).toEqual(undefined)
      })
    })
  })
})
