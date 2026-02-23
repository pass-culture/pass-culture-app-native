import { SearchGroupNameEnumv2 } from 'api/gen'
import { SearchCategoriesIllustrations } from 'features/search/enums'
import { useAvailableCategories } from 'features/search/helpers/useAvailableCategories/useAvailableCategories'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { categoriesIcons } from 'ui/svg/icons/exports/categoriesIcons'

let mockData = PLACEHOLDER_DATA
jest.mock('queries/subcategories/useSubcategoriesQuery', () => ({
  useSubcategoriesQuery: () => ({
    data: mockData,
  }),
}))

describe('useAvailableCategories', () => {
  it('should all availables categories', () => {
    const categories = useAvailableCategories()

    expect(categories).toHaveLength(13)
    expect(categories).toEqual(
      expect.arrayContaining([
        {
          icon: categoriesIcons.Card,
          illustration: SearchCategoriesIllustrations.YouthCards,
          facetFilter: SearchGroupNameEnumv2.CARTES_JEUNES,
          searchLandingPosition: 11,
          filterModalPosition: 1,
          borderColor: 'decorative03',
          fillColor: 'decorative03',
        },
        {
          icon: categoriesIcons.Conference,
          illustration: SearchCategoriesIllustrations.ConcertsFestivals,
          facetFilter: SearchGroupNameEnumv2.CONCERTS_FESTIVALS,
          searchLandingPosition: 1,
          filterModalPosition: 2,
          borderColor: 'decorative03',
          fillColor: 'decorative03',
        },
        {
          icon: categoriesIcons.Cinema,
          illustration: SearchCategoriesIllustrations.FilmsSeriesCinema,
          facetFilter: SearchGroupNameEnumv2.CINEMA,
          searchLandingPosition: 2,
          filterModalPosition: 3,
          borderColor: 'decorative01',
          fillColor: 'decorative01',
        },
        {
          icon: categoriesIcons.Cinema,
          illustration: SearchCategoriesIllustrations.FilmsSeriesCinema,
          facetFilter: SearchGroupNameEnumv2.FILMS_DOCUMENTAIRES_SERIES,
          searchLandingPosition: 3,
          filterModalPosition: 4,
          borderColor: 'decorative02',
          fillColor: 'decorative02',
        },
        {
          icon: categoriesIcons.Book,
          illustration: SearchCategoriesIllustrations.Books,
          facetFilter: SearchGroupNameEnumv2.LIVRES,
          searchLandingPosition: 4,
          filterModalPosition: 5,
          borderColor: 'decorative05',
          fillColor: 'decorative05',
        },
        {
          icon: categoriesIcons.Disk,
          illustration: SearchCategoriesIllustrations.CDVinylsOnlineMusic,
          facetFilter: SearchGroupNameEnumv2.MUSIQUE,
          searchLandingPosition: 5,
          filterModalPosition: 6,
          borderColor: 'decorative04',
          fillColor: 'decorative04',
        },
        {
          icon: categoriesIcons.Palette,
          illustration: SearchCategoriesIllustrations.ArtsCrafts,
          facetFilter: SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS,
          searchLandingPosition: 6,
          filterModalPosition: 7,
          borderColor: 'decorative01',
          fillColor: 'decorative01',
        },
        {
          icon: categoriesIcons.Show,
          illustration: SearchCategoriesIllustrations.Shows,
          facetFilter: SearchGroupNameEnumv2.SPECTACLES,
          searchLandingPosition: 7,
          filterModalPosition: 8,
          borderColor: 'decorative05',
          fillColor: 'decorative05',
        },
        {
          icon: categoriesIcons.Museum,
          illustration: SearchCategoriesIllustrations.MuseumCulturalVisits,
          facetFilter: SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES,
          searchLandingPosition: 8,
          filterModalPosition: 9,
          borderColor: 'decorative03',
          fillColor: 'decorative03',
        },
        {
          icon: categoriesIcons.VideoGame,
          illustration: SearchCategoriesIllustrations.GamesVideoGames,
          facetFilter: SearchGroupNameEnumv2.JEUX_JEUX_VIDEOS,
          searchLandingPosition: 9,
          filterModalPosition: 10,
          borderColor: 'decorative04',
          fillColor: 'decorative04',
        },
        {
          icon: categoriesIcons.Press,
          illustration: SearchCategoriesIllustrations.MediaPress,
          facetFilter: SearchGroupNameEnumv2.MEDIA_PRESSE,
          searchLandingPosition: 10,
          filterModalPosition: 11,
          borderColor: 'decorative02',
          fillColor: 'decorative02',
        },
        {
          icon: categoriesIcons.Microphone,
          illustration: SearchCategoriesIllustrations.ConferencesMeetings,
          facetFilter: SearchGroupNameEnumv2.RENCONTRES_CONFERENCES,
          searchLandingPosition: 12,
          filterModalPosition: 12,
          borderColor: 'decorative01',
          fillColor: 'decorative01',
        },
        {
          icon: categoriesIcons.LiveEvent,
          illustration: SearchCategoriesIllustrations.OnlineEvents,
          searchLandingPosition: 13,
          filterModalPosition: 13,
          facetFilter: SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE,
          borderColor: 'decorative02',
          fillColor: 'decorative02',
        },
      ])
    )
  })

  it('should only available catégories from backend', () => {
    mockData = {
      ...mockData,
      searchGroups: [
        { name: SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS, value: 'Arts & loisirs créatifs' },
        { name: SearchGroupNameEnumv2.CARTES_JEUNES, value: 'Cartes jeunes' },
      ],
    }
    const categories = useAvailableCategories()

    expect(categories).toEqual([
      {
        icon: categoriesIcons.Card,
        illustration: SearchCategoriesIllustrations.YouthCards,
        facetFilter: SearchGroupNameEnumv2.CARTES_JEUNES,
        searchLandingPosition: 11,
        filterModalPosition: 1,
        borderColor: 'decorative03',
        fillColor: 'decorative03',
      },
      {
        icon: categoriesIcons.Palette,
        illustration: SearchCategoriesIllustrations.ArtsCrafts,
        facetFilter: SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS,
        searchLandingPosition: 6,
        filterModalPosition: 7,
        borderColor: 'decorative01',
        fillColor: 'decorative01',
      },
    ])
  })

  it('should return empty array when no categories from backend', () => {
    mockData = {
      ...mockData,
      searchGroups: [],
    }
    const categories = useAvailableCategories()

    expect(categories).toEqual([])
  })
})
