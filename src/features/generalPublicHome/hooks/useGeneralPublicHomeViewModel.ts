import { useNavigation } from '@react-navigation/native'
import { format } from 'date-fns'
import { useCallback, useMemo, useState } from 'react'

import { CALENDAR_DAYS_COUNT, DATE_PRESETS } from 'features/generalPublicHome/constants'
import { buildFreeEventsModule } from 'features/generalPublicHome/helpers/buildFreeEventsModule'
import { buildFreeSearchState } from 'features/generalPublicHome/helpers/buildFreeSearchState'
import { getCalendarDays } from 'features/generalPublicHome/helpers/getCalendarDays'
import { THEMES } from 'features/generalPublicHome/mocks/themes'
import { useFreeDigitalOffersQuery } from 'features/generalPublicHome/queries/useFreeDigitalOffersQuery'
import { useFreeEventsQuery } from 'features/generalPublicHome/queries/useFreeEventsQuery'
import { DateFilter, DatePreset, DatePresetItem, ThemeId } from 'features/generalPublicHome/types'
import { UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
import { getSearchHookConfig } from 'features/navigation/navigators/SearchStackNavigator/getSearchHookConfig'
import { useLocationConfiguration, useLocationMode } from 'libs/locationV2/location.store'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { VerticalPlaylist } from 'shared/verticalPlaylist/enums'

export const useGeneralPublicHomeViewModel = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { isConnected } = useNetInfoContext()
  const today = format(new Date(), 'yyyy-MM-dd')
  // `now` ends up in navigation params: it must only change when the day does
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const now = useMemo(() => new Date(), [today])
  const locationMode = useLocationMode()
  const { radius: aroundRadius } = useLocationConfiguration(locationMode)

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

  const datePresetItems: DatePresetItem[] = useMemo(
    () =>
      DATE_PRESETS.map(({ preset, label }) => ({
        label,
        isSelected: preset === selectedPreset,
        onPress: () => selectPreset(preset),
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

  const pressTheme = useCallback(
    (themeId: ThemeId) =>
      navigate('VerticalPlaylistOffers', {
        type: VerticalPlaylist.ModuleOffers,
        module: buildFreeEventsModule({ dateFilter, themeId, now, aroundRadius }),
      }),
    [navigate, dateFilter, now, aroundRadius]
  )

  return {
    isConnected,
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
    themes: THEMES,
    pressTheme,
  }
}
