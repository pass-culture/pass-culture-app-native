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
          baseColor: theme.colors.lilac,
          gradients: [theme.colors.lilacLight, theme.colors.lilac],
          position: 5,
          textColor: theme.colors.deepPink,
          borderColor: theme.colors.lilacLight,
          fillColor: theme.colors.lilacLighter,
        },
        {
          icon: categoriesIcons.Card,
          illustration: SearchCategoriesIllustrations.YouthCards,
          facetFilter: SearchGroupNameEnumv2.CARTES_JEUNES,
          baseColor: theme.colors.lilac,
          gradients: [theme.colors.lilacLight, theme.colors.lilac],
          position: 11,
          textColor: theme.colors.skyBlue,
          borderColor: theme.colors.coralLight,
          fillColor: theme.colors.coralLighter,
        },
        {
          icon: categoriesIcons.Disk,
          illustration: SearchCategoriesIllustrations.CDVinylsOnlineMusic,
          facetFilter: SearchGroupNameEnumv2.CD_VINYLE_MUSIQUE_EN_LIGNE,
          baseColor: theme.colors.skyBlue,
          gradients: [theme.colors.skyBlueLight, theme.colors.skyBlue],
          position: 4,
          textColor: theme.colors.coral,
          borderColor: theme.colors.skyBlueLight,
          fillColor: theme.colors.skyBlueLighter,
        },
        {
          icon: categoriesIcons.Conference,
          illustration: SearchCategoriesIllustrations.ConcertsFestivals,
          facetFilter: SearchGroupNameEnumv2.CONCERTS_FESTIVALS,
          baseColor: theme.colors.gold,
          gradients: [theme.colors.goldLight, theme.colors.gold],
          position: 1,
          textColor: theme.colors.deepPink,
          borderColor: theme.colors.goldLighter,
          fillColor: theme.colors.goldLightest,
        },
        {
          icon: categoriesIcons.Microphone,
          illustration: SearchCategoriesIllustrations.ConferencesMeetings,
          facetFilter: SearchGroupNameEnumv2.RENCONTRES_CONFERENCES,
          baseColor: theme.colors.gold,
          gradients: [theme.colors.goldLight, theme.colors.gold],
          position: 12,
          textColor: theme.colors.aquamarine,
          borderColor: theme.colors.deepPinkLight,
          fillColor: theme.colors.deepPinkLighter,
        },
        {
          icon: categoriesIcons.LiveEvent,
          illustration: SearchCategoriesIllustrations.OnlineEvents,
          facetFilter: SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE,
          baseColor: theme.colors.aquamarine,
          gradients: [theme.colors.aquamarineLight, theme.colors.aquamarine],
          position: 13,
          textColor: theme.colors.lilac,
          borderColor: theme.colors.aquamarine,
          fillColor: theme.colors.aquamarineLighter,
        },
        {
          icon: categoriesIcons.Cinema,
          illustration: SearchCategoriesIllustrations.FilmsSeriesCinema,
          facetFilter: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
          baseColor: theme.colors.aquamarine,
          gradients: [theme.colors.aquamarineLight, theme.colors.aquamarine],
          position: 2,
          textColor: theme.colors.skyBlue,
          borderColor: theme.colors.coralLight,
          fillColor: theme.colors.coralLighter,
        },
        {
          icon: categoriesIcons.Instrument,
          illustration: SearchCategoriesIllustrations.MusicalInstruments,
          facetFilter: SearchGroupNameEnumv2.INSTRUMENTS,
          baseColor: theme.colors.skyBlue,
          gradients: [theme.colors.skyBlueLight, theme.colors.skyBlue],
          position: 9,
          textColor: theme.colors.deepPink,
          borderColor: theme.colors.lilacLight,
          fillColor: theme.colors.lilacLighter,
        },
        {
          icon: categoriesIcons.VideoGame,
          illustration: SearchCategoriesIllustrations.GamesVideoGames,
          facetFilter: SearchGroupNameEnumv2.JEUX_JEUX_VIDEOS,
          baseColor: theme.colors.gold,
          gradients: [theme.colors.goldLight, theme.colors.gold],
          position: 8,
          textColor: theme.colors.deepPink,
          borderColor: theme.colors.goldLighter,
          fillColor: theme.colors.goldLightest,
        },
        {
          icon: categoriesIcons.Book,
          illustration: SearchCategoriesIllustrations.Books,
          facetFilter: SearchGroupNameEnumv2.LIVRES,
          baseColor: theme.colors.deepPink,
          gradients: [theme.colors.deepPinkLight, theme.colors.deepPink],
          position: 3,
          textColor: theme.colors.aquamarine,
          borderColor: theme.colors.deepPinkLight,
          fillColor: theme.colors.deepPinkLighter,
        },
        {
          icon: categoriesIcons.Press,
          illustration: SearchCategoriesIllustrations.MediaPress,
          facetFilter: SearchGroupNameEnumv2.MEDIA_PRESSE,
          baseColor: theme.colors.deepPink,
          gradients: [theme.colors.deepPinkLight, theme.colors.deepPink],
          position: 10,
          textColor: theme.colors.skyBlue,
          borderColor: theme.colors.skyBlueLight,
          fillColor: theme.colors.skyBlueLighter,
        },
        {
          icon: categoriesIcons.Museum,
          illustration: SearchCategoriesIllustrations.MuseumCulturalVisits,
          facetFilter: SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES,
          baseColor: theme.colors.aquamarine,
          gradients: [theme.colors.aquamarineLight, theme.colors.aquamarine],
          position: 7,
          textColor: theme.colors.lilac,
          borderColor: theme.colors.aquamarine,
          fillColor: theme.colors.aquamarineLighter,
        },
        {
          icon: categoriesIcons.Show,
          illustration: SearchCategoriesIllustrations.Shows,
          facetFilter: SearchGroupNameEnumv2.SPECTACLES,
          baseColor: theme.colors.coral,
          gradients: [theme.colors.coralLight, theme.colors.coral],
          position: 6,
          textColor: theme.colors.skyBlue,
          borderColor: theme.colors.coralLight,
          fillColor: theme.colors.coralLighter,
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
        baseColor: theme.colors.lilac,
        gradients: [theme.colors.lilacLight, theme.colors.lilac],
        position: 5,
        textColor: theme.colors.deepPink,
        borderColor: theme.colors.lilacLight,
        fillColor: theme.colors.lilacLighter,
      },
      {
        icon: categoriesIcons.Card,
        illustration: SearchCategoriesIllustrations.YouthCards,
        facetFilter: SearchGroupNameEnumv2.CARTES_JEUNES,
        baseColor: theme.colors.lilac,
        gradients: [theme.colors.lilacLight, theme.colors.lilac],
        position: 11,
        textColor: theme.colors.skyBlue,
        borderColor: theme.colors.coralLight,
        fillColor: theme.colors.coralLighter,
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
