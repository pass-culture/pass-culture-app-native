import { SearchGroupNameEnumv2 } from 'api/gen'
import { SearchCategoriesIllustrations } from 'features/internal/cheatcodes/pages/AppComponents/illustrationsExports'
import { useAvailableCategories } from 'features/search/helpers/useAvailableCategories/useAvailableCategories'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { theme } from 'theme'
import { categoriesIcons } from 'ui/svg/icons/bicolor/exports/categoriesIcons'

let mockData = placeholderData
jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: mockData,
  }),
}))

describe('useAvailableCategories', () => {
  it('should all availables categories', () => {
    const categories = useAvailableCategories()
    expect(categories).toEqual([
      {
        icon: categoriesIcons.Palette,
        illustration: SearchCategoriesIllustrations.ArtsCrafts,
        facetFilter: SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS,
        baseColor: theme.colors.lilac,
        gradients: [
          { color: '#AD87FF', position: { x: 0, y: 0 } },
          { color: theme.colors.lilac, position: { x: 0, y: 0.5 } },
        ],
        position: 5,
      },
      {
        icon: categoriesIcons.Bookstore,
        illustration: SearchCategoriesIllustrations.LibrariesMediaLibraries,
        facetFilter: SearchGroupNameEnumv2.BIBLIOTHEQUES_MEDIATHEQUE,
        baseColor: theme.colors.coral,
        gradients: [
          { color: '#F8733D', position: { x: 0, y: 0 } },
          { color: theme.colors.coral, position: { x: 0, y: 0.5 } },
        ],
        position: 11,
      },
      {
        icon: categoriesIcons.Card,
        illustration: SearchCategoriesIllustrations.YouthCards,
        facetFilter: SearchGroupNameEnumv2.CARTES_JEUNES,
        baseColor: theme.colors.lilac,
        gradients: [
          { color: '#AD87FF', position: { x: 0, y: 0 } },
          { color: theme.colors.lilac, position: { x: 0, y: 0.5 } },
        ],
        position: 12,
      },
      {
        icon: categoriesIcons.Disk,
        illustration: SearchCategoriesIllustrations.CDVinylsOnlineMusic,
        facetFilter: SearchGroupNameEnumv2.CD_VINYLE_MUSIQUE_EN_LIGNE,
        baseColor: theme.colors.skyBlue,
        gradients: [
          { color: '#20C5E9', position: { x: 0, y: 0 } },
          { color: theme.colors.skyBlue, position: { x: 0, y: 0.5 } },
        ],
        position: 4,
      },
      {
        icon: categoriesIcons.Conference,
        illustration: SearchCategoriesIllustrations.ConcertsFestivals,
        facetFilter: SearchGroupNameEnumv2.CONCERTS_FESTIVALS,
        baseColor: theme.colors.gold,
        gradients: [
          { color: '#F99E15', position: { x: 0, y: 0 } },
          { color: theme.colors.gold, position: { x: 0, y: 0.5 } },
        ],
        position: 1,
      },
      {
        icon: categoriesIcons.Microphone,
        illustration: SearchCategoriesIllustrations.ConferencesMeetings,
        facetFilter: SearchGroupNameEnumv2.RENCONTRES_CONFERENCES,
        baseColor: theme.colors.gold,
        gradients: [
          { color: '#F99E15', position: { x: 0, y: 0 } },
          { color: theme.colors.gold, position: { x: 0, y: 0.5 } },
        ],
        position: 13,
      },
      {
        icon: categoriesIcons.LiveEvent,
        illustration: SearchCategoriesIllustrations.OnlineEvents,
        facetFilter: SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE,
        baseColor: theme.colors.aquamarine,
        gradients: [
          { color: '#27DCA8', position: { x: 0, y: 0 } },
          { color: theme.colors.aquamarine, position: { x: 0, y: 0.5 } },
        ],
        position: 14,
      },
      {
        icon: categoriesIcons.Cinema,
        illustration: SearchCategoriesIllustrations.FilmsSeriesCinema,
        facetFilter: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
        baseColor: theme.colors.aquamarine,
        gradients: [
          { color: '#27DCA8', position: { x: 0, y: 0 } },
          { color: theme.colors.aquamarine, position: { x: 0, y: 0.5 } },
        ],
        position: 2,
      },
      {
        icon: categoriesIcons.Instrument,
        illustration: SearchCategoriesIllustrations.MusicalInstruments,
        facetFilter: SearchGroupNameEnumv2.INSTRUMENTS,
        baseColor: theme.colors.skyBlue,
        gradients: [
          { color: '#20C5E9', position: { x: 0, y: 0 } },
          { color: theme.colors.skyBlue, position: { x: 0, y: 0.5 } },
        ],
        position: 9,
      },
      {
        icon: categoriesIcons.VideoGame,
        illustration: SearchCategoriesIllustrations.GamesVideoGames,
        facetFilter: SearchGroupNameEnumv2.JEUX_JEUX_VIDEOS,
        baseColor: theme.colors.gold,
        gradients: [
          { color: '#F99E15', position: { x: 0, y: 0 } },
          { color: theme.colors.gold, position: { x: 0, y: 0.5 } },
        ],
        position: 8,
      },
      {
        icon: categoriesIcons.Book,
        illustration: SearchCategoriesIllustrations.Books,
        facetFilter: SearchGroupNameEnumv2.LIVRES,
        baseColor: theme.colors.deepPink,
        gradients: [
          { color: '#EC3478', position: { x: 0, y: 0 } },
          { color: theme.colors.deepPink, position: { x: 0, y: 0.5 } },
        ],
        position: 3,
      },
      {
        icon: categoriesIcons.Press,
        illustration: SearchCategoriesIllustrations.MediaPress,
        facetFilter: SearchGroupNameEnumv2.MEDIA_PRESSE,
        baseColor: theme.colors.deepPink,
        gradients: [
          { color: '#EC3478', position: { x: 0, y: 0 } },
          { color: theme.colors.deepPink, position: { x: 0, y: 0.5 } },
        ],
        position: 10,
      },
      {
        icon: categoriesIcons.Museum,
        illustration: SearchCategoriesIllustrations.MuseumCulturalVisits,
        facetFilter: SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES,
        baseColor: theme.colors.aquamarine,
        gradients: [
          { color: '#27DCA8', position: { x: 0, y: 0 } },
          { color: theme.colors.aquamarine, position: { x: 0, y: 0.5 } },
        ],
        position: 7,
      },
      {
        icon: categoriesIcons.Show,
        illustration: SearchCategoriesIllustrations.Shows,
        facetFilter: SearchGroupNameEnumv2.SPECTACLES,
        baseColor: theme.colors.coral,
        gradients: [
          { color: '#F8733D', position: { x: 0, y: 0 } },
          { color: theme.colors.coral, position: { x: 0, y: 0.5 } },
        ],
        position: 6,
      },
    ])
  })

  it('should only available catégories from backend', () => {
    mockData = {
      ...mockData,
      searchGroups: [
        { name: SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS, value: 'Arts & loisirs créatifs' },
        {
          name: SearchGroupNameEnumv2.BIBLIOTHEQUES_MEDIATHEQUE,
          value: 'Bibliothèques, Médiathèques',
        },
      ],
    }
    const categories = useAvailableCategories()
    expect(categories).toEqual([
      {
        icon: categoriesIcons.Palette,
        illustration: SearchCategoriesIllustrations.ArtsCrafts,
        facetFilter: SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS,
        baseColor: theme.colors.lilac,
        gradients: [
          { color: '#AD87FF', position: { x: 0, y: 0 } },
          { color: theme.colors.lilac, position: { x: 0, y: 0.5 } },
        ],
        position: 5,
      },
      {
        icon: categoriesIcons.Bookstore,
        illustration: SearchCategoriesIllustrations.LibrariesMediaLibraries,
        facetFilter: SearchGroupNameEnumv2.BIBLIOTHEQUES_MEDIATHEQUE,
        baseColor: theme.colors.coral,
        gradients: [
          { color: '#F8733D', position: { x: 0, y: 0 } },
          { color: theme.colors.coral, position: { x: 0, y: 0.5 } },
        ],
        position: 11,
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
