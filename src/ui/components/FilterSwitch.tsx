import React, { useEffect } from 'react'
import { Animated, Easing, TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'

import { ColorsEnum, getShadow, getSpacing } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

interface Props {
  toggle: () => void
  active: boolean
}

const FilterSwitch: React.FC<Props> = (props: Props) => {
  const { toggle, active = false } = props
  const animatedValue = new Animated.Value(active ? 0 : 1)

  const marginLeft = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 28],
  })

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: active ? 1 : 0,
      duration: 200,
      easing: Easing.bezier(0, 0.75, 0, 0.75),
      useNativeDriver: false,
    }).start()
  }, [active])

  return (
    <FilterSwitchContainer>
      <TouchableOpacity activeOpacity={ACTIVE_OPACITY} testID="filterSwitch" onPress={toggle}>
        <StyledBackgroundColor active={active} testID="switchBackground">
          <StyledToggle style={{ marginLeft }} />
        </StyledBackgroundColor>
      </TouchableOpacity>
    </FilterSwitchContainer>
  )
}

const StyledBackgroundColor = styled.View<{ active: boolean }>(({ active }) => ({
  backgroundColor: active ? ColorsEnum.GREEN_VALID : ColorsEnum.GREY_MEDIUM,
  width: getSpacing(14),
  height: getSpacing(8),
  marginLeft: getSpacing(5),
  borderRadius: getSpacing(4),
  justifyContent: 'center',
}))

const FilterSwitchContainer = styled.View({ flexDirection: 'row', alignItems: 'center' })

const StyledToggle = styled(Animated.View)({
  aspectRatio: '1',
  width: getSpacing(7),
  height: getSpacing(7),
  backgroundColor: ColorsEnum.WHITE,
  borderRadius: getSpacing(7),
  ...getShadow({
    shadowOffset: {
      width: 0,
      height: getSpacing(0.5),
    },
    shadowRadius: 2.5,
    shadowColor: ColorsEnum.BLACK,
    shadowOpacity: 0.2,
  }),
})

export default FilterSwitch
