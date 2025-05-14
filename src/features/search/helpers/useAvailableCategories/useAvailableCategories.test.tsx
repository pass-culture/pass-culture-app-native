import { SearchGroupNameEnumv2 } from 'api/gen'
import { SearchCategoriesIllustrations } from 'features/search/enums'
import { useAvailableCategories } from 'features/search/helpers/useAvailableCategories/useAvailableCategories'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { categoriesIcons } from 'ui/svg/icons/bicolor/exports/categoriesIcons'
import { gradientColorsMapping } from 'ui/theme/gradientColorsMapping'

let mockData = PLACEHOLDER_DATA
jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
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
          icon: categoriesIcons.Conference,
          illustration: SearchCategoriesIllustrations.ConcertsFestivals,
          facetFilter: SearchGroupNameEnumv2.CONCERTS_FESTIVALS,
          position: 1,
          gradients: gradientColorsMapping.Gold,
          borderColor: 'decorative03',
          fillColor: 'decorative03',
        },
        {
          icon: categoriesIcons.Cinema,
          illustration: SearchCategoriesIllustrations.FilmsSeriesCinema,
          facetFilter: SearchGroupNameEnumv2.CINEMA,
          position: 2,
          gradients: gradientColorsMapping.SkyBlue,
          borderColor: 'decorative01',
          fillColor: 'decorative01',
        },
        {
          icon: categoriesIcons.Cinema,
          illustration: SearchCategoriesIllustrations.FilmsSeriesCinema,
          facetFilter: SearchGroupNameEnumv2.FILMS_DOCUMENTAIRES_SERIES,
          position: 3,
          gradients: gradientColorsMapping.Lilac,
          borderColor: 'decorative02',
          fillColor: 'decorative02',
        },
        {
          icon: categoriesIcons.Book,
          illustration: SearchCategoriesIllustrations.Books,
          facetFilter: SearchGroupNameEnumv2.LIVRES,
          position: 4,
          gradients: gradientColorsMapping.Gold,
          borderColor: 'decorative05',
          fillColor: 'decorative05',
        },
        {
          icon: categoriesIcons.Disk,
          illustration: SearchCategoriesIllustrations.CDVinylsOnlineMusic,
          facetFilter: SearchGroupNameEnumv2.MUSIQUE,
          position: 5,
          gradients: gradientColorsMapping.Coral,
          borderColor: 'decorative04',
          fillColor: 'decorative04',
        },
        {
          icon: categoriesIcons.Palette,
          illustration: SearchCategoriesIllustrations.ArtsCrafts,
          facetFilter: SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS,
          position: 6,
          gradients: gradientColorsMapping.DeepPink,
          borderColor: 'decorative03',
          fillColor: 'decorative03',
        },
        {
          icon: categoriesIcons.Show,
          illustration: SearchCategoriesIllustrations.Shows,
          facetFilter: SearchGroupNameEnumv2.SPECTACLES,
          position: 7,
          gradients: gradientColorsMapping.Aquamarine,
          borderColor: 'decorative01',
          fillColor: 'decorative01',
        },
        {
          icon: categoriesIcons.Museum,
          illustration: SearchCategoriesIllustrations.MuseumCulturalVisits,
          facetFilter: SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES,
          position: 8,
          gradients: gradientColorsMapping.SkyBlue,
          borderColor: 'decorative02',
          fillColor: 'decorative02',
        },
        {
          icon: categoriesIcons.VideoGame,
          illustration: SearchCategoriesIllustrations.GamesVideoGames,
          facetFilter: SearchGroupNameEnumv2.JEUX_JEUX_VIDEOS,
          position: 9,
          gradients: gradientColorsMapping.Lilac,
          borderColor: 'decorative05',
          fillColor: 'decorative05',
        },
        {
          icon: categoriesIcons.Press,
          illustration: SearchCategoriesIllustrations.MediaPress,
          facetFilter: SearchGroupNameEnumv2.MEDIA_PRESSE,
          position: 10,
          gradients: gradientColorsMapping.Gold,
          borderColor: 'decorative04',
          fillColor: 'decorative04',
        },
        {
          icon: categoriesIcons.Card,
          illustration: SearchCategoriesIllustrations.YouthCards,
          facetFilter: SearchGroupNameEnumv2.CARTES_JEUNES,
          position: 11,
          gradients: gradientColorsMapping.Gold,
          borderColor: 'decorative03',
          fillColor: 'decorative03',
        },
        {
          icon: categoriesIcons.Microphone,
          illustration: SearchCategoriesIllustrations.ConferencesMeetings,
          facetFilter: SearchGroupNameEnumv2.RENCONTRES_CONFERENCES,
          position: 12,
          gradients: gradientColorsMapping.DeepPink,
          borderColor: 'decorative01',
          fillColor: 'decorative01',
        },
        {
          icon: categoriesIcons.LiveEvent,
          illustration: SearchCategoriesIllustrations.OnlineEvents,
          position: 13,
          facetFilter: SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE,
          gradients: gradientColorsMapping.Gold,
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
        icon: categoriesIcons.Palette,
        illustration: SearchCategoriesIllustrations.ArtsCrafts,
        facetFilter: SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS,
        position: 6,
        gradients: gradientColorsMapping.DeepPink,
        borderColor: 'decorative03',
        fillColor: 'decorative03',
      },
      {
        icon: categoriesIcons.Card,
        illustration: SearchCategoriesIllustrations.YouthCards,
        facetFilter: SearchGroupNameEnumv2.CARTES_JEUNES,
        position: 11,
        gradients: gradientColorsMapping.Gold,
        borderColor: 'decorative03',
        fillColor: 'decorative03',
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
