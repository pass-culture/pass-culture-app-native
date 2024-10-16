import React, { FC, useEffect, useRef, useCallback, useState } from 'react'
import { FlatList, View } from 'react-native'
import Animated, { useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated'
import styled, { useTheme } from 'styled-components/native'

import { OfferResponseV2 } from 'api/gen'
import { MovieCalendar } from 'features/offer/components/MovieCalendar/MovieCalendar'
import { CineBlock } from 'features/offer/components/OfferNewXPCine/CineBlock'
import { CineBlockSkeleton } from 'features/offer/components/OfferNewXPCine/CineBlockSkeleton'
import { useGetVenuesByDay } from 'features/offer/helpers/useGetVenueByDay/useGetVenuesByDay'
import { useNextDays } from 'features/offer/helpers/useNextDays/useNextDays'
import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'
import { PlainMore } from 'ui/svg/icons/PlainMore'
import { getSpacing, Spacer, TypoDS } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

const ANIMATION_DURATION = 300

type Props = {
  title: string
  offer: OfferResponseV2
  onSeeVenuePress?: VoidFunction
}

export const OfferNewXPCineBlock: FC<Props> = ({ title, onSeeVenuePress, offer }) => {
  const theme = useTheme()
  const flatListRef = useRef<FlatList | null>(null)
  const { selectedDate, setSelectedDate, dates } = useNextDays(15)
  const {
    increaseCount,
    isEnd: hasReachedVenueListEnd,
    items,
    isLoading,
  } = useGetVenuesByDay(selectedDate, offer, { initialCount: 6, nextCount: 3, radiusKm: 50 })

  const { animatedStyle, onContentSizeChange } = useAnimatedHeight()

  useEffect(() => {
    if (flatListRef?.current) {
      flatListRef.current?.scrollToOffset({ offset: 0 })
    }
  }, [flatListRef])

  return (
    <Container testID="offer-new-xp-cine-block">
      <TitleContainer>
        <TypoDS.Title3 {...getHeadingAttrs(2)}>{title}</TypoDS.Title3>
      </TitleContainer>

      <Spacer.Column numberOfSpaces={4} />

      <MovieCalendarContainer>
        <MovieCalendar
          dates={dates}
          selectedDate={selectedDate}
          onTabChange={setSelectedDate}
          flatListRef={flatListRef}
        />
      </MovieCalendarContainer>

      <View>
        {isLoading ? <CineBlockSkeleton /> : null}
        <Animated.FlatList
          data={items}
          style={animatedStyle}
          onContentSizeChange={onContentSizeChange}
          renderItem={({ item }) => (
            <React.Fragment>
              <CineBlock
                offer={item}
                onSeeVenuePress={onSeeVenuePress}
                selectedDate={selectedDate}
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
    </Container>
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

const Container = styled(View)({
  marginVertical: 0,
})

const MovieCalendarContainer = styled(View)(({ theme }) => ({
  marginRight: theme.isDesktopViewport ? -getSpacing(16) : 0, // cancels padding of the parent container
}))

const TitleContainer = styled(View)(({ theme }) => ({
  marginHorizontal: theme.isDesktopViewport ? undefined : theme.contentPage.marginHorizontal,
}))

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
