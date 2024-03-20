import { GenreType, NativeCategoryIdEnumv2, SearchGroupNameEnumv2 } from 'api/gen'
import { initialSearchState } from 'features/search/context/reducer'
import { CategoriesModalView } from 'features/search/enums'
import {
  buildBookSearchPayloadValues,
  getDefaultFormView,
  getFacetTypeFromGenreTypeKey,
  getNativeCategories,
  getNativeCategoryFromEnum,
  getNbResultsFacetLabel,
  getSearchGroupsEnumArrayFromNativeCategoryEnum,
  isNativeCategoryOfCategory,
  isOnlyOnline,
  searchGroupOrNativeCategorySortComparator,
} from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import { createMappingTree } from 'features/search/helpers/categoriesHelpers/mapping-tree'
import { BooksNativeCategoriesEnum, SearchState } from 'features/search/types'
import { FACETS_FILTERS_ENUM } from 'libs/algolia/enums'
import { placeholderData as mockData } from 'libs/subcategories/placeholderData'

let mockSearchState: SearchState = {
  ...initialSearchState,
}

const mockedSubcateroriesV2Response = mockData
const mockedFacets = undefined
const mockedNewMappingEnabled = true

const tree = createMappingTree(mockedSubcateroriesV2Response, mockedFacets, mockedNewMappingEnabled)

describe('categoriesHelpers', () => {
  it('should sort categories by alphabetical order', () => {
    const categories = mockData.searchGroups
      .filter((category) => category.name !== SearchGroupNameEnumv2.NONE)
      .sort(searchGroupOrNativeCategorySortComparator)

    expect(categories).toEqual([
      {
        name: 'ARTS_LOISIRS_CREATIFS',
        value: 'Arts & loisirs créatifs',
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
        name: 'FILMS_SERIES_CINEMA',
        value: 'Cinéma, films et séries',
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
    it('should return false when category and native category are undefined', () => {
      const value = isOnlyOnline(mockData)

      expect(value).toEqual(false)
    })

    describe('Category', () => {
      it('should return true when all native categories of the category are online platform', () => {
        const value = isOnlyOnline(mockData, SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE)

        expect(value).toEqual(true)
      })

      it('should return false when all native categories of the category are offline', () => {
        const value = isOnlyOnline(mockData, SearchGroupNameEnumv2.LIVRES)

        expect(value).toEqual(false)
      })

      it('should return false when native categories of the category are online and offline platform', () => {
        const value = isOnlyOnline(mockData, SearchGroupNameEnumv2.SPECTACLES)

        expect(value).toEqual(false)
      })

      it('should return false when native categories of the category are online, offline and online or offline platform', () => {
        const value = isOnlyOnline(mockData, SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS)

        expect(value).toEqual(false)
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

      it('should return false when all pro subcategories of the native category are offline', () => {
        const value = isOnlyOnline(
          mockData,
          undefined,
          NativeCategoryIdEnumv2.ACHAT_LOCATION_INSTRUMENT
        )

        expect(value).toEqual(false)
      })

      it('should return false when pro subcategories of the native category are online and offline platform', () => {
        const value = isOnlyOnline(mockData, undefined, NativeCategoryIdEnumv2.VISITES_CULTURELLES)

        expect(value).toEqual(false)
      })

      it('should return false when pro subcategories of the native category are offline and online or offline platform', () => {
        const value = isOnlyOnline(mockData, undefined, NativeCategoryIdEnumv2.ARTS_VISUELS)

        expect(value).toEqual(false)
      })
    })
  })

  describe('getNativeCategoryFromEnum', () => {
    it('should return undefined when subcategories API return undefined data', () => {
      const value = getNativeCategoryFromEnum(undefined, NativeCategoryIdEnumv2.ARTS_VISUELS)

      expect(value).toEqual(undefined)
    })

    it('should return undefined when native category id is undefined', () => {
      const value = getNativeCategoryFromEnum(mockData, undefined)

      expect(value).toEqual(undefined)
    })

    it('should return the native category from native category id', () => {
      const value = getNativeCategoryFromEnum(mockData, NativeCategoryIdEnumv2.ARTS_VISUELS)

      expect(value).toEqual({ genreType: null, name: 'ARTS_VISUELS', value: 'Arts visuels' })
    })
  })

  describe('getSearchGroupsEnumArrayFromNativeCategoryEnum', () => {
    describe('should return an empty array', () => {
      it('when no data from backend', () => {
        const value = getSearchGroupsEnumArrayFromNativeCategoryEnum()

        expect(value).toEqual([])
      })

      it('without native category in parameter', () => {
        const value = getSearchGroupsEnumArrayFromNativeCategoryEnum(mockData)

        expect(value).toEqual([])
      })
    })

    it('should return an array of categories id', () => {
      const value = getSearchGroupsEnumArrayFromNativeCategoryEnum(
        mockData,
        NativeCategoryIdEnumv2.ARTS_VISUELS
      )

      expect(value).toEqual([
        SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES,
        SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS,
      ])
    })
  })

  describe('isNativeCategoryOfCategory', () => {
    it('should return false when no data from backend', () => {
      const value = isNativeCategoryOfCategory()

      expect(value).toEqual(false)
    })

    it('should return false when native category not associated to category', () => {
      const value = isNativeCategoryOfCategory(
        mockData,
        SearchGroupNameEnumv2.CONCERTS_FESTIVALS,
        NativeCategoryIdEnumv2.ACHAT_LOCATION_INSTRUMENT
      )

      expect(value).toEqual(false)
    })

    it('should return true when native category associated to category', () => {
      const value = isNativeCategoryOfCategory(
        mockData,
        SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS,
        NativeCategoryIdEnumv2.ARTS_VISUELS
      )

      expect(value).toEqual(true)
    })
  })

  describe('getDefaultFormView', () => {
    describe('should render categories view', () => {
      it('by default when no category selected', () => {
        mockSearchState = {
          ...mockSearchState,
          offerCategories: [],
        }

        expect(getDefaultFormView(tree, mockSearchState)).toEqual(CategoriesModalView.CATEGORIES)
      })

      it('when category selected is "Cartes jeunes" because it does not native categories', () => {
        mockSearchState = {
          ...mockSearchState,
          offerCategories: [SearchGroupNameEnumv2.CARTES_JEUNES],
        }

        expect(getDefaultFormView(tree, mockSearchState)).toEqual(CategoriesModalView.CATEGORIES)
      })
    })

    describe('should render native categories view', () => {
      it('when category that is not "Cartes jeunes" because the native category view includes "Tout" choice selected', () => {
        mockSearchState = {
          ...mockSearchState,
          offerCategories: [SearchGroupNameEnumv2.LIVRES],
          offerNativeCategories: [],
        }

        expect(getDefaultFormView(tree, mockSearchState)).toEqual(
          CategoriesModalView.NATIVE_CATEGORIES
        )
      })

      it('when a category that is not "Cartes jeunes" and a native category that it has not genre type selected', () => {
        mockSearchState = {
          ...mockSearchState,
          offerCategories: [SearchGroupNameEnumv2.LIVRES],
          offerNativeCategories: [NativeCategoryIdEnumv2.LIVRES_AUDIO_PHYSIQUES],
        }

        expect(getDefaultFormView(tree, mockSearchState)).toEqual(
          CategoriesModalView.NATIVE_CATEGORIES
        )
      })
    })

    describe('should render genre type categories view', () => {
      it('when a category, a native category that it has genre type selected', () => {
        mockSearchState = {
          ...mockSearchState,
          offerCategories: [SearchGroupNameEnumv2.SPECTACLES],
          offerNativeCategories: [NativeCategoryIdEnumv2.SPECTACLES_REPRESENTATIONS],
        }

        expect(getDefaultFormView(tree, mockSearchState)).toEqual(CategoriesModalView.GENRES)
      })

      it('when a category, a native category, a genre type categories selected', () => {
        mockSearchState = {
          ...mockSearchState,
          offerCategories: [SearchGroupNameEnumv2.LIVRES],
          offerNativeCategories: [NativeCategoryIdEnumv2.LIVRES_PAPIER],
          offerGenreTypes: [
            { key: GenreType.BOOK, name: 'Bandes dessinées', value: 'Bandes dessinées' },
          ],
        }

        expect(getDefaultFormView(tree, mockSearchState)).toEqual(CategoriesModalView.GENRES)
      })
    })
  })

  describe('getFacetTypeFromGenreTypeKey', () => {
    it('should return OFFER_BOOK_TYPE for "BOOK"', () => {
      const result = getFacetTypeFromGenreTypeKey(GenreType.BOOK)

      expect(result).toEqual(FACETS_FILTERS_ENUM.OFFER_BOOK_TYPE)
    })

    it('should return OFFER_MUSIC_TYPE for "MUSIC"', () => {
      const result = getFacetTypeFromGenreTypeKey(GenreType.MUSIC)

      expect(result).toEqual(FACETS_FILTERS_ENUM.OFFER_MUSIC_TYPE)
    })

    it('should return OFFER_SHOW_TYPE for "SHOW"', () => {
      const result = getFacetTypeFromGenreTypeKey(GenreType.SHOW)

      expect(result).toEqual(FACETS_FILTERS_ENUM.OFFER_SHOW_TYPE)
    })

    it('should return OFFER_MOVIE_GENRES for "MOVIE"', () => {
      const result = getFacetTypeFromGenreTypeKey(GenreType.MOVIE)

      expect(result).toEqual(FACETS_FILTERS_ENUM.OFFER_MOVIE_GENRES)
    })
  })

  describe('getNbResultsFacetLabel', () => {
    it('should display "+10000" when the number of result facets is greater than 10000', () => {
      const result = getNbResultsFacetLabel(10001)

      expect(result).toEqual('+10000')
    })

    it('should display the exact number of result facets is less than 10000', () => {
      const result = getNbResultsFacetLabel(5)

      expect(result).toEqual('5')
    })

    it('should display "0" when the number of result facets is equal to 0', () => {
      const result = getNbResultsFacetLabel(0)

      expect(result).toEqual('0')
    })

    it('should return undefined when the number of result facets is undefined', () => {
      const result = getNbResultsFacetLabel(undefined)

      expect(result).toEqual(undefined)
    })
  })

  describe('buildBookSearchPayloadValues', () => {
    it('should return search payload for a book native category level', () => {
      const mockedForm = {
        category: SearchGroupNameEnumv2.LIVRES,
        nativeCategory: BooksNativeCategoriesEnum.MANGAS,
        currentView: CategoriesModalView.CATEGORIES,
        genreType: null,
      }

      const result = buildBookSearchPayloadValues(mockData, mockedForm)

      expect(result).toEqual({
        offerCategories: [SearchGroupNameEnumv2.LIVRES],
        offerNativeCategories: [BooksNativeCategoriesEnum.MANGAS],
        offerGenreTypes: undefined,
        gtls: [
          {
            code: '03040300',
            label: 'Kodomo',
            level: 3,
          },
          {
            code: '03040400',
            label: 'Shôjo',
            level: 3,
          },
          {
            code: '03040500',
            label: 'Shonen',
            level: 3,
          },
          {
            code: '03040700',
            label: 'Josei',
            level: 3,
          },
          {
            code: '03040800',
            label: 'Yaoi',
            level: 3,
          },
          {
            code: '03040900',
            label: 'Yuri',
            level: 3,
          },
        ],
      })
    })

    it('should return search payload for a book genre type level', () => {
      const mockedForm = {
        category: SearchGroupNameEnumv2.LIVRES,
        nativeCategory: BooksNativeCategoriesEnum.MANGAS,
        currentView: CategoriesModalView.GENRES,
        genreType: 'KODOMO',
      }

      const result = buildBookSearchPayloadValues(mockData, mockedForm)

      expect(result).toEqual({
        offerCategories: [SearchGroupNameEnumv2.LIVRES],
        offerNativeCategories: [BooksNativeCategoriesEnum.MANGAS],
        offerGenreTypes: [
          {
            key: GenreType.BOOK,
            name: 'KODOMO',
            value: 'Kodomo',
          },
        ],
        gtls: [
          {
            code: '03040300',
            label: 'Kodomo',
            level: 3,
          },
        ],
      })
    })
  })
})
