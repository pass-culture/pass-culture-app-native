import React, { useEffect } from 'react'
import { Animated, Easing, StyleSheet, TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'

import { ColorsEnum, getSpacing } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

interface Props {
  toggle: () => void
  active: boolean
}

const FilterSwitch: React.FC<Props> = (props: Props) => {
  const { toggle, active = false } = props
  const animatedValue = new Animated.Value(active ? 0 : 1)

  const moveToggle = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 25],
  })

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: active ? 1 : 0,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start()
  }, [active])

  return (
    <FilterSwitchContainer>
      <TouchableOpacity activeOpacity={ACTIVE_OPACITY} testID="filterSwitch" onPress={toggle}>
        <StyledBackgroundColor active={active} testID="switchBackground">
          <Animated.View
            style={[
              styles.toggleWheelStyle,
              {
                marginLeft: moveToggle,
              },
            ]}
          />
        </StyledBackgroundColor>
      </TouchableOpacity>
    </FilterSwitchContainer>
  )
}

const StyledBackgroundColor = styled.View<{ active: boolean }>(({ active }) => ({
  backgroundColor: active ? ColorsEnum.GREEN_VALID : ColorsEnum.GREY_MEDIUM,
  width: getSpacing(12.5),
  height: getSpacing(7.5),
  marginLeft: getSpacing(0.75),
  borderRadius: getSpacing(3.75),
  justifyContent: 'center',
}))

const FilterSwitchContainer = styled.View({ flexDirection: 'row', alignItems: 'center' })

const styles = StyleSheet.create({
  toggleWheelStyle: {
    width: getSpacing(6.25),
    height: getSpacing(6.25),
    backgroundColor: ColorsEnum.WHITE,
    borderRadius: getSpacing(3.12),
    shadowColor: ColorsEnum.BLACK,
    shadowOffset: {
      width: getSpacing(0),
      height: getSpacing(0.5),
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
    elevation: 1.5,
  },
})

export default FilterSwitch
