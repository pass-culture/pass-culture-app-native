import React, { memo, useEffect, useRef } from 'react'
import { Animated, Easing, TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'

import { ColorsEnum, getShadow, getSpacing } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

interface Props {
  toggle: () => void
  active: boolean
  disabled?: boolean
  testID?: string
}

const FilterSwitch: React.FC<Props> = (props: Props) => {
  const { toggle, active = false, disabled = false, testID } = props
  const animatedValue = useRef(new Animated.Value(active ? 0 : 1)).current

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
      <TouchableOpacity
        activeOpacity={ACTIVE_OPACITY}
        testID={testID ? testID : 'filterSwitch'}
        onPress={toggle}
        disabled={disabled}>
        <StyledBackgroundColor
          backgroundColor={getBackgroundColor(active, disabled)}
          testID={testID ? `${testID}-switch-background` : 'switchBackground'}>
          <StyledToggle style={{ marginLeft }} />
        </StyledBackgroundColor>
      </TouchableOpacity>
    </FilterSwitchContainer>
  )
}

const getBackgroundColor = (active: boolean, disabled: boolean): ColorsEnum => {
  if (active) return disabled ? ColorsEnum.GREEN_DISABLED : ColorsEnum.GREEN_VALID
  return disabled ? ColorsEnum.GREY_DISABLED : ColorsEnum.GREY_MEDIUM
}

const StyledBackgroundColor = styled.View<{ backgroundColor: ColorsEnum }>(
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

const propsAreEqual = (
  prevProps: Readonly<React.PropsWithChildren<Props>>,
  nextProps: Readonly<React.PropsWithChildren<Props>>
) => prevProps.active === nextProps.active && prevProps.disabled === nextProps.disabled

export default memo(FilterSwitch, propsAreEqual)
