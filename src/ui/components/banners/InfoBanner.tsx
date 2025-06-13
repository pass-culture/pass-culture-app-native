import React, { FunctionComponent, ReactNode } from 'react'
import { ViewStyle } from 'react-native'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { GenericColoredBanner } from 'ui/components/banners/GenericColoredBanner'
import { AccessibleIcon } from 'ui/svg/icons/types'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

type ColorMessageProps = {
  withLightColorMessage?: boolean
}

type Props = ColorMessageProps & {
  message: string | ReactNode
  icon?: FunctionComponent<AccessibleIcon>
  testID?: string
  backgroundColor?: ColorsEnum
  children?: React.ReactNode
  messageContainerStyle?: ViewStyle
}

export const InfoBanner: FunctionComponent<Props> = ({
  message,
  withLightColorMessage,
  icon,
  testID,
  backgroundColor,
  children,
  messageContainerStyle,
}) => {
  const theme = useTheme()
  const Icon =
    icon &&
    styled(icon).attrs(({ theme }) => ({
      color: theme.designSystem.color.icon.info,
      size: theme.icons.sizes.small,
    }))``

  const textColor = withLightColorMessage
    ? theme.designSystem.color.text.subtle
    : theme.designSystem.color.text.default

  return (
    <GenericColoredBanner
      messageContainerStyle={messageContainerStyle}
      message={message}
      Icon={Icon}
      backgroundColor={backgroundColor ?? theme.designSystem.color.background.info}
      textColor={textColor}
      testID={testID}>
      {children}
    </GenericColoredBanner>
  )
}
