import mockdate from 'mockdate'

import { navigate } from '__mocks__/@react-navigation/native'
import { useGeneralPublicHomeViewModel } from 'features/generalPublicHome/hooks/useGeneralPublicHomeViewModel'
import { useFreeDigitalOffersQuery } from 'features/generalPublicHome/queries/useFreeDigitalOffersQuery'
import { useFreeEventsQuery } from 'features/generalPublicHome/queries/useFreeEventsQuery'
import { availableCategories } from 'features/search/helpers/availableCategories/availableCategories'
import { useAvailableCategories } from 'features/search/helpers/useAvailableCategories/useAvailableCategories'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { act, renderHook } from 'tests/utils'

const mockUseFreeEventsQuery = useFreeEventsQuery as jest.Mock
jest.mock('features/generalPublicHome/queries/useFreeEventsQuery', () => ({
  useFreeEventsQuery: jest.fn(),
}))

const mockUseFreeDigitalOffersQuery = useFreeDigitalOffersQuery as jest.Mock
jest.mock('features/generalPublicHome/queries/useFreeDigitalOffersQuery', () => ({
  useFreeDigitalOffersQuery: jest.fn(),
}))

const mockUseAvailableCategories = useAvailableCategories as jest.Mock
jest.mock('features/search/helpers/useAvailableCategories/useAvailableCategories', () => ({
  useAvailableCategories: jest.fn(),
}))

// Wednesday
const NOW = new Date('2026-10-14T10:30:00.000Z')
const FREE_EVENTS_MODULE = { id: 'generalPublicHome-freeEvents-all' }
const FREE_EVENTS_DATA = { playlistItems: [], nbPlaylistResults: 0, moduleId: 'freeEvents' }
const FREE_PODCASTS = { module: { id: 'generalPublicHome-podcasts' }, data: undefined }
const FREE_VIDEOS = { module: { id: 'generalPublicHome-videos' }, data: undefined }

const renderViewModel = () => renderHook(() => useGeneralPublicHomeViewModel())

const pressDatePreset = (
  result: { current: ReturnType<typeof useGeneralPublicHomeViewModel> },
  label: string
) => act(() => result.current.datePresetItems.find((item) => item.label === label)?.onPress())

describe('useGeneralPublicHomeViewModel', () => {
  beforeEach(() => {
    mockdate.set(NOW)
    setFeatureFlags()
    mockUseFreeEventsQuery.mockReturnValue({
      module: FREE_EVENTS_MODULE,
      data: FREE_EVENTS_DATA,
      offers: [],
      isLoading: false,
    })
    mockUseFreeDigitalOffersQuery.mockImplementation((playlistId: string) =>
      playlistId === 'podcasts' ? FREE_PODCASTS : FREE_VIDEOS
    )
    mockUseAvailableCategories.mockReturnValue(Object.values(availableCategories))
  })

  afterEach(() => mockdate.reset())

  describe('toggles', () => {
    it('should start with the search and the calendar closed', () => {
      const { result } = renderViewModel()

      expect(result.current.isSearchOpen).toBe(false)
      expect(result.current.isCalendarOpen).toBe(false)
    })

    it('should open then close the search', () => {
      const { result } = renderViewModel()

      act(() => result.current.toggleSearch())

      expect(result.current.isSearchOpen).toBe(true)

      act(() => result.current.toggleSearch())

      expect(result.current.isSearchOpen).toBe(false)
    })

    it('should open then close the calendar', () => {
      const { result } = renderViewModel()

      act(() => result.current.toggleCalendar())

      expect(result.current.isCalendarOpen).toBe(true)

      act(() => result.current.toggleCalendar())

      expect(result.current.isCalendarOpen).toBe(false)
    })
  })

  describe('date presets', () => {
    it('should list the presets, none applied', () => {
      const { result } = renderViewModel()

      expect(result.current.datePresetItems).toEqual([
        expect.objectContaining({ label: 'Aujourd’hui', testID: 'today', isApplied: false }),
        expect.objectContaining({ label: 'Cette semaine', testID: 'thisWeek', isApplied: false }),
        expect.objectContaining({ label: 'Ce mois-ci', testID: 'thisMonth', isApplied: false }),
      ])
    })

    it('should start without date filter', () => {
      renderViewModel()

      expect(mockUseFreeEventsQuery).toHaveBeenLastCalledWith({ dateFilter: null })
    })

    it('should filter on the pressed preset', () => {
      const { result } = renderViewModel()

      pressDatePreset(result, 'Cette semaine')

      expect(result.current.datePresetItems[1]?.isApplied).toBe(true)
      expect(mockUseFreeEventsQuery).toHaveBeenLastCalledWith({
        dateFilter: { type: 'preset', preset: 'thisWeek' },
      })
    })

    it('should clear the filter when the applied preset is pressed again', () => {
      const { result } = renderViewModel()

      pressDatePreset(result, 'Cette semaine')
      pressDatePreset(result, 'Cette semaine')

      expect(result.current.datePresetItems.some(({ isApplied }) => isApplied)).toBe(false)
      expect(mockUseFreeEventsQuery).toHaveBeenLastCalledWith({ dateFilter: null })
    })

    it('should replace the applied preset by another one', () => {
      const { result } = renderViewModel()

      pressDatePreset(result, 'Aujourd’hui')
      pressDatePreset(result, 'Ce mois-ci')

      expect(
        result.current.datePresetItems
          .filter(({ isApplied }) => isApplied)
          .map(({ label }) => label)
      ).toEqual(['Ce mois-ci'])
    })

    it('should close the calendar', () => {
      const { result } = renderViewModel()
      act(() => result.current.toggleCalendar())

      pressDatePreset(result, 'Aujourd’hui')

      expect(result.current.isCalendarOpen).toBe(false)
    })

    it('should clear the selected day', () => {
      const { result } = renderViewModel()
      act(() => result.current.selectDate('2026-10-16'))

      pressDatePreset(result, 'Aujourd’hui')

      expect(result.current.selectedDate).toBeUndefined()
    })
  })

  describe('calendar', () => {
    it('should list the next 14 days from today', () => {
      const { result } = renderViewModel()

      expect(result.current.calendarDays).toHaveLength(14)
      expect(result.current.calendarDays[0]).toBe('2026-10-14')
    })

    it('should filter on the picked day', () => {
      const { result } = renderViewModel()

      act(() => result.current.selectDate('2026-10-16'))

      expect(result.current.selectedDate).toBe('2026-10-16')
      expect(mockUseFreeEventsQuery).toHaveBeenLastCalledWith({
        dateFilter: { type: 'day', date: '2026-10-16' },
      })
    })

    it('should clear the filter when the picked day is picked again', () => {
      const { result } = renderViewModel()

      act(() => result.current.selectDate('2026-10-16'))
      act(() => result.current.selectDate('2026-10-16'))

      expect(result.current.selectedDate).toBeUndefined()
      expect(mockUseFreeEventsQuery).toHaveBeenLastCalledWith({ dateFilter: null })
    })

    it('should clear the applied preset', () => {
      const { result } = renderViewModel()
      pressDatePreset(result, 'Cette semaine')

      act(() => result.current.selectDate('2026-10-16'))

      expect(result.current.datePresetItems.some(({ isApplied }) => isApplied)).toBe(false)
    })
  })

  describe('search', () => {
    it('should navigate to the free search results with the trimmed query and the date filter', () => {
      const { result } = renderViewModel()
      act(() => result.current.selectDate('2026-10-16'))
      act(() => result.current.setSearchQuery('  musée  '))

      act(() => result.current.submitSearch())

      expect(navigate).toHaveBeenCalledWith('TabNavigator', {
        screen: 'SearchStackNavigator',
        params: {
          screen: 'SearchResults',
          params: expect.objectContaining({
            query: 'musée',
            maxPrice: 0,
            beginningDatetime: '2026-10-16T00:00:00.000Z',
          }),
        },
      })
    })

    it('should not navigate with a blank query', () => {
      const { result } = renderViewModel()
      act(() => result.current.setSearchQuery('   '))

      act(() => result.current.submitSearch())

      expect(navigate).not.toHaveBeenCalled()
    })
  })

  describe('free events', () => {
    it('should forward the free events module, data and loading state', () => {
      const { result } = renderViewModel()

      expect(result.current.freeEvents).toEqual({
        module: FREE_EVENTS_MODULE,
        data: FREE_EVENTS_DATA,
        isLoading: false,
      })
    })
  })

  describe('free digital offers', () => {
    it('should forward the free podcasts and videos queries', () => {
      const { result } = renderViewModel()

      expect(result.current.freePodcasts).toBe(FREE_PODCASTS)
      expect(result.current.freeVideos).toBe(FREE_VIDEOS)
    })
  })

  describe('themes', () => {
    it('should list one category button per theme', () => {
      const { result } = renderViewModel()

      expect(result.current.themeCategoryButtons.map(({ label }) => label)).toEqual([
        'Spectacles',
        'Sorties',
        'Visites',
        'Cinéma',
      ])
    })

    it('should forward the new category blocks feature flag', () => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_NEW_CATEGORY_BLOCKS])

      const { result } = renderViewModel()

      expect(result.current.enableNewCategoryBlocks).toBe(true)
    })

    it('should lead the themes to their free events playlist with the date filter', () => {
      const { result } = renderViewModel()

      act(() => result.current.selectDate('2026-10-16'))

      expect(result.current.themeCategoryButtons[0]?.navigateTo.params).toEqual(
        expect.objectContaining({
          module: expect.objectContaining({
            offersModuleParameters: [
              expect.objectContaining({
                categories: ['Spectacles'],
                beginningDatetime: '2026-10-16T00:00:00.000Z',
                endingDatetime: '2026-10-16T23:59:59.999Z',
              }),
            ],
          }),
        })
      )
    })
  })
})
