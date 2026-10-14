import { useScrollToTop } from '@react-navigation/native'
import { FlashListRef } from '@shopify/flash-list'
import React, { FunctionComponent, useRef } from 'react'
import { Platform, ScrollView } from 'react-native'
import { IOScrollView as IntersectionObserverScrollView } from 'react-native-intersection-observer'
import styled from 'styled-components/native'

import { DateFilterBar } from 'features/generalPublicHome/components/DateFilterBar'
import { ThemeBubble } from 'features/generalPublicHome/components/ThemeBubble'
import { GENERAL_PUBLIC_HOME_ENTRY_ID } from 'features/generalPublicHome/constants'
import { useGeneralPublicHomeViewModel } from 'features/generalPublicHome/hooks/useGeneralPublicHomeViewModel'
import { AccessibleTitle } from 'features/home/components/AccessibleTitle'
import { HomeHeader } from 'features/home/components/headers/HomeHeader'
import { HomeModule } from 'features/home/components/modules/HomeModule'
import { MovieCalendarV2 } from 'features/offer/components/MovieCalendar/MovieCalendarV2'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { OfflinePage } from 'libs/network/OfflinePage'
import { AccessibilityFooter } from 'shared/AccessibilityFooter/AccessibilityFooter'
import { OfferPlaylistSkeleton, TileSize } from 'ui/components/placeholders/OfferPlaylistSkeleton'
import { StatusBarBlurredBackground } from 'ui/components/statusBar/statusBarBlurredBackground'
import { SearchInput } from 'ui/designSystem/SearchInput/SearchInput'
import { useLayout } from 'ui/hooks/useLayout'
import { Page } from 'ui/pages/Page'
import { Spacer } from 'ui/theme'

export const GeneralPublicHome: FunctionComponent = () => {
  const {
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
    freeEvents,
    freePodcasts,
    freeVideos,
    themes,
    pressTheme,
  } = useGeneralPublicHomeViewModel()
  const scrollRef = useRef<ScrollView>(null)
  useScrollToTop(scrollRef)
  const calendarListRef = useRef<FlashListRef<string>>(null)
  const { width: calendarListWidth, onLayout: onCalendarListLayout } = useLayout()
  const { width: calendarDayWidth, onLayout: onCalendarDayLayout } = useLayout()

  if (!isConnected) return <OfflinePage />

  return (
    <Page>
      <IntersectionObserverScrollView
        ref={scrollRef}
        testID="generalPublicHomeScrollView"
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={16}
        bounces>
        <HeaderContainer>
          <HomeHeader />
        </HeaderContainer>
        <Main accessibilityRole={AccessibilityRole.MAIN}>
          <Filters>
            <DateFilterBar
              isSearchOpen={isSearchOpen}
              isCalendarOpen={isCalendarOpen}
              onToggleSearch={toggleSearch}
              onToggleCalendar={toggleCalendar}
              datePresetItems={datePresetItems}
            />
            {isSearchOpen ? (
              <SearchContainer>
                <SearchInput
                  label="Rechercher un musée, un concert, une expo…"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onSubmitEditing={submitSearch}
                />
              </SearchContainer>
            ) : null}
            {isCalendarOpen ? (
              <MovieCalendarV2
                dates={calendarDays}
                selectedDate={selectedDate}
                onTabChange={selectDate}
                listRef={calendarListRef}
                listWidth={calendarListWidth}
                onFlatListLayout={onCalendarListLayout}
                itemWidth={calendarDayWidth}
                onItemLayout={onCalendarDayLayout}
              />
            ) : null}
          </Filters>
          {freeEvents.isLoading ? (
            <OfferPlaylistSkeleton size={TileSize.LARGE} numberOfTiles={4} />
          ) : (
            <HomeModule
              item={freeEvents.module}
              index={0}
              homeEntryId={GENERAL_PUBLIC_HOME_ENTRY_ID}
              data={freeEvents.data}
            />
          )}
          <Themes>
            <AccessibleTitle title="Les grands thèmes" />
            <ThemeBubbles>
              {themes.map(({ id, label, Icon }) => (
                <ThemeBubble key={id} label={label} Icon={Icon} onPress={() => pressTheme(id)} />
              ))}
            </ThemeBubbles>
          </Themes>
          <HomeModule
            item={freePodcasts.module}
            index={2}
            homeEntryId={GENERAL_PUBLIC_HOME_ENTRY_ID}
            data={freePodcasts.data}
          />
          <HomeModule
            item={freeVideos.module}
            index={3}
            homeEntryId={GENERAL_PUBLIC_HOME_ENTRY_ID}
            data={freeVideos.data}
          />
        </Main>
        {Platform.OS === 'web' ? <AccessibilityFooter withHorizontalMargin /> : null}
        <Spacer.TabBar />
      </IntersectionObserverScrollView>
      <StatusBarBlurredBackground />
    </Page>
  )
}

// Same as the production home list header
const HeaderContainer = styled.View(({ theme }) => ({
  zIndex: theme.zIndex.header,
  marginBottom: theme.designSystem.size.spacing.xl,
}))

const Main = styled.View(({ theme }) => ({
  gap: theme.designSystem.size.spacing.xl,
}))

const Filters = styled.View(({ theme }) => ({
  gap: theme.designSystem.size.spacing.m,
}))

const SearchContainer = styled.View(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
}))

const Themes = styled.View(({ theme }) => ({
  gap: theme.designSystem.size.spacing.l,
}))

const ThemeBubbles = styled.View(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginHorizontal: theme.contentPage.marginHorizontal,
}))
