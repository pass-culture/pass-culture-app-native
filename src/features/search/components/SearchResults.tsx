import React, { useEffect, useRef, useState } from 'react'
import { Animated } from 'react-native'
import styled from 'styled-components/native'

import { TAB_BAR_COMP_HEIGHT } from 'features/navigation/TabBar/TabBarComponent'
import { Filter } from 'features/search/atoms/Buttons'
import { InfiniteHits } from 'features/search/components'
import { getSpacing, Spacer } from 'ui/theme'

export const SearchResults: React.FC = () => {
  const [isScrolling, setIsScrolling] = useState(false)
  const [isFirstRender, setIsFirstRender] = useState(true)

  useEffect(() => setIsFirstRender(false), [])

  return (
    <React.Fragment>
      <InfiniteHits setIsScrolling={setIsScrolling} />

      <FilterContainer>
        {isScrolling ? (
          <FadeOutView>
            <Filter />
          </FadeOutView>
        ) : (
          <FadeInView defaultValue={+isFirstRender}>
            <Filter />
          </FadeInView>
        )}
        <Spacer.BottomScreen />
      </FilterContainer>
    </React.Fragment>
  )
}

const FilterContainer = styled.View({
  alignSelf: 'center',
  position: 'absolute',
  bottom: TAB_BAR_COMP_HEIGHT + getSpacing(6),
})

const FadeInView: React.FC<{ children: Element; defaultValue: number }> = ({
  children,
  defaultValue,
}) => {
  const fadeAnim = useRef(new Animated.Value(defaultValue)).current

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start()
  }, [fadeAnim])

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
      }}>
      {children}
    </Animated.View>
  )
}

const FadeOutView: React.FC<{ children: Element }> = ({ children }) => {
  const fadeAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start()
  }, [fadeAnim])

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
      }}>
      {children}
    </Animated.View>
  )
}
