import React, { memo, useEffect, useRef } from 'react'
import { Animated, Easing, TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'

import { accessibilityAndTestId } from 'tests/utils'
import { ColorsEnum, UniqueColors, getShadow, getSpacing } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

interface Props {
  active: boolean
  accessibilityLabel: string
  disabled?: boolean
  toggle: () => void
}

const TOGGLE_WIDTH = getSpacing(7)
const TOGGLE_PATH_START = 2
const TOGGLE_PATH_END = TOGGLE_WIDTH - TOGGLE_PATH_START

const FilterSwitch: React.FC<Props> = (props: Props) => {
  const { toggle, active = false, disabled = false } = props
  const animatedValue = useRef(new Animated.Value(active ? 1 : 0)).current

  const marginLeft = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [TOGGLE_PATH_START, TOGGLE_PATH_END],
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
      <TouchableOpacity
        activeOpacity={ACTIVE_OPACITY}
        onPress={toggle}
        disabled={disabled}
        accessibilityValue={{ text: active.toString() }}
        {...accessibilityAndTestId(props.accessibilityLabel)}>
        <StyledBackgroundColor backgroundColor={getBackgroundColor(active, disabled)}>
          <StyledToggle style={{ marginLeft }} />
        </StyledBackgroundColor>
      </TouchableOpacity>
    </FilterSwitchContainer>
  )
}

const getBackgroundColor = (active: boolean, disabled: boolean): ColorsEnum | UniqueColors => {
  if (active) return disabled ? UniqueColors.GREEN_DISABLED : ColorsEnum.GREEN_VALID
  return disabled ? UniqueColors.GREY_DISABLED : ColorsEnum.GREY_MEDIUM
}

const StyledBackgroundColor = styled.View<{ backgroundColor: ColorsEnum | UniqueColors }>(
  ({ backgroundColor }) => ({
    backgroundColor,
    width: getSpacing(14),
    height: getSpacing(8),
    marginLeft: getSpacing(5),
    borderRadius: getSpacing(4),
    justifyContent: 'center',
  })
)

const FilterSwitchContainer = styled.View({ flexDirection: 'row', alignItems: 'center' })

const StyledToggle = styled(Animated.View)({
  aspectRatio: '1',
  width: TOGGLE_WIDTH,
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

const propsAreEqual = (
  prevProps: Readonly<React.PropsWithChildren<Props>>,
  nextProps: Readonly<React.PropsWithChildren<Props>>
) => prevProps.active === nextProps.active && prevProps.disabled === nextProps.disabled

export default memo(FilterSwitch, propsAreEqual)
