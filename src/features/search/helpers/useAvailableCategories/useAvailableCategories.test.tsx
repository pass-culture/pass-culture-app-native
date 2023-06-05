import { SearchGroupNameEnumv2 } from 'api/gen'
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
        facetFilter: SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS,
        baseColor: theme.colors.lilac,
        gradients: [
          { color: '#AD87FF', position: { x: 0, y: 0 } },
          { color: theme.colors.lilac, position: { x: 0, y: 0.5 } },
        ],
      },
      {
        icon: categoriesIcons.Bookstore,
        facetFilter: SearchGroupNameEnumv2.BIBLIOTHEQUES_MEDIATHEQUE,
        baseColor: theme.colors.coral,
        gradients: [
          { color: '#F8733D', position: { x: 0, y: 0 } },
          { color: theme.colors.coral, position: { x: 0, y: 0.5 } },
        ],
      },
      {
        icon: categoriesIcons.Card,
        facetFilter: SearchGroupNameEnumv2.CARTES_JEUNES,
        baseColor: theme.colors.lilac,
        gradients: [
          { color: '#AD87FF', position: { x: 0, y: 0 } },
          { color: theme.colors.lilac, position: { x: 0, y: 0.5 } },
        ],
      },
      {
        icon: categoriesIcons.Disk,
        facetFilter: SearchGroupNameEnumv2.CD_VINYLE_MUSIQUE_EN_LIGNE,
        baseColor: theme.colors.skyBlue,
        gradients: [
          { color: '#20C5E9', position: { x: 0, y: 0 } },
          { color: theme.colors.skyBlue, position: { x: 0, y: 0.5 } },
        ],
      },
      {
        icon: categoriesIcons.Conference,
        facetFilter: SearchGroupNameEnumv2.CONCERTS_FESTIVALS,
        baseColor: theme.colors.gold,
        gradients: [
          { color: '#F99E15', position: { x: 0, y: 0 } },
          { color: theme.colors.gold, position: { x: 0, y: 0.5 } },
        ],
      },
      {
        icon: categoriesIcons.Microphone,
        facetFilter: SearchGroupNameEnumv2.RENCONTRES_CONFERENCES,
        baseColor: theme.colors.gold,
        gradients: [
          { color: '#F99E15', position: { x: 0, y: 0 } },
          { color: theme.colors.gold, position: { x: 0, y: 0.5 } },
        ],
      },
      {
        icon: categoriesIcons.LiveEvent,
        facetFilter: SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE,
        baseColor: theme.colors.aquamarine,
        gradients: [
          { color: '#27DCA8', position: { x: 0, y: 0 } },
          { color: theme.colors.aquamarine, position: { x: 0, y: 0.5 } },
        ],
      },
      {
        icon: categoriesIcons.Cinema,
        facetFilter: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
        baseColor: theme.colors.aquamarine,
        gradients: [
          { color: '#27DCA8', position: { x: 0, y: 0 } },
          { color: theme.colors.aquamarine, position: { x: 0, y: 0.5 } },
        ],
      },
      {
        icon: categoriesIcons.Instrument,
        facetFilter: SearchGroupNameEnumv2.INSTRUMENTS,
        baseColor: theme.colors.skyBlue,
        gradients: [
          { color: '#20C5E9', position: { x: 0, y: 0 } },
          { color: theme.colors.skyBlue, position: { x: 0, y: 0.5 } },
        ],
      },
      {
        icon: categoriesIcons.VideoGame,
        facetFilter: SearchGroupNameEnumv2.JEUX_JEUX_VIDEOS,
        baseColor: theme.colors.gold,
        gradients: [
          { color: '#F99E15', position: { x: 0, y: 0 } },
          { color: theme.colors.gold, position: { x: 0, y: 0.5 } },
        ],
      },
      {
        icon: categoriesIcons.Book,
        facetFilter: SearchGroupNameEnumv2.LIVRES,
        baseColor: theme.colors.deepPink,
        gradients: [
          { color: '#EC3478', position: { x: 0, y: 0 } },
          { color: theme.colors.deepPink, position: { x: 0, y: 0.5 } },
        ],
      },
      {
        icon: categoriesIcons.Press,
        facetFilter: SearchGroupNameEnumv2.MEDIA_PRESSE,
        baseColor: theme.colors.deepPink,
        gradients: [
          { color: '#EC3478', position: { x: 0, y: 0 } },
          { color: theme.colors.deepPink, position: { x: 0, y: 0.5 } },
        ],
      },
      {
        icon: categoriesIcons.Museum,
        facetFilter: SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES,
        baseColor: theme.colors.aquamarine,
        gradients: [
          { color: '#27DCA8', position: { x: 0, y: 0 } },
          { color: theme.colors.aquamarine, position: { x: 0, y: 0.5 } },
        ],
      },
      {
        icon: categoriesIcons.Show,
        facetFilter: SearchGroupNameEnumv2.SPECTACLES,
        baseColor: theme.colors.coral,
        gradients: [
          { color: '#F8733D', position: { x: 0, y: 0 } },
          { color: theme.colors.coral, position: { x: 0, y: 0.5 } },
        ],
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
        facetFilter: SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS,
        baseColor: theme.colors.lilac,
        gradients: [
          { color: '#AD87FF', position: { x: 0, y: 0 } },
          { color: theme.colors.lilac, position: { x: 0, y: 0.5 } },
        ],
      },
      {
        icon: categoriesIcons.Bookstore,
        facetFilter: SearchGroupNameEnumv2.BIBLIOTHEQUES_MEDIATHEQUE,
        baseColor: theme.colors.coral,
        gradients: [
          { color: '#F8733D', position: { x: 0, y: 0 } },
          { color: theme.colors.coral, position: { x: 0, y: 0.5 } },
        ],
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
