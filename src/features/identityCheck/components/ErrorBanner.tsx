import React, { FunctionComponent } from 'react'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { GenericColoredBanner } from 'ui/components/GenericColoredBanner'
import { Error } from 'ui/svg/icons/Error'

type Props = {
  message: string
  testID?: string
}

export const ErrorBanner: FunctionComponent<Props> = ({ message, testID, children }) => {
  const theme = useTheme()
  const Icon = StyledErrorIcon

  return (
    <GenericColoredBanner
      message={message}
      Icon={Icon}
      backgroundColor={theme.colors.errorLight}
      textColor={theme.colors.error}
      testID={testID}>
      {children}
    </GenericColoredBanner>
  )
}

const StyledErrorIcon = styled(Error).attrs(({ theme }) => ({
  color: theme.colors.error,
  size: theme.icons.sizes.small,
}))``
