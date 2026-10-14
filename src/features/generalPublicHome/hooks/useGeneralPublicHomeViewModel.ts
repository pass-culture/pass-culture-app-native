import { useNavigation } from '@react-navigation/native'
import { format } from 'date-fns'
import { useCallback, useMemo, useState } from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { CALENDAR_DAYS_COUNT, DATE_PRESETS } from 'features/generalPublicHome/constants'
import { buildFreeSearchState } from 'features/generalPublicHome/helpers/buildFreeSearchState'
import { buildThemeCategoryButtons } from 'features/generalPublicHome/helpers/buildThemeCategoryButtons'
import { getCalendarDays } from 'features/generalPublicHome/helpers/getCalendarDays'
import { useFreeDigitalOffersQuery } from 'features/generalPublicHome/queries/useFreeDigitalOffersQuery'
import { useFreeEventsQuery } from 'features/generalPublicHome/queries/useFreeEventsQuery'
import { DateFilter, DatePreset } from 'features/generalPublicHome/types'
import { UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
import { getSearchHookConfig } from 'features/navigation/navigators/SearchStackNavigator/getSearchHookConfig'
import { useAvailableCategories } from 'features/search/helpers/useAvailableCategories/useAvailableCategories'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useLocationConfiguration, useLocationMode } from 'libs/locationV2/location.store'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { FilterButtonListItem } from 'ui/components/FilterButtonList'

export const useGeneralPublicHomeViewModel = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { isConnected } = useNetInfoContext()
  const { isLoggedIn } = useAuthContext()
  const today = format(new Date(), 'yyyy-MM-dd')
  // `now` ends up in navigation params: it must only change when the day does
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const now = useMemo(() => new Date(), [today])
  const locationMode = useLocationMode()
  const { radius: aroundRadius } = useLocationConfiguration(locationMode)
  const availableCategories = useAvailableCategories()
  const enableNewCategoryBlocks = useFeatureFlag(RemoteStoreFeatureFlags.WIP_NEW_CATEGORY_BLOCKS)

  const [dateFilter, setDateFilter] = useState<DateFilter>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const freeEvents = useFreeEventsQuery({ dateFilter })
  const freePodcasts = useFreeDigitalOffersQuery('podcasts')
  const freeVideos = useFreeDigitalOffersQuery('videos')

  const selectedPreset = dateFilter?.type === 'preset' ? dateFilter.preset : undefined
  const selectedDate = dateFilter?.type === 'day' ? dateFilter.date : undefined

  const calendarDays = useMemo(() => getCalendarDays(now, CALENDAR_DAYS_COUNT), [now])

  const toggleSearch = useCallback(() => setIsSearchOpen((isOpen) => !isOpen), [])
  const toggleCalendar = useCallback(() => setIsCalendarOpen((isOpen) => !isOpen), [])

  const selectPreset = useCallback((preset: DatePreset) => {
    setDateFilter((currentFilter) =>
      currentFilter?.type === 'preset' && currentFilter.preset === preset
        ? null
        : { type: 'preset', preset }
    )
    setIsCalendarOpen(false)
  }, [])

  const datePresetItems: FilterButtonListItem[] = useMemo(
    () =>
      DATE_PRESETS.map(({ preset, label }) => ({
        label,
        isApplied: preset === selectedPreset,
        onPress: () => selectPreset(preset),
        testID: preset,
      })),
    [selectedPreset, selectPreset]
  )

  const selectDate = useCallback((date: string) => {
    setDateFilter((currentFilter) =>
      currentFilter?.type === 'day' && currentFilter.date === date ? null : { type: 'day', date }
    )
  }, [])

  const submitSearch = useCallback(() => {
    const query = searchQuery.trim()
    if (!query) return

    navigate(
      ...getSearchHookConfig(
        'SearchResults',
        buildFreeSearchState({ query, dateFilter, now: new Date() })
      )
    )
  }, [navigate, searchQuery, dateFilter])

  const themeCategoryButtons = useMemo(
    () => buildThemeCategoryButtons({ availableCategories, dateFilter, now, aroundRadius }),
    [availableCategories, dateFilter, now, aroundRadius]
  )

  return {
    isConnected,
    isLoggedIn,
    isSearchOpen,
    isCalendarOpen,
    toggleSearch,
    toggleCalendar,
    datePresetItems,
    calendarDays,
    selectedDate,
    selectDate,
    searchQuery,
    setSearchQuery,
    submitSearch,
    freeEvents: {
      module: freeEvents.module,
      data: freeEvents.data,
      isLoading: freeEvents.isLoading,
    },
    freePodcasts,
    freeVideos,
    themeCategoryButtons,
    enableNewCategoryBlocks,
  }
}
