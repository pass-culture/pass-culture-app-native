import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { useHandleHover } from 'libs/hooks/useHandleHover'
import { accessibleCheckboxProps } from 'shared/accessibilityProps/accessibleCheckboxProps'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { CheckboxMark } from 'ui/svg/icons/CheckBoxTMark'
import { getSpacing, Typo } from 'ui/theme'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'
import { getHoverStyle } from 'ui/theme/getHoverStyle/getHoverStyle'

type CheckboxBlockProps = {
  checked: boolean
  label: string
  sublabel?: string
  LeftIcon?: React.FC
  onPress: () => void
}

export const CheckboxBlock = ({
  checked,
  label,
  sublabel,
  LeftIcon,
  onPress,
}: CheckboxBlockProps) => {
  const focusProps = useHandleFocus()
  const hoverProps = useHandleHover()

  return (
    <StyledContainer
      checked={checked}
      onPress={onPress}
      {...focusProps}
      {...hoverProps}
      {...accessibleCheckboxProps({ checked, label: sublabel ? `${label} ${sublabel}` : label })}>
      <InnerContainer>
        {LeftIcon ? <LeftIcon /> : null}
        <View>
          <Typo.ButtonText>{label}</Typo.ButtonText>
          {sublabel ? <Typo.CaptionNeutralInfo>{sublabel}</Typo.CaptionNeutralInfo> : null}
        </View>
      </InnerContainer>
      <Box checked={checked}>{checked ? <CheckboxMark /> : null}</Box>
    </StyledContainer>
  )
}

const StyledContainer = styled(TouchableOpacity)<{
  checked: boolean
  isFocus: boolean
  isHover: boolean
}>(({ checked, isFocus, isHover, theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  minHeight: getSpacing(18),
  paddingHorizontal: getSpacing(4),
  borderRadius: getSpacing(2),
  borderWidth: getSpacing(checked ? 0.5 : 0.25),
  borderColor: checked ? theme.colors.black : theme.colors.greySemiDark,
  backgroundColor: theme.colors.white,
  ...customFocusOutline({ color: theme.colors.black, width: getSpacing(0.25), isFocus }),
  ...getHoverStyle(theme.colors.black, isHover),
}))

const InnerContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  gap: getSpacing(4),
})

const Box = styled.View<{ checked: boolean }>(({ checked, theme }) => ({
  justifyContent: 'center',
  alignItems: 'center',
  width: getSpacing(4),
  height: getSpacing(4),
  padding: getSpacing(1),
  borderRadius: getSpacing(0.5),
  borderWidth: getSpacing(0.25),
  borderColor: checked ? theme.colors.primary : theme.colors.greySemiDark,
  backgroundColor: checked ? theme.colors.primary : theme.colors.white,
}))
