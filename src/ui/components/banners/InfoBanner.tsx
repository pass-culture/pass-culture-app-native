import React, { FunctionComponent, ReactNode } from 'react'
import { ViewStyle } from 'react-native'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { ColorsType } from 'theme/types'
import { GenericColoredBanner } from 'ui/components/banners/GenericColoredBanner'
import { AccessibleIcon } from 'ui/svg/icons/types'

type ColorMessageProps = {
  withLightColorMessage?: boolean
}

type Props = ColorMessageProps & {
  message: string | ReactNode
  icon?: FunctionComponent<AccessibleIcon>
  testID?: string
  backgroundColor?: ColorsType
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
  const { designSystem } = useTheme()
  const Icon =
    icon &&
    styled(icon).attrs(({ theme }) => ({
      color: theme.designSystem.color.icon.info,
      size: theme.icons.sizes.small,
    }))``

  const textColor = withLightColorMessage
    ? designSystem.color.text.subtle
    : designSystem.color.text.default

  return (
    <GenericColoredBanner
      messageContainerStyle={messageContainerStyle}
      message={message}
      Icon={Icon}
      backgroundColor={backgroundColor ?? designSystem.color.background.info}
      textColor={textColor}
      testID={testID}>
      {children}
    </GenericColoredBanner>
  )
}
