import React, { FunctionComponent, useRef } from 'react'
import styled from 'styled-components/native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { useArrowNavigationForRadioButton } from 'ui/hooks/useArrowNavigationForRadioButton'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { Spacer, TypoDS } from 'ui/theme'

type Props = {
  label: string
  info: string
  Icon: FunctionComponent<AccessibleIcon>
  onPress: () => void
}

export const SuggestedResult: FunctionComponent<Props> = ({ label, info, Icon, onPress }) => {
  const containerRef = useRef(null)
  const { onFocus, onBlur } = useHandleFocus()
  useArrowNavigationForRadioButton(containerRef)

  const accessibilityLabel = `${label} ${info}`
  return (
    <TouchableOpacity
      // so that an iOS user can press it without dismissing the keyboard
      shouldUseGestureHandler
      accessibilityRole={AccessibilityRole.BUTTON}
      onFocus={onFocus}
      onBlur={onBlur}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}>
      <RefContainer ref={containerRef}>
        <Icon />
        <Spacer.Row numberOfSpaces={1} />
        <Text>
          <TypoDS.BodySemiBold>{label}</TypoDS.BodySemiBold>
          <Spacer.Row numberOfSpaces={1} />
          <TypoDS.Body>{info}</TypoDS.Body>
        </Text>
      </RefContainer>
    </TouchableOpacity>
  )
}

const RefContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
})

const Text = styled.Text.attrs({
  numberOfLines: 2,
})(({ theme }) => ({
  color: theme.colors.black,
  flex: 1,
}))
