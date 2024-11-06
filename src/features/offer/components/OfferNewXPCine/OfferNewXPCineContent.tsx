import React, { FC, useRef, useCallback, useState, useEffect } from 'react'
import { View } from 'react-native'
import Animated, { useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated'
import styled, { useTheme } from 'styled-components/native'

import { OfferResponseV2 } from 'api/gen'
import { useMovieCalendar } from 'features/offer/components/MoviesScreeningCalendar/MovieCalendarContext'
import { CineBlock } from 'features/offer/components/OfferNewXPCine/CineBlock'
import { CineBlockSkeleton } from 'features/offer/components/OfferNewXPCine/CineBlockSkeleton'
import { useGetVenuesByDay } from 'features/offer/helpers/useGetVenueByDay/useGetVenuesByDay'
import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'
import { PlainMore } from 'ui/svg/icons/PlainMore'
import { Spacer, TypoDS } from 'ui/theme'

const ANIMATION_DURATION = 300

export const OfferNewXPCineContent: FC<{
  offer: OfferResponseV2
  onSeeVenuePress?: VoidFunction
}> = ({ offer, onSeeVenuePress }) => {
  const theme = useTheme()
  const { animatedStyle, onContentSizeChange } = useAnimatedHeight()
  const { selectedDate, displayCalendar } = useMovieCalendar()
  const {
    increaseCount,
    isEnd: hasReachedVenueListEnd,
    items,
    isLoading,
    hasStocksOnlyAfter15Days,
  } = useGetVenuesByDay(selectedDate, offer, { initialCount: 6, nextCount: 3, radiusKm: 50 })

  useEffect(() => {
    displayCalendar(!hasStocksOnlyAfter15Days)
  }, [displayCalendar, hasStocksOnlyAfter15Days])

  return (
    <View>
      {isLoading ? <CineBlockSkeleton /> : null}
      <Animated.FlatList
        data={items}
        style={animatedStyle}
        onContentSizeChange={onContentSizeChange}
        renderItem={({ item }) => (
          <React.Fragment>
            <CineBlock
              offer={item.offer}
              onSeeVenuePress={onSeeVenuePress}
              nextDate={item.nextDate}
            />
            <Spacer.Column numberOfSpaces={theme.isDesktopViewport ? 6 : 4} />
            <Divider />
          </React.Fragment>
        )}
      />
      {hasReachedVenueListEnd ? null : (
        <SeeMoreContainer>
          <Spacer.Column numberOfSpaces={6} />
          <Text>Aucune séance ne te correspond&nbsp;?</Text>
          <Spacer.Column numberOfSpaces={4} />
          <ButtonSecondary
            mediumWidth
            icon={PlainMore}
            wording="Afficher plus de cinémas"
            onPress={increaseCount}
            color={theme.colors.black}
          />
        </SeeMoreContainer>
      )}
    </View>
  )
}

const useAnimatedHeight = () => {
  const [contentHeight, setContentHeight] = useState(0)
  const isFirstRender = useRef(true)

  const animatedStyle = useAnimatedStyle(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return { height: contentHeight }
    }

    return {
      height: withTiming(contentHeight, {
        duration: ANIMATION_DURATION,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
    }
  }, [contentHeight])

  const onContentSizeChange = useCallback((_width: number, height: number) => {
    setContentHeight(height)
  }, [])

  return { animatedStyle, onContentSizeChange }
}

const Divider = styled.View(({ theme }) => ({
  height: 1,
  backgroundColor: theme.colors.greyMedium,
  marginHorizontal: theme.isDesktopViewport ? undefined : theme.contentPage.marginHorizontal,
}))

const SeeMoreContainer = styled.View(({ theme }) => ({
  alignItems: theme.isMobileViewport ? 'center' : undefined,
}))

const Text = styled(TypoDS.Body)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
