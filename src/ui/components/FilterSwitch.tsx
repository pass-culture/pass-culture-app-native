import React, { memo, useEffect, useRef } from 'react'
import { Animated, Easing } from 'react-native'
import styled, { DefaultTheme } from 'styled-components/native'

import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { getShadow, getSpacing } from 'ui/theme'
import { HiddenCheckbox } from 'ui/web/inputs/HiddenCheckbox'

interface Props {
  active: boolean
  accessibilityLabel: string
  checkboxID?: string
  accessibilityDescribedBy?: string
  disabled?: boolean
  toggle: () => void
}

const TOGGLE_WIDTH = getSpacing(7)
const TOGGLE_PATH_START = 2
const TOGGLE_PATH_END = TOGGLE_WIDTH - TOGGLE_PATH_START

const FilterSwitch: React.FC<Props> = (props: Props) => {
  const { toggle, active = false, disabled = false, checkboxID } = props
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
        onPress={toggle}
        disabled={disabled}
        accessibilityValue={{ text: active.toString() }}
        accessibilityRole="switch"
        accessibilityState={{ checked: active }}
        {...accessibilityAndTestId(props.accessibilityLabel)}
        aria-describedby={props.accessibilityDescribedBy}>
        <StyledBackgroundColor active={active} disabled={disabled}>
          <StyledToggle style={{ marginLeft }} />
        </StyledBackgroundColor>
      </TouchableOpacity>
      <HiddenCheckbox
        id={checkboxID}
        name={props.accessibilityLabel}
        checked={active}
        accessibilityLabel={props.accessibilityLabel}
        onChange={toggle}
      />
    </FilterSwitchContainer>
  )
}

const getBackgroundColor = (theme: DefaultTheme, active: boolean, disabled: boolean) => {
  if (active) return disabled ? theme.uniqueColors.greenDisabled : theme.colors.greenValid
  return disabled ? theme.uniqueColors.greyDisabled : theme.colors.greyMedium
}

const TouchableOpacity = styled.TouchableOpacity.attrs(({ theme }) => ({
  activeOpacity: theme.activeOpacity,
}))``

const StyledBackgroundColor = styled.View<{ active: boolean; disabled: boolean }>(
  ({ theme, active, disabled }) => ({
    backgroundColor: getBackgroundColor(theme, active, disabled),
    width: getSpacing(14),
    height: getSpacing(8),
    marginLeft: getSpacing(5),
    borderRadius: getSpacing(4),
    justifyContent: 'center',
  })
)

const FilterSwitchContainer = styled.View({ flexDirection: 'row', alignItems: 'center' })

const StyledToggle = styled(Animated.View)(({ theme }) => ({
  aspectRatio: '1',
  width: TOGGLE_WIDTH,
  height: getSpacing(7),
  backgroundColor: theme.colors.white,
  borderRadius: getSpacing(7),
  ...getShadow({
    shadowOffset: {
      width: 0,
      height: getSpacing(0.5),
    },
    shadowRadius: 2.5,
    shadowColor: theme.colors.black,
    shadowOpacity: 0.2,
  }),
}))

const propsAreEqual = (
  prevProps: Readonly<React.PropsWithChildren<Props>>,
  nextProps: Readonly<React.PropsWithChildren<Props>>
) =>
  prevProps.active === nextProps.active &&
  prevProps.disabled === nextProps.disabled &&
  prevProps.checkboxID === nextProps.checkboxID

export default memo(FilterSwitch, propsAreEqual)
