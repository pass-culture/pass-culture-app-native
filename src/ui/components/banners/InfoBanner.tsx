import React, { FunctionComponent, ReactNode } from 'react'
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
}

export const InfoBanner: FunctionComponent<Props> = ({
  message,
  withLightColorMessage,
  icon,
  testID,
  backgroundColor,
  children,
}) => {
  const theme = useTheme()
  const Icon =
    icon &&
    styled(icon).attrs(({ theme }) => ({
      color: theme.colors.greyDark,
      color2: theme.colors.greyDark,
      size: theme.icons.sizes.small,
    }))``

  const textColor = withLightColorMessage ? theme.colors.greyDark : theme.colors.black
  return (
    <GenericColoredBanner
      message={message}
      Icon={Icon}
      backgroundColor={backgroundColor ?? theme.colors.secondaryLight100}
      textColor={textColor}
      testID={testID}>
      {children}
    </GenericColoredBanner>
  )
}
