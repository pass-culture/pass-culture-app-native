import React, { FunctionComponent, memo, useEffect, useRef } from 'react'
import { Animated, Easing } from 'react-native'
import styled, { DefaultTheme } from 'styled-components/native'

import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { accessibleCheckboxProps } from 'shared/accessibilityProps/accessibleCheckboxProps'
import { HiddenAccessibleText } from 'ui/components/HiddenAccessibleText'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { useSpaceBarAction } from 'ui/hooks/useSpaceBarAction'
import { Check as CheckIcon } from 'ui/svg/icons/Check'
import { Lock as LockIcon } from 'ui/svg/icons/Lock'
import { getShadow, getSpacing } from 'ui/theme'
import { HiddenCheckbox } from 'ui/web/inputs/HiddenCheckbox'

export interface FilterSwitchProps {
  active: boolean
  checkboxID?: string
  accessibilityDescribedBy?: string
  accessibilityLabelledBy?: string
  disabled?: boolean
  toggle: () => void
  testID?: string
}

const TOGGLE_WIDTH = getSpacing(7)
const TOGGLE_PATH_START = 2
const TOGGLE_PATH_END = TOGGLE_WIDTH - TOGGLE_PATH_START

const FilterSwitch: FunctionComponent<FilterSwitchProps> = (props) => {
  const { onFocus, onBlur, isFocus } = useHandleFocus()
  const { toggle, active = false, disabled = false, checkboxID, testID } = props
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  const hiddenTextStatus = active ? 'cochée' : 'non cochée'

  useSpaceBarAction(isFocus ? toggle : undefined)

  const testId = testID ? `Interrupteur-${testID}` : 'Interrupteur'

  return (
    <FilterSwitchContainer>
      <HiddenAccessibleText accessibilityHidden>
        Case à cocher - {hiddenTextStatus}
      </HiddenAccessibleText>
      <TouchableOpacity
        onPress={toggle}
        disabled={disabled}
        {...accessibleCheckboxProps({ checked: active })}
        accessibilityDescribedBy={props.accessibilityDescribedBy}
        accessibilityLabelledBy={props.accessibilityLabelledBy}
        onFocus={onFocus}
        onBlur={onBlur}
        testID={testId}>
        <StyledBackgroundColor active={active}>
          <StyledToggle style={{ marginLeft }} disabled={disabled}>
            {!!disabled && <Lock />}
            {!!active && !disabled ? <Check /> : null}
          </StyledToggle>
        </StyledBackgroundColor>
      </TouchableOpacity>
      <HiddenCheckbox id={checkboxID} checked={active} onChange={toggle} />
    </FilterSwitchContainer>
  )
}

const getBackgroundColor = (theme: DefaultTheme, active: boolean) => {
  if (active) return theme.colors.greenValid
  return theme.colors.greySemiDark
}

const StyledBackgroundColor = styled.View<{ active: boolean }>(({ theme, active }) => ({
  backgroundColor: getBackgroundColor(theme, active),
  width: getSpacing(14),
  height: getSpacing(8),
  borderRadius: getSpacing(4),
  justifyContent: 'center',
}))

const FilterSwitchContainer = styled.View({ flexDirection: 'row', alignItems: 'center' })

const StyledToggle = styled(Animated.View)<{ disabled: boolean }>(({ theme, disabled }) => ({
  aspectRatio: '1',
  width: TOGGLE_WIDTH,
  height: getSpacing(7),
  backgroundColor: theme.colors.white,
  borderRadius: getSpacing(7),
  alignItems: 'center',
  justifyContent: 'center',
  ...(!disabled
    ? {
        ...getShadow({
          shadowOffset: {
            width: 0,
            height: getSpacing(0.5),
          },
          shadowRadius: 2.5,
          shadowColor: theme.colors.black,
          shadowOpacity: 0.2,
        }),
      }
    : {}),
}))

const Lock = styled(LockIcon).attrs(({ theme }) => ({
  color: theme.colors.greyDark,
  size: theme.icons.sizes.extraSmall,
  accessibilityLabel: 'Désactivé',
}))``

const Check = styled(CheckIcon).attrs(({ theme }) => ({
  color: theme.colors.greenValid,
  size: theme.icons.sizes.extraSmall,
  accessibilityLabel: 'Activé',
}))``

const propsAreEqual = (
  prevProps: Readonly<React.PropsWithChildren<FilterSwitchProps>>,
  nextProps: Readonly<React.PropsWithChildren<FilterSwitchProps>>
) =>
  prevProps.active === nextProps.active &&
  prevProps.disabled === nextProps.disabled &&
  prevProps.checkboxID === nextProps.checkboxID &&
  prevProps.accessibilityLabelledBy === nextProps.accessibilityLabelledBy &&
  prevProps.accessibilityDescribedBy === nextProps.accessibilityDescribedBy

export default memo(FilterSwitch, propsAreEqual)
