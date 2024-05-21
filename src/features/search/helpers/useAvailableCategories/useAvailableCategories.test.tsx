import { SearchGroupNameEnumv2 } from 'api/gen'
import { SearchCategoriesIllustrations } from 'features/search/enums'
import { useAvailableCategories } from 'features/search/helpers/useAvailableCategories/useAvailableCategories'
import { mockAvailableCategories } from 'libs/subcategories/fixtures/availableCategories'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { theme } from 'theme'
import { categoriesIcons } from 'ui/svg/icons/bicolor/exports/categoriesIcons'

let mockData = PLACEHOLDER_DATA
jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: mockData,
  }),
}))

describe('useAvailableCategories', () => {
  it('should all availables categories', () => {
    const categories = useAvailableCategories(mockAvailableCategories)

    expect(categories).toHaveLength(13)
    expect(categories).toEqual(
      expect.arrayContaining([
        {
          icon: categoriesIcons.Palette,
          illustration: SearchCategoriesIllustrations.ArtsCrafts,
          facetFilter: SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS,
          baseColor: theme.colors.lilacDark,
          gradients: [theme.colors.lilac, theme.colors.lilacDark],
          position: 5,
          textColor: theme.colors.deepPinkDark,
          borderColor: theme.colors.lilac,
          fillColor: theme.colors.lilacLight,
        },
        {
          icon: categoriesIcons.Card,
          illustration: SearchCategoriesIllustrations.YouthCards,
          facetFilter: SearchGroupNameEnumv2.CARTES_JEUNES,
          baseColor: theme.colors.lilacDark,
          gradients: [theme.colors.lilac, theme.colors.lilacDark],
          position: 11,
          textColor: theme.colors.skyBlueDark,
          borderColor: theme.colors.coral,
          fillColor: theme.colors.coralLight,
        },
        {
          icon: categoriesIcons.Disk,
          illustration: SearchCategoriesIllustrations.CDVinylsOnlineMusic,
          facetFilter: SearchGroupNameEnumv2.CD_VINYLE_MUSIQUE_EN_LIGNE,
          baseColor: theme.colors.skyBlueDark,
          gradients: [theme.colors.skyBlue, theme.colors.skyBlueDark],
          position: 4,
          textColor: theme.colors.coralDark,
          borderColor: theme.colors.skyBlue,
          fillColor: theme.colors.skyBlueLight,
        },
        {
          icon: categoriesIcons.Conference,
          illustration: SearchCategoriesIllustrations.ConcertsFestivals,
          facetFilter: SearchGroupNameEnumv2.CONCERTS_FESTIVALS,
          baseColor: theme.colors.goldDark,
          gradients: [theme.colors.gold, theme.colors.goldDark],
          position: 1,
          textColor: theme.colors.deepPinkDark,
          borderColor: theme.colors.goldLight200,
          fillColor: theme.colors.goldLight100,
        },
        {
          icon: categoriesIcons.Microphone,
          illustration: SearchCategoriesIllustrations.ConferencesMeetings,
          facetFilter: SearchGroupNameEnumv2.RENCONTRES_CONFERENCES,
          baseColor: theme.colors.goldDark,
          gradients: [theme.colors.gold, theme.colors.goldDark],
          position: 12,
          textColor: theme.colors.aquamarineDark,
          borderColor: theme.colors.deepPink,
          fillColor: theme.colors.deepPinkLight,
        },
        {
          icon: categoriesIcons.LiveEvent,
          illustration: SearchCategoriesIllustrations.OnlineEvents,
          facetFilter: SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE,
          baseColor: theme.colors.aquamarineDark,
          gradients: [theme.colors.aquamarine, theme.colors.aquamarineDark],
          position: 13,
          textColor: theme.colors.lilacDark,
          borderColor: theme.colors.aquamarineDark,
          fillColor: theme.colors.aquamarineLight,
        },
        {
          icon: categoriesIcons.Cinema,
          illustration: SearchCategoriesIllustrations.FilmsSeriesCinema,
          facetFilter: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
          baseColor: theme.colors.aquamarineDark,
          gradients: [theme.colors.aquamarine, theme.colors.aquamarineDark],
          position: 2,
          textColor: theme.colors.skyBlueDark,
          borderColor: theme.colors.coral,
          fillColor: theme.colors.coralLight,
        },
        {
          icon: categoriesIcons.Instrument,
          illustration: SearchCategoriesIllustrations.MusicalInstruments,
          facetFilter: SearchGroupNameEnumv2.INSTRUMENTS,
          baseColor: theme.colors.skyBlueDark,
          gradients: [theme.colors.skyBlue, theme.colors.skyBlueDark],
          position: 9,
          textColor: theme.colors.deepPinkDark,
          borderColor: theme.colors.lilac,
          fillColor: theme.colors.lilacLight,
        },
        {
          icon: categoriesIcons.VideoGame,
          illustration: SearchCategoriesIllustrations.GamesVideoGames,
          facetFilter: SearchGroupNameEnumv2.JEUX_JEUX_VIDEOS,
          baseColor: theme.colors.goldDark,
          gradients: [theme.colors.gold, theme.colors.goldDark],
          position: 8,
          textColor: theme.colors.deepPinkDark,
          borderColor: theme.colors.goldLight200,
          fillColor: theme.colors.goldLight100,
        },
        {
          icon: categoriesIcons.Book,
          illustration: SearchCategoriesIllustrations.Books,
          facetFilter: SearchGroupNameEnumv2.LIVRES,
          baseColor: theme.colors.deepPinkDark,
          gradients: [theme.colors.deepPink, theme.colors.deepPinkDark],
          position: 3,
          textColor: theme.colors.aquamarineDark,
          borderColor: theme.colors.deepPink,
          fillColor: theme.colors.deepPinkLight,
        },
        {
          icon: categoriesIcons.Press,
          illustration: SearchCategoriesIllustrations.MediaPress,
          facetFilter: SearchGroupNameEnumv2.MEDIA_PRESSE,
          baseColor: theme.colors.deepPinkDark,
          gradients: [theme.colors.deepPink, theme.colors.deepPinkDark],
          position: 10,
          textColor: theme.colors.skyBlueDark,
          borderColor: theme.colors.skyBlue,
          fillColor: theme.colors.skyBlueLight,
        },
        {
          icon: categoriesIcons.Museum,
          illustration: SearchCategoriesIllustrations.MuseumCulturalVisits,
          facetFilter: SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES,
          baseColor: theme.colors.aquamarineDark,
          gradients: [theme.colors.aquamarine, theme.colors.aquamarineDark],
          position: 7,
          textColor: theme.colors.lilacDark,
          borderColor: theme.colors.aquamarineDark,
          fillColor: theme.colors.aquamarineLight,
        },
        {
          icon: categoriesIcons.Show,
          illustration: SearchCategoriesIllustrations.Shows,
          facetFilter: SearchGroupNameEnumv2.SPECTACLES,
          baseColor: theme.colors.coralDark,
          gradients: [theme.colors.coral, theme.colors.coralDark],
          position: 6,
          textColor: theme.colors.skyBlueDark,
          borderColor: theme.colors.coral,
          fillColor: theme.colors.coralLight,
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
    const categories = useAvailableCategories(mockAvailableCategories)

    expect(categories).toEqual([
      {
        icon: categoriesIcons.Palette,
        illustration: SearchCategoriesIllustrations.ArtsCrafts,
        facetFilter: SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS,
        baseColor: theme.colors.lilacDark,
        gradients: [theme.colors.lilac, theme.colors.lilacDark],
        position: 5,
        textColor: theme.colors.deepPinkDark,
        borderColor: theme.colors.lilac,
        fillColor: theme.colors.lilacLight,
      },
      {
        icon: categoriesIcons.Card,
        illustration: SearchCategoriesIllustrations.YouthCards,
        facetFilter: SearchGroupNameEnumv2.CARTES_JEUNES,
        baseColor: theme.colors.lilacDark,
        gradients: [theme.colors.lilac, theme.colors.lilacDark],
        position: 11,
        textColor: theme.colors.skyBlueDark,
        borderColor: theme.colors.coral,
        fillColor: theme.colors.coralLight,
      },
    ])
  })

  it('should return empty array when no categories from backend', () => {
    mockData = {
      ...mockData,
      searchGroups: [],
    }
    const categories = useAvailableCategories(mockAvailableCategories)

    expect(categories).toEqual([])
  })
})
