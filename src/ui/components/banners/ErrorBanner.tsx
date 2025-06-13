import React, { FunctionComponent } from 'react'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { GenericColoredBanner } from 'ui/components/banners/GenericColoredBanner'
import { Error } from 'ui/svg/icons/Error'

type Props = {
  message: string
  children?: React.ReactNode
  testID?: string
}

export const ErrorBanner: FunctionComponent<Props> = ({ message, testID, children }) => {
  const theme = useTheme()
  const Icon = StyledErrorIcon

  return (
    <GenericColoredBanner
      message={message}
      Icon={Icon}
      backgroundColor={theme.designSystem.color.background.error}
      textColor={theme.designSystem.color.text.error}
      testID={testID}>
      {children}
    </GenericColoredBanner>
  )
}

const StyledErrorIcon = styled(Error).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.error,
  color2: theme.designSystem.color.icon.error,
  size: theme.icons.sizes.small,
}))``
