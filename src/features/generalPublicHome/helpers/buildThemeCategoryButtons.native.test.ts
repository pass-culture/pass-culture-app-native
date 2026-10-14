import { SearchGroupNameEnumv2 } from 'api/gen'
import { buildThemeCategoryButtons } from 'features/generalPublicHome/helpers/buildThemeCategoryButtons'
import { HomepageModuleType } from 'features/home/types'
import {
  availableCategories,
  newAvailableCategories,
} from 'features/search/helpers/availableCategories/availableCategories'
import { VerticalPlaylist } from 'shared/verticalPlaylist/enums'

// Wednesday
const NOW = new Date('2026-10-14T10:30:00.000Z')
const CATEGORIES = Object.values(availableCategories)
const NEW_CATEGORIES = Object.values(newAvailableCategories)

describe('buildThemeCategoryButtons', () => {
  it('should build one button per theme, in the themes order', () => {
    const buttons = buildThemeCategoryButtons({
      availableCategories: CATEGORIES,
      dateFilter: null,
      now: NOW,
    })

    expect(buttons.map(({ label }) => label)).toEqual([
      'Spectacles',
      'Sorties',
      'Visites',
      'Cinéma',
    ])
  })

  it('should borrow the colors of the theme search category', () => {
    const [showsButton] = buildThemeCategoryButtons({
      availableCategories: CATEGORIES,
      dateFilter: null,
      now: NOW,
    })

    expect(showsButton?.fillColor).toBe(availableCategories.SPECTACLES.fillColor)
    expect(showsButton?.borderColor).toBe(availableCategories.SPECTACLES.borderColor)
  })

  it('should borrow the illustration of the theme search category with the new category blocks', () => {
    const [showsButton] = buildThemeCategoryButtons({
      availableCategories: NEW_CATEGORIES,
      dateFilter: null,
      now: NOW,
    })

    expect(showsButton?.fillColor).toBe(newAvailableCategories.SPECTACLES.fillColor)
    expect(showsButton?.illustrationUrl).toBe(newAvailableCategories.SPECTACLES.illustrationUrl)
  })

  it('should skip a theme whose search category is not available', () => {
    const buttons = buildThemeCategoryButtons({
      availableCategories: CATEGORIES.filter(
        ({ facetFilter }) => facetFilter !== SearchGroupNameEnumv2.CINEMA
      ),
      dateFilter: null,
      now: NOW,
    })

    expect(buttons.map(({ label }) => label)).not.toContain('Cinéma')
  })

  it('should lead to the free events playlist of the theme with the date filter', () => {
    const [showsButton] = buildThemeCategoryButtons({
      availableCategories: CATEGORIES,
      dateFilter: { type: 'day', date: '2026-10-16' },
      now: NOW,
      aroundRadius: 10,
    })

    expect(showsButton?.navigateTo).toEqual({
      screen: 'VerticalPlaylistOffers',
      params: {
        type: VerticalPlaylist.ModuleOffers,
        module: expect.objectContaining({
          type: HomepageModuleType.OffersModule,
          title: 'Spectacles',
          offersModuleParameters: [
            expect.objectContaining({
              priceMax: 0,
              categories: ['Spectacles'],
              aroundRadius: 10,
              beginningDatetime: '2026-10-16T00:00:00.000Z',
              endingDatetime: '2026-10-16T23:59:59.999Z',
            }),
          ],
        }),
      },
    })
  })
})
