import { SearchGroupNameEnumv2 } from 'api/gen'
import { useAvailableCategories } from 'features/search/helpers/useAvailableCategories/useAvailableCategories'
import { placeholderData } from 'libs/subcategories/placeholderData'
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
      },
      {
        icon: categoriesIcons.Bookstore,
        facetFilter: SearchGroupNameEnumv2.BIBLIOTHEQUES_MEDIATHEQUE,
      },
      {
        icon: categoriesIcons.Card,
        facetFilter: SearchGroupNameEnumv2.CARTES_JEUNES,
      },
      {
        icon: categoriesIcons.Disk,
        facetFilter: SearchGroupNameEnumv2.CD_VINYLE_MUSIQUE_EN_LIGNE,
      },
      {
        icon: categoriesIcons.Conference,
        facetFilter: SearchGroupNameEnumv2.CONCERTS_FESTIVALS,
      },
      {
        icon: categoriesIcons.Microphone,
        facetFilter: SearchGroupNameEnumv2.RENCONTRES_CONFERENCES,
      },
      {
        icon: categoriesIcons.LiveEvent,
        facetFilter: SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE,
      },
      {
        icon: categoriesIcons.Cinema,
        facetFilter: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
      },
      {
        icon: categoriesIcons.Instrument,
        facetFilter: SearchGroupNameEnumv2.INSTRUMENTS,
      },
      {
        icon: categoriesIcons.VideoGame,
        facetFilter: SearchGroupNameEnumv2.JEUX_JEUX_VIDEOS,
      },
      {
        icon: categoriesIcons.Book,
        facetFilter: SearchGroupNameEnumv2.LIVRES,
      },
      {
        icon: categoriesIcons.Press,
        facetFilter: SearchGroupNameEnumv2.MEDIA_PRESSE,
      },
      {
        icon: categoriesIcons.Museum,
        facetFilter: SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES,
      },
      {
        icon: categoriesIcons.Show,
        facetFilter: SearchGroupNameEnumv2.SPECTACLES,
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
      },
      {
        icon: categoriesIcons.Bookstore,
        facetFilter: SearchGroupNameEnumv2.BIBLIOTHEQUES_MEDIATHEQUE,
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
