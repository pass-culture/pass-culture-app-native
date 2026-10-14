import { useScrollToTop } from '@react-navigation/native'
import { FlashListRef } from '@shopify/flash-list'
import { noop } from 'lodash'
import React, { FunctionComponent, useRef } from 'react'
import { Platform, ScrollView } from 'react-native'
import { IOScrollView as IntersectionObserverScrollView } from 'react-native-intersection-observer'
import styled, { useTheme } from 'styled-components/native'

import { GENERAL_PUBLIC_HOME_ENTRY_ID } from 'features/generalPublicHome/constants'
import { useGeneralPublicHomeViewModel } from 'features/generalPublicHome/hooks/useGeneralPublicHomeViewModel'
import { HomeHeader } from 'features/home/components/headers/HomeHeader'
import { HomeBanner } from 'features/home/components/modules/banners/HomeBanner'
import { HomeModule } from 'features/home/components/modules/HomeModule'
import { MovieCalendarV2 } from 'features/offer/components/MovieCalendar/MovieCalendarV2'
import { SingleFilterButton } from 'features/search/components/Buttons/SingleFilterButton/SingleFilterButton'
import { CategoriesListDumb } from 'features/search/components/CategoriesListDumb/CategoriesListDumb'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { OfflinePage } from 'libs/network/OfflinePage'
import { AccessibilityFooter } from 'shared/AccessibilityFooter/AccessibilityFooter'
import { FilterButtonList } from 'ui/components/FilterButtonList'
import { Li } from 'ui/components/Li'
import { OfferPlaylistSkeleton, TileSize } from 'ui/components/placeholders/OfferPlaylistSkeleton'
import { StatusBarBlurredBackground } from 'ui/components/statusBar/statusBarBlurredBackground'
import { SearchInput } from 'ui/designSystem/SearchInput/SearchInput'
import { useLayout } from 'ui/hooks/useLayout'
import { Page } from 'ui/pages/Page'
import { Calendar } from 'ui/svg/icons/Calendar'
import { MagnifyingGlass } from 'ui/svg/icons/MagnifyingGlass'
import { Spacer } from 'ui/theme'

export const GeneralPublicHome: FunctionComponent = () => {
  const {
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
    freeEvents,
    freePodcasts,
    freeVideos,
    themeCategoryButtons,
    enableNewCategoryBlocks,
  } = useGeneralPublicHomeViewModel()
  const { contentPage, designSystem } = useTheme()
  const scrollRef = useRef<ScrollView>(null)
  useScrollToTop(scrollRef)
  const calendarListRef = useRef<FlashListRef<string>>(null)
  const { width: calendarListWidth, onLayout: onCalendarListLayout } = useLayout()
  const { width: calendarDayWidth, onLayout: onCalendarDayLayout } = useLayout()

  if (!isConnected) return <OfflinePage />

  // FilterButtonList items carry a left margin of `spacing.xs`
  const filterListContentStyle = {
    paddingLeft: contentPage.marginHorizontal - designSystem.size.spacing.xs,
    paddingRight: contentPage.marginHorizontal,
  }

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
        <BannerContainer>
          <HomeBanner isLoggedIn={isLoggedIn} />
        </BannerContainer>
        <Main accessibilityRole={AccessibilityRole.MAIN}>
          <Filters>
            <FilterButtonList
              items={datePresetItems}
              contentContainerStyle={filterListContentStyle}>
              <ToggleLi>
                <SingleFilterButton
                  label="Rechercher"
                  icon={<SearchIcon />}
                  isSelected={isSearchOpen}
                  onPress={toggleSearch}
                  testID="searchToggle"
                />
              </ToggleLi>
              <ToggleLi>
                <SingleFilterButton
                  label="Calendrier"
                  icon={<CalendarIcon />}
                  isSelected={isCalendarOpen}
                  onPress={toggleCalendar}
                  testID="calendarToggle"
                />
              </ToggleLi>
            </FilterButtonList>
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
          <CategoriesListDumb
            sortedCategories={themeCategoryButtons}
            shouldDisplayVenueMap={false}
            isMapWithoutPositionAndNotLocated={false}
            enableNewCategoryBlocks={enableNewCategoryBlocks}
            onPressVenueMap={noop}
          />
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

// Same as the production home banner container
const BannerContainer = styled.View(({ theme }) => ({
  marginHorizontal: theme.designSystem.size.spacing.xl,
}))

const Main = styled.View(({ theme }) => ({
  gap: theme.designSystem.size.spacing.xl,
}))

const Filters = styled.View(({ theme }) => ({
  gap: theme.designSystem.size.spacing.m,
}))

// Same spacing as the FilterButtonList items
const ToggleLi = styled(Li)(({ theme }) => ({
  marginLeft: theme.designSystem.size.spacing.xs,
  marginTop: theme.designSystem.size.spacing.xs,
  marginBottom: theme.designSystem.size.spacing.xs,
}))

const SearchIcon = styled(MagnifyingGlass).attrs(({ theme }) => ({
  size: theme.designSystem.size.icon.s,
  color: theme.designSystem.color.icon.default,
}))``

const CalendarIcon = styled(Calendar).attrs(({ theme }) => ({
  size: theme.designSystem.size.icon.s,
  color: theme.designSystem.color.icon.default,
}))``

const SearchContainer = styled.View(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
}))
