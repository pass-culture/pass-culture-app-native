import React, { FunctionComponent, memo, useEffect, useRef } from 'react'
import { Animated, Easing } from 'react-native'
import styled, { DefaultTheme, useTheme } from 'styled-components/native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { ANIMATION_USE_NATIVE_DRIVER } from 'ui/components/animationUseNativeDriver'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { useSpaceBarAction } from 'ui/hooks/useSpaceBarAction'
import { CheckFilled } from 'ui/svg/icons/CheckFilled'
import { LockFilled } from 'ui/svg/icons/LockFilled'
import { HiddenCheckbox } from 'ui/web/inputs/HiddenCheckbox'

interface FilterSwitchProps {
  active: boolean
  checkboxID?: string
  accessibilityHint?: string
  accessibilityLabel?: string
  accessibilityLabelledBy?: string
  disabled?: boolean
  toggle: () => void
  testID?: string
}

const FilterSwitch: FunctionComponent<FilterSwitchProps> = (props) => {
  const { onFocus, onBlur, isFocus } = useHandleFocus()
  const { toggle, active = false, disabled = false, checkboxID, testID } = props
  const animatedValue = useRef(new Animated.Value(active ? 1 : 0)).current
  const { designSystem } = useTheme()

  const TOGGLE_SIZE = designSystem.size.spacing.xxl
  const TOGGLE_PATH_START = designSystem.size.spacing.xxs
  const TOGGLE_PATH_END = TOGGLE_SIZE - TOGGLE_PATH_START

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [TOGGLE_PATH_START, TOGGLE_PATH_END],
  })

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: active ? 1 : 0,
      duration: 200,
      easing: Easing.bezier(0, 0.75, 0, 0.75),
      useNativeDriver: ANIMATION_USE_NATIVE_DRIVER,
    }).start()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  const hiddenTextStatus = active ? 'coché' : 'non coché'

  const testIdFull = testID ? `Interrupteur ${testID}` : 'Interrupteur'

  const baseLabel = `Interrupteur à bascule - ${hiddenTextStatus}`
  const accessibilityLabel = props.accessibilityLabel
    ? `${props.accessibilityLabel} - ${baseLabel}`
    : baseLabel

  useSpaceBarAction(isFocus ? toggle : undefined)

  return (
    <FilterSwitchContainer>
      <TouchableOpacity
        onPress={toggle}
        disabled={disabled}
        accessibilityHint={props.accessibilityHint}
        accessibilityLabelledBy={props.accessibilityLabelledBy}
        onFocus={onFocus}
        onBlur={onBlur}
        testID={testIdFull}
        accessibilityRole={AccessibilityRole.SWITCH}
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ checked: active }}
        accessibilityChecked={active}>
        <StyledBackgroundColor active={active} toggleSize={TOGGLE_SIZE}>
          <StyledToggle
            style={{ transform: [{ translateX }] }}
            disabled={disabled}
            toggleSize={TOGGLE_SIZE}>
            {disabled ? <Lock /> : null}
            {!!active && !disabled ? <Check /> : null}
          </StyledToggle>
        </StyledBackgroundColor>
      </TouchableOpacity>
      <HiddenCheckbox id={checkboxID} checked={active} onChange={toggle} />
    </FilterSwitchContainer>
  )
}

// TODO(PC-36607): background.succes or background.subtle are too light for switch
const getBackgroundColor = (theme: DefaultTheme, active: boolean) => {
  if (active) return theme.designSystem.color.icon.success
  return theme.designSystem.color.icon.subtle
}

const StyledBackgroundColor = styled.View<{
  active: boolean
  toggleSize: number
}>(({ theme, active, toggleSize }) => ({
  backgroundColor: getBackgroundColor(theme, active),
  width: toggleSize * 2,
  height: toggleSize + theme.designSystem.size.spacing.xs,
  borderRadius: theme.designSystem.size.borderRadius.xxl,
  justifyContent: 'center',
}))

const FilterSwitchContainer = styled.View({ flexDirection: 'row', alignItems: 'center' })

const StyledToggle = styled(Animated.View)<{ disabled: boolean; toggleSize: number }>(
  ({ theme, toggleSize }) => ({
    aspectRatio: '1',
    width: toggleSize,
    height: toggleSize,
    backgroundColor: theme.designSystem.color.background.default,
    borderRadius: theme.designSystem.size.borderRadius.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  })
)

const Lock = styled(LockFilled).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.disabled,
  size: theme.icons.sizes.extraSmall,
}))``

const Check = styled(CheckFilled).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.success,
  size: theme.icons.sizes.extraSmall,
}))``

const propsAreEqual = (
  prevProps: Readonly<React.PropsWithChildren<FilterSwitchProps>>,
  nextProps: Readonly<React.PropsWithChildren<FilterSwitchProps>>
) =>
  prevProps.active === nextProps.active &&
  prevProps.disabled === nextProps.disabled &&
  prevProps.checkboxID === nextProps.checkboxID &&
  prevProps.accessibilityLabelledBy === nextProps.accessibilityLabelledBy &&
  prevProps.accessibilityHint === nextProps.accessibilityHint

export default memo(FilterSwitch, propsAreEqual)
